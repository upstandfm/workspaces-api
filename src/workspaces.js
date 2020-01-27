'use strict';

module.exports = {
  /**
   * Get a single workspace.
   *
   * For SDK documentation see:
   * https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property
   *
   * @param {Object} client - DynamoDB document client
   * @param {String} tableName
   * @param {String} workspaceId
   *
   * @return {Promise} Resolves with DynamoDB data
   */
  getOne(client, tableName, workspaceId) {
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
    return client.get(params).promise();
  }
};
