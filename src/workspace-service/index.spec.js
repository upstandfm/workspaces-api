'use strict';

const createWorkspaceService = require('./');

describe('Workspace service', () => {
  describe('createWorkspaceService(db)', () => {
    it('throws without storage service', () => {
      expect(() => {
        createWorkspaceService();
      }).toThrowError(/^Provide a storage service$/);
    });

    it('creates workspace service', () => {
      expect(() => {
        const fakeStorage = {};
        createWorkspaceService(fakeStorage);
      }).not.toThrowError();
    });
  });

  describe('workspaceService.get(workspaceId)', () => {
    it('calls storage service with workspace ID', async () => {
      const fakeStorage = {
        getWorkspace: jest.fn(() => Promise.resolve())
      };
      const workspaceService = createWorkspaceService(fakeStorage);
      const workspaceId = '1zxE3D2';
      await workspaceService.get(workspaceId);

      // Check if we call the storage service
      expect(fakeStorage.getWorkspace.mock.calls.length).toEqual(1);

      // Check if the storage service is called with correct item data
      const input = fakeStorage.getWorkspace.mock.calls[0][0];
      expect(input).toEqual(workspaceId);
    });
  });

  describe('workspaceService.getMembers(workspaceId)', () => {
    it('calls storage service with workspace ID', async () => {
      const fakeStorage = {
        getWorkspaceMembers: jest.fn(() => Promise.resolve())
      };
      const workspaceService = createWorkspaceService(fakeStorage);
      const workspaceId = '1zxE3D2';
      await workspaceService.getMembers(workspaceId);

      // Check if we call the storage service
      expect(fakeStorage.getWorkspaceMembers.mock.calls.length).toEqual(1);

      // Check if the storage service is called with correct item data
      const input = fakeStorage.getWorkspaceMembers.mock.calls[0][0];
      expect(input).toEqual(workspaceId);
    });
  });
});
