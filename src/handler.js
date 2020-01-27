'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const createResHandler = require('@mooncake-dev/lambda-res-handler');
const workspaces = require('./workspaces');
const handleAndSendError = require('./handle-error');
const { validateAuthorizerData, validateScope } = require('./validators');

const {
  CORS_ALLOW_ORIGIN,
  WORKSPACES_TABLE_NAME,
  READ_WORKSPACE_SCOPE
} = process.env;

const defaultHeaders = {
  'Access-Control-Allow-Origin': CORS_ALLOW_ORIGIN
};
const sendRes = createResHandler(defaultHeaders);

// For more info see:
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#constructor-property
const documentClient = new DynamoDB.DocumentClient({
  convertEmptyValues: true
});

/**
 * Lambda APIG proxy integration that gets the user's workspace.
 *
 * @param {Object} event - HTTP input
 * @param {Object} context - AWS lambda context
 *
 * @return {Object} HTTP output
 *
 * For more info on HTTP input see:
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 *
 * For more info on AWS lambda context see:
 * https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 *
 * For more info on HTTP output see:
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
 */
module.exports.getWorkspace = async (event, context) => {
  try {
    const { authorizer } = event.requestContext;

    validateAuthorizerData(authorizer);
    validateScope(authorizer.scope, READ_WORKSPACE_SCOPE);

    if (event.pathParameters.workspaceId !== authorizer.workspaceId) {
      const err = new Error('Not Found');
      err.statusCode = 404;
      err.details = `You might not have access to this workspace, or it doesn't exist.`;
      throw err;
    }

    const workspaceData = await workspaces.getOne(
      documentClient,
      WORKSPACES_TABLE_NAME,
      authorizer.workspaceId
    );

    if (!workspaceData.Item) {
      const err = new Error('Not Found');
      err.statusCode = 404;
      err.details = `You might not have access to this workspace, or it doesn't exist.`;
      throw err;
    }

    return sendRes.json(200, workspaceData.Item);
  } catch (err) {
    return handleAndSendError(context, err, sendRes);
  }
};
