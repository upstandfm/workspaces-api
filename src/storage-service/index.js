'use strict';

/**
 * Create DynamoDB storage service.
 *
 * @param {Object} client - DynamoDB document client
 * @param {String} tableName
 *
 * @return {Object} Storage service interface
 */
module.exports = function createStorageService(client, tableName) {
  if (!client) {
    throw new Error('Provide a storage client');
  }

  if (!tableName) {
    throw new Error('Provide a table name');
  }

  return {
    /**
     * Get workspace item.
     *
     * @param {String} workspaceId
     *
     * @return {Promise} Resolves with item
     *
     * For SDK documentation see:
     * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
     */
    getWorkspace(workspaceId) {
      const params = {
        TableName: tableName,
        // For reserved keywords see:
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html
        ExpressionAttributeNames: {
          '#n': 'name'
        },
        Key: {
          pk: `workspace#${workspaceId}`,
          sk: `workspace#${workspaceId}`
        },
        ProjectionExpression: 'id, createdBy, createdAt, updatedAt, #n, slug'
      };
      return client
        .get(params)
        .promise()
        .then(res => res.Item);
    },

    /**
     * Get all workspace member items.
     *
     * @param {String} workspaceId
     *
     * @return {Promise} Resolves with items
     *
     * For SDK documentation see:
     * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property
     */
    getWorkspaceMembers(workspaceId) {
      const params = {
        TableName: tableName,
        ExpressionAttributeValues: {
          ':pk': `workspace#${workspaceId}`,
          ':sk_start': 'member#'
        },
        KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk_start)',
        ProjectionExpression:
          'id, createdBy, createdAt, updatedAt, fullName, email'
      };
      return client
        .query(params)
        .promise()
        .then(res => res.Items);
    }
  };
};
