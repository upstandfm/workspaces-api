'use strict';

const bodyParser = require('@mooncake-dev/lambda-body-parser');
const createResHandler = require('@mooncake-dev/lambda-res-handler');
const createController = require('.');

const workspaceId = 'a2xpQr34';
const userId = 'user|56ea6578fea85678ae4e4a65';

const fakeMember = {
  id: 'EjezHSJY',
  workspaceId,
  createdBy: 'system',
  createdAt: '2020-03-02T14:15:12.187Z',
  updatedAt: '2020-03-02T14:15:12.187Z',
  email: 'daniel@upstand.fm',
  fullName: 'Daniël Illouz'
};

const fakeWorkspaceService = {
  createMember: () => Promise.resolve(fakeMember)
};

const options = {
  bodyParser,
  res: createResHandler()
};

const controller = createController(fakeWorkspaceService, options);

const fakeEvent = {
  resource: '',
  path: `/${workspaceId}/members`,
  httpMethod: 'POST',
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

const requiredScope = 'create:workspace-member';

describe('controller.createWorkspaceMember(event, context, requiredScope)', () => {
  it('returns error as JSON response with missing scope', async () => {
    const res = await controller.createWorkspaceMember(
      fakeEvent,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 403,
      body: JSON.stringify({
        message: 'Forbidden',
        details: 'You need scope "create:workspace-member"'
      })
    });
  });

  it('returns error as JSON response with incorrect scope', async () => {
    const event = {
      ...fakeEvent,
      requestContext: {
        authorizer: {
          scope: 'create:workyspace-memba'
        }
      }
    };
    const res = await controller.createWorkspaceMember(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 403,
      body: JSON.stringify({
        message: 'Forbidden',
        details: 'You need scope "create:workspace-member"'
      })
    });
  });

  it('returns error as JSON response with missing user ID in request body', async () => {
    const event = {
      ...fakeEvent,
      requestContext: {
        authorizer: {
          scope: requiredScope
        }
      },
      body: JSON.stringify({})
    };
    const res = await controller.createWorkspaceMember(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request data',
        details: ['"userId" is required']
      })
    });
  });

  it('returns error as JSON response with missing email in request body', async () => {
    const event = {
      ...fakeEvent,
      requestContext: {
        authorizer: {
          scope: requiredScope
        }
      },
      body: JSON.stringify({
        userId
      })
    };
    const res = await controller.createWorkspaceMember(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request data',
        details: ['"email" is required']
      })
    });
  });

  it('returns error as JSON response with invalid email in request body', async () => {
    const event = {
      ...fakeEvent,
      requestContext: {
        authorizer: {
          scope: requiredScope
        }
      },
      body: JSON.stringify({
        userId,
        email: 'https://www.upstand.fm'
      })
    };
    const res = await controller.createWorkspaceMember(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request data',
        details: ['"email" must be a valid email']
      })
    });
  });

  it('returns error as JSON response with invalid full name in request body', async () => {
    const event = {
      ...fakeEvent,
      requestContext: {
        authorizer: {
          scope: requiredScope
        }
      },
      body: JSON.stringify({
        userId,
        email: fakeMember.email,
        fullName: 1
      })
    };
    const res = await controller.createWorkspaceMember(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request data',
        details: ['"fullName" must be a string']
      })
    });
  });

  it('returns error as JSON response with too long full name in request body', async () => {
    const event = {
      ...fakeEvent,
      requestContext: {
        authorizer: {
          scope: requiredScope
        }
      },
      body: JSON.stringify({
        userId,
        email: fakeMember.email,
        fullName:
          'Hello this is a very long piece of text to see if we validate for too long strings'
      })
    };
    const res = await controller.createWorkspaceMember(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid request data',
        details: [
          '"fullName" length must be less than or equal to 70 characters long'
        ]
      })
    });
  });

  it('returns created member as JSON response', async () => {
    const event = {
      ...fakeEvent,
      requestContext: {
        authorizer: {
          scope: requiredScope
        }
      },
      body: JSON.stringify({
        userId,
        email: fakeMember.email,
        fullName: fakeMember.fullName
      })
    };
    const res = await controller.createWorkspaceMember(
      event,
      fakeContext,
      requiredScope
    );

    expect(res).toEqual({
      headers: {},
      statusCode: 201,
      body: JSON.stringify(fakeMember)
    });
  });
});
