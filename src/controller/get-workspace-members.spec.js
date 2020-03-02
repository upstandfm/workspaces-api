'use strict';

const bodyParser = require('@mooncake-dev/lambda-body-parser');
const createResHandler = require('@mooncake-dev/lambda-res-handler');
const createController = require('.');

const userId = 'user|56ea6578fea85678ae4e4a65';
const workspaceId = 'a2xpQr34';

const fakeMembers = [
  {
    id: 'Pq2e4c1',
    createdBy: 'system',
    createdAt: '2020-01-01T12:00:01.113Z',
    updatedAt: '2020-01-01T12:00:01.113Z',
    email: 'daniel@upstand.fm',
    fullName: 'Daniël Illouz'
  },
  {
    id: 'Qw2pR5x',
    createdBy: 'system',
    createdAt: '2020-01-01T12:14:31.512Z',
    updatedAt: '2020-01-01T12:14:31.512Z',
    email: 'rick@upstand.fm',
    fullName: 'Rick Sanchez'
  }
];

const fakeWorkspaceService = {
  getMembers: () => Promise.resolve(fakeMembers)
};

const options = {
  bodyParser,
  res: createResHandler()
};

const controller = createController(fakeWorkspaceService, options);

const fakeEvent = {
  resource: '',
  path: `/${workspaceId}/members`,
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

const requiredScope = 'read:workspace-members';

describe('getWorkspaceMembers(event, context, requiredScope)', () => {
  it('returns error as JSON response with missing authorizer data', async () => {
    const res = await controller.getWorkspaceMembers(
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
    const res = await controller.getWorkspaceMembers(
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
    const res = await controller.getWorkspaceMembers(
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
    const res = await controller.getWorkspaceMembers(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 403,
      body: JSON.stringify({
        message: 'Forbidden',
        details: 'You need scope "read:workspace-members"'
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
          scope: 'read:workyspacing-membas'
        }
      }
    };
    const res = await controller.getWorkspaceMembers(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 403,
      body: JSON.stringify({
        message: 'Forbidden',
        details: 'You need scope "read:workspace-members"'
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
    const res = await controller.getWorkspaceMembers(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 200,
      body: JSON.stringify({
        items: fakeMembers
      })
    });
  });
});
