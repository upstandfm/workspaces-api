'use strict';

const DynamoDB = require('aws-sdk/clients/dynamodb');
const bodyParser = require('@mooncake-dev/lambda-body-parser');
const createResHandler = require('@mooncake-dev/lambda-res-handler');
const createStorageService = require('./storage-service');
const createWorkspaceService = require('./workspace-service');
const createController = require('./controller');
const { captureError } = require('./utils');

const {
  CORS_ALLOW_ORIGIN,
  WORKSPACES_TABLE_NAME,
  READ_WORKSPACE_SCOPE,
  READ_WORKSPACE_MEMBERS_SCOPE
} = process.env;

// For more info see:
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#constructor-property
const documentClient = new DynamoDB.DocumentClient({
  convertEmptyValues: true
});

const storageService = createStorageService(
  documentClient,
  WORKSPACES_TABLE_NAME
);

const workspaceService = createWorkspaceService(storageService);

const defaultHeaders = {
  'Access-Control-Allow-Origin': CORS_ALLOW_ORIGIN
};
const controller = createController(workspaceService, {
  bodyParser,
  res: createResHandler(defaultHeaders)
});

/**
 * Lambda APIG proxy integration that gets a user's workspace.
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
module.exports.getUserWorkspace = async (event, context) => {
  try {
    const res = await controller.getUserWorkspace(
      event,
      context,
      READ_WORKSPACE_SCOPE
    );
    return res;
  } catch (err) {
    console.log('Failed to get workspace: ', err);
    captureError(context, err);
  }
};

/**
 * Lambda APIG proxy integration that gets all workspace members.
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
module.exports.getWorkspaceMembers = async (event, context) => {
  try {
    const res = await controller.getWorkspaceMembers(
      event,
      context,
      READ_WORKSPACE_MEMBERS_SCOPE
    );
    return res;
  } catch (err) {
    console.log('Failed to get workspace members: ', err);
    captureError(context, err);
  }
};
