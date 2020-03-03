'use strict';

const createController = require('.');

describe('Controller', () => {
  describe('createController(workspace, options)', () => {
    it('throws without a workspace service', () => {
      expect(() => {
        createController();
      }).toThrowError(/^Provide a workspace service$/);
    });

    it('throws without JSON body parser', () => {
      expect(() => {
        const fakeWorkspaceService = {};
        const options = {
          bodyParser: {
            json: undefined
          },
          res: {
            json: () => undefined
          }
        };
        createController(fakeWorkspaceService, options);
      }).toThrowError(/^Provide a body parser function to parse JSON strings$/);
    });

    it('throws when JSON body parser is not a function', () => {
      expect(() => {
        const fakeWorkspaceService = {};
        const options = {
          bodyParser: {
            json: 1
          },
          res: {
            json: () => undefined
          }
        };
        createController(fakeWorkspaceService, options);
      }).toThrowError(/^Provide a body parser function to parse JSON strings$/);
    });

    it('throws without JSON response handler', () => {
      expect(() => {
        const fakeWorkspaceService = {};
        const options = {
          bodyParser: {
            json: () => undefined
          },
          res: {
            json: undefined
          }
        };
        createController(fakeWorkspaceService, options);
      }).toThrowError(/^Provide a function to send JSON responses$/);
    });

    it('throws when JSON response handler is not a function', () => {
      expect(() => {
        const fakeWorkspaceService = {};
        const options = {
          bodyParser: {
            json: () => undefined
          },
          res: {
            json: 'hello'
          }
        };
        createController(fakeWorkspaceService, options);
      }).toThrowError(/^Provide a function to send JSON responses$/);
    });

    it('creates controller', () => {
      expect(() => {
        const fakeWorkspaceService = {};
        const options = {
          bodyParser: {
            json: () => undefined
          },
          res: {
            json: () => undefined
          }
        };
        createController(fakeWorkspaceService, options);
      }).not.toThrowError();
    });
  });
});
