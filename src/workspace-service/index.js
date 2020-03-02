'use strict';

/**
 * Create Workspace service.
 *
 * @param {Object} db - Storage service
 *
 * @return {Object} Invites service interface
 */
module.exports = function createWorkspaceService(db) {
  if (!db) {
    throw new Error('Provide a storage service');
  }

  return {
    /**
     * Get a workspace.
     *
     * @param {String} workspaceId
     *
     * @return {Promise} Resolves with workspace
     */
    get(workspaceId) {
      return db.getWorkspace(workspaceId);
    },

    /**
     * Get all workspace members.
     *
     * @param {String} workspaceId
     *
     * @return {Promise} Resolves with workspace member list
     */
    getMembers(workspaceId) {
      return db.getWorkspaceMembers(workspaceId);
    }
  };
};
