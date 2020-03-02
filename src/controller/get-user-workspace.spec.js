'use strict';

const bodyParser = require('@mooncake-dev/lambda-body-parser');
const createResHandler = require('@mooncake-dev/lambda-res-handler');
const createController = require('.');

const userId = 'user|56ea6578fea85678ae4e4a65';
const workspaceId = 'a2xpQr34';

const fakeWorkspace = {
  id: workspaceId,
  createdBy: userId,
  createdAt: '2020-03-02T12:13:51.264Z',
  updatedAt: '2020-03-02T12:13:51.264Z',
  name: 'Fake workspace',
  slug: 'fake-workspace'
};

const fakeWorkspaceService = {
  get: () => Promise.resolve(fakeWorkspace)
};

const options = {
  bodyParser,
  res: createResHandler()
};

const controller = createController(fakeWorkspaceService, options);

const fakeEvent = {
  resource: '',
  path: `/${workspaceId}`,
  httpMethod: 'GET',
  headers: {},
  multiValueHeaders: {},
  queryStringParameters: {},
  multiValueQueryStringParameters: {},
  pathParameters: {
    workspaceId
  },
  stageVariables: {},
  requestContext: {},
  body: '',
  isBase64Encoded: false
};

const fakeContext = {
  captureError: () => undefined
};

const requiredScope = 'read:workspace';

describe('getUserWorkspace(event, context, requiredScope)', () => {
  it('returns error as JSON response with missing authorizer data', async () => {
    const res = await controller.getUserWorkspace(
      fakeEvent,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 500,
      body: JSON.stringify({
        message: 'Missing authorizer data',
        details: 'Corrupt authorizer data. Contact "support@upstand.fm"'
      })
    });
  });

  it('returns error as JSON response with missing authorizer user ID', async () => {
    const event = {
      ...fakeEvent,
      requestContext: {
        authorizer: {}
      }
    };
    const res = await controller.getUserWorkspace(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 500,
      body: JSON.stringify({
        message: 'Missing user id',
        details: 'Corrupt authorizer data. Contact "support@upstand.fm"'
      })
    });
  });

  it('returns error as JSON response with missing authorizer workspace ID', async () => {
    const event = {
      ...fakeEvent,
      requestContext: {
        authorizer: {
          userId
        }
      }
    };
    const res = await controller.getUserWorkspace(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 500,
      body: JSON.stringify({
        message: 'Missing workspace id',
        details: 'Corrupt authorizer data. Contact "support@upstand.fm"'
      })
    });
  });

  it('returns error as JSON response with missing scope', async () => {
    const event = {
      ...fakeEvent,
      requestContext: {
        authorizer: {
          userId,
          workspaceId
        }
      }
    };
    const res = await controller.getUserWorkspace(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 403,
      body: JSON.stringify({
        message: 'Forbidden',
        details: 'You need scope "read:workspace"'
      })
    });
  });

  it('returns error as JSON response with incorrect scope', async () => {
    const event = {
      ...fakeEvent,
      requestContext: {
        authorizer: {
          userId,
          workspaceId,
          scope: 'read:workyspacing'
        }
      }
    };
    const res = await controller.getUserWorkspace(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 403,
      body: JSON.stringify({
        message: 'Forbidden',
        details: 'You need scope "read:workspace"'
      })
    });
  });

  it('returns workspace as JSON response', async () => {
    const event = {
      ...fakeEvent,
      requestContext: {
        authorizer: {
          userId,
          workspaceId,
          scope: requiredScope
        }
      }
    };
    const res = await controller.getUserWorkspace(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 200,
      body: JSON.stringify(fakeWorkspace)
    });
  });
});
