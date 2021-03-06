'use strict';

const { captureError } = require('../utils');
const { validateAuthorizerData, validateScope } = require('../validators');
const schema = require('../schema');

/**
 * Create a controller to handle HTTP requests.
 *
 * @param {Object} workspace - Workspace service
 * @param {Object} options
 *
 * @param {Object} options.bodyParser
 * @param {Function} options.bodyParser.json - Parse a JSON string
 *
 * @param {Object} options.res
 * @param {Function} options.res.json - Send a JSON response
 *
 * @return {Object} Controller interface
 */
module.exports = function createController(workspace, options = {}) {
  if (!workspace) {
    throw new Error('Provide a workspace service');
  }

  const { bodyParser = {}, res = {} } = options;

  if (!bodyParser.json || typeof bodyParser.json !== 'function') {
    throw new Error('Provide a body parser function to parse JSON strings');
  }

  if (!res.json || typeof res.json !== 'function') {
    throw new Error('Provide a function to send JSON responses');
  }

  return {
    /**
     * Get a user's workspace.
     *
     * @param {Object} event - Lambda HTTP input
     * @param {Object} context - Lambda context
     * @param {String} requiredScope - The scope a consumer must have to perform this action
     *
     * @return {Promise} Resolves with HTTP output object
     *
     */
    async getUserWorkspace(event, context, requiredScope) {
      try {
        const { authorizer } = event.requestContext;

        validateAuthorizerData(authorizer);
        validateScope(authorizer.scope, requiredScope);

        if (event.pathParameters.workspaceId !== authorizer.workspaceId) {
          const err = new Error('Not Found');
          err.statusCode = 404;
          err.details = `You might not have access to this workspace, or it doesn't exist.`;
          throw err;
        }

        const item = await workspace.get(authorizer.workspaceId);

        if (!item) {
          const err = new Error('Not Found');
          err.statusCode = 404;
          err.details = `You might not have access to this workspace, or it doesn't exist.`;
          throw err;
        }

        return res.json(200, item);
      } catch (err) {
        captureError(context, err);

        const statusCode = err.statusCode || 500;
        const resData = {
          message: err.message,
          details: err.details
        };
        return res.json(statusCode, resData);
      }
    },

    /**
     * Get all workspace members.
     *
     * @param {Object} event - Lambda HTTP input
     * @param {Object} context - Lambda context
     * @param {String} requiredScope - The scope a consumer must have to perform this action
     *
     * @return {Promise} Resolves with HTTP output object
     *
     */
    async getWorkspaceMembers(event, context, requiredScope) {
      try {
        const { authorizer } = event.requestContext;

        validateAuthorizerData(authorizer);
        validateScope(authorizer.scope, requiredScope);

        if (event.pathParameters.workspaceId !== authorizer.workspaceId) {
          const err = new Error('Not Found');
          err.statusCode = 404;
          err.details = `You might not have access to this workspace, or it doesn't exist.`;
          throw err;
        }

        const items = await workspace.getMembers(authorizer.workspaceId);
        const resData = {
          items
        };
        return res.json(200, resData);
      } catch (err) {
        captureError(context, err);

        const statusCode = err.statusCode || 500;
        const resData = {
          message: err.message,
          details: err.details
        };
        return res.json(statusCode, resData);
      }
    },

    /**
     * Create a workspace member.
     *
     * @param {Object} event - Lambda HTTP input
     * @param {Object} context - Lambda context
     * @param {String} requiredScope - The scope a consumer must have to perform this action
     *
     * @return {Promise} Resolves with HTTP output object
     *
     */
    async createWorkspaceMember(event, context, requiredScope) {
      try {
        // We don't explicitly validate the authorizer data because this
        // endpoint may only be called by a "machine client", so we don't have
        // user-specific information like workspace ID and user ID
        //
        // Technically we have a user ID, but in this case its the client ID of
        // the machine client, and not the user's ID
        const { authorizer = {} } = event.requestContext;

        validateScope(authorizer.scope, requiredScope);

        const body = bodyParser.json(event.body);
        const data = schema.validateMember(body);
        const item = await workspace.createMember(
          event.pathParameters.workspaceId,
          data
        );

        return res.json(201, item);
      } catch (err) {
        captureError(context, err);

        const statusCode = err.statusCode || 500;
        const resData = {
          message: err.message,
          details: err.details
        };
        return res.json(statusCode, resData);
      }
    }
  };
};
