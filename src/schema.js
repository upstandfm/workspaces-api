'use strict';

const Joi = require('@hapi/joi');

const defaultJoi = Joi.defaults(_schema =>
  _schema.options({
    stripUnknown: true
  })
);

const _MemberSchema = defaultJoi.object().keys({
  userId: Joi.string().required(),

  email: Joi.string()
    .email({
      tlds: {
        // Disable TLD validation to allow any TLD as valid
        // For more info see:
        // https://hapi.dev/family/joi/api/?v=17.1.0#stringemailoptions
        allow: false
      }
    })
    .required(),

  fullName: Joi.string()
    // Empty string is not allowed by default
    // For more info see:
    // https://hapi.dev/family/joi/?v=16.1.8#string
    .empty('')
    .max(70)
});

function _validate(data, schema) {
  const { error: joiErr, value } = schema.validate(data);

  // For Joi "error" see:
  // https://github.com/hapijs/joi/blob/master/API.md#validationerror
  if (joiErr) {
    const err = new Error('Invalid request data');
    err.statusCode = 400;
    err.details = joiErr.details.map(e => e.message);
    throw err;
  }

  return value;
}

module.exports = {
  validateMember(data = {}) {
    return _validate(data, _MemberSchema);
  }
};
