'use strict';

let constants = {};

constants.SERVER = {
  ADMINPASSWORD: process.env.ADMIN_PASSWORD,
  PROJECT_NAME: `Demo_express`,
  API_KEY: `jun6eaqrOPaksZL1PIkjtQoe`,
  API_SECRETE: `alqrOdasfdaddafasdfafae`,
  DESCRIPTION: `Demo expres with new version of swagger documentation. We have used mongoose with bluebird for handling async behaviours`,
  JWT_SECRET: `fasdkfjklandfkdsfjladsfodfafjalfadsfkads`,
  BCRYPT_SALT: 10,
  ARRAY_FIRST_INDEX: 0,
  NOT_FOUND_INDEX: -1,
  GUEST_PREFIX: 'guest_'
};

constants.statusCode = {
  MONGOEXPECTION: 100,
  MISSCELANEOUSAPI: 200,
  NOTFOUND: 404,
  USERALREADYEXISTS: 405,
  BADREQUEST: 400,
  SUCCESS: 200
};

constants.USER_ROLES = {
  1 : "USER",
};

constants.LOGIN_TYPE = {
    NORMAL: 1,
    FB: 2,
    GUEST: 3
};

constants.THIRD_PARTY_LOGIN = [2];

constants.AVAILABLE_AUTHS = {
  SUPER_ADMIN: 'USER'
};

constants.EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

constants.MESSAGES = {
  MONGOERROR: 'Database error',
  BAD_REQUEST: 'Bad Request.',
  NOT_FOUND: 'Not found.',
  UNAUTHORIZED:'Un-authorized access.',
  INVALID_PASSWORD: 'Invalid password',
  INVALID_CREDENTIALS: 'Invalid credentials.',
  EMAIL_ALREADY_EXISTS: 'Email already registered! Please enter another email.',
  NAME_ALREADY_EXISTS: 'Name already registered! Please enter another name.',
  FILE_FORMAT_NOT_SUPPORTED: 'File format not supported.',
  REGISTERED_SUCCESSFULLY: 'Registered successfully.',
  SOMETHING_WENT_WRONG: 'Something went wrong.',
  LOGGED_IN_SUCCESSFULLY: 'Logged in successfully.',
  USER_ALREADY_EXIST:'User already exists with same name/email.',
  PASSWORD_REQUIRED:'Password required.',
  USER_FETCHED_SUCCESSFULLY: 'Success.',
  USER_DELETED: 'User data is successfully deleted.',
  USER_UPDATED: 'User data is successfully updated.',
  EMAIL_REQUIRED:'Email required.',

};

constants.FB_GRAPH_API = 'https://graph.facebook.com/me?fields=email,gender,name,picture.type(large),birthday,age_range&access_token=';

constants.EXISTING_SINGLE_CATEGORY_ID = '5b28e5a73235d6291cb036ab';

constants.EMAIL_TYPES = {
  FORGOT_PASSWORD: 1
};

constants.SENDINBLUE = {
  EMAILFORSENDINGEMAIL: ['<registere-email>', 'From'], 
};

constants.SUBJECT_OF_EMAILS = {
  FORGOT_PASSWORD: 'Forgot password'
};

/**
 * Error and success custom respose functions
 * @type {{ERROR: {DATA_NOT_FOUND: function(*=, *=), BAD_REQUEST: function(*=, *=), MONGO_EXCEPTION: function(*=, *=), ALREADY_EXISTS: function(*=, *=), FORBIDDEN: function(*=), INTERNAL_SERVER_ERROR: function(*=, *=), UNAUTHORIZED: function(*=)}, SUCCESS: {MISSCELANEOUSAPI: function(*=)}}}
 */
constants.RESPONSEMESSAGES = {
  ERROR: {
    DATA_NOT_FOUND: (msg, statusCode) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: statusCode || 404,
        message: msg,
        type: 'DATA_NOT_FOUND',
      };
    },
    BAD_REQUEST: (msg, statusCode) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: statusCode || 400,
        message: msg,
        type: 'BAD_REQUEST',
      };
    },
    MONGO_EXCEPTION: (msg, statusCode) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: statusCode || 100,
        message: msg,
        type: 'MONGO_EXCEPTION',
      };
    },
    ALREADY_EXISTS: (msg, statusCode) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: statusCode || 409,
        message: msg,
        type: 'ALREADY_EXISTS',
      };
    },
    FORBIDDEN: (msg) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: 403,
        message: msg,
        type: 'Forbidden',
      };
    },
    INTERNAL_SERVER_ERROR: (msg, statusCode) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: statusCode || 500,
        message: msg,
        type: 'INTERNAL_SERVER_ERROR',
      };
    },
    UNAUTHORIZED: (msg) => {
      if (!msg) {
        msg = '';
      }
      return {
        statusCode: 401,
        message: msg,
        type: 'UNAUTHORIZED',
      };
    }
  },
  SUCCESS: {
      MISSCELANEOUSAPI: (msg, data) => {
          if (!msg) {
              msg = '';
          }
          return {
              statusCode: 200,
              message: msg,
              type: 'Default',
              data: data || {}
          }
      }
  }
};

constants.swaggerDefaultResponseMessages = [
  { code: 200, message: 'OK' },
  { code: 400, message: 'Bad Request' },
  { code: 401, message: 'Unauthorized' },
  { code: 404, message: 'Data Not Found' },
  { code: 500, message: 'Internal Server Error' }
];

module.exports = constants;