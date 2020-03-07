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
    },

    /**
     * Create a workspace member.
     *
     * @param {String} workspaceId
     * @param {Object} data
     *
     * @param {String} data.userId
     * @param {String} data.email
     * @param {String} data.fullName
     *
     * @return {Promise} Resolves with created member
     */
    createMember(workspaceId, data) {
      const now = new Date().toISOString();
      const item = {
        id: data.userId,
        createdBy: 'system',
        createdAt: now,
        updatedAt: now,
        email: data.email,
        fullName: data.fullName
      };
      return db.insertWorkspaceMember(workspaceId, item);
    }
  };
};
