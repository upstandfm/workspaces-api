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

  describe('workspaceService.createMember(workspaceId, data)', () => {
    it('calls storage service with workspace ID and member data', async () => {
      const fakeStorage = {
        insertWorkspaceMember: jest.fn(() => Promise.resolve())
      };
      const workspaceService = createWorkspaceService(fakeStorage);

      const workspaceId = '2WqPx7dl';
      const data = {
        userId: '1zxE3D2',
        email: 'daniel@upstand.fm',
        fullName: 'Daniël Illouz'
      };

      await workspaceService.createMember(workspaceId, data);

      // Check if we call the storage service
      expect(fakeStorage.insertWorkspaceMember.mock.calls.length).toEqual(1);

      // Check if the storage service is called with correct workspace ID
      const workspaceIdInput =
        fakeStorage.insertWorkspaceMember.mock.calls[0][0];
      expect(workspaceIdInput).toEqual(workspaceId);

      // Check if the storage service is called with correct item data
      const itemInput = fakeStorage.insertWorkspaceMember.mock.calls[0][1];
      expect(itemInput.id).toEqual(data.userId);
      expect(itemInput.email).toEqual(data.email);
      expect(itemInput.fullName).toEqual(data.fullName);
      expect(itemInput.createdBy).toEqual('system');
      expect(itemInput.createdAt).toExist;
      expect(itemInput.updatedAt).toExist;
    });
  });
});
