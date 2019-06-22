'use strict';


let constants = {};

constants.SERVER = {
    ADMINPASSWORD: process.env.ADMIN_PASSWORD,
    PROJECT_NAME: `Demo Backend.`,
    JWT_SECRET: `fasdkfjklandfkdsfjladsfodfafjalfadsfkads`,
    PUSH_NOTIFICATION_SERVER_KEY: `<PUSH NOTICICATION KEY>`,
    BCRYPT_SALT: 10,
    ARRAY_FIRST_INDEX: 0,
    NOT_FOUND_INDEX: -1,
    GUEST_PREFIX: `guest_`,
    NODEMAILER_CODE: `Gmail`,
    NODEMAILER_USER: '<gmail acccount>',
    NODEMAILER_PASSWORD: '<password>',


    AUTH_PREFIX: `demo`,
    /** Projection keys **/
    YES: 1,
    NOT: 0
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
    1: "USER",
};

constants.LOGIN_TYPE = {
    NORMAL: 1,
    FB: 2,
    GUEST: 3
};

constants.IMAGE_PREFIX = {
    FEED: 'feed_',
    THUMB: 'thumb_'
};

constants.THIRD_PARTY_LOGIN = [2];

constants.AVAILABLE_AUTHS = {
    USER: 'USER'
};

constants.OTP_EXPIRY = {
    TIME_TO_ADD: 5,
    PREFIX: 'm'
};

constants.UPLOAD_DATA = {
    MEDIA: 1,
    DOC: 2,
    CSV: 3
};

constants.EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

constants.MESSAGES = {
    DEFAULT_SUCCESS: `Success`,
    MONGOERROR: 'Database error',
    BAD_REQUEST: 'Bad Request.',
    NOT_FOUND: 'Not found.',
    UNAUTHORIZED: 'Un-authorized access.',
    INVALID_PASSWORD: 'Invalid password',
    INVALID_CREDENTIALS: 'Invalid credentials.',
    EMAIL_ALREADY_EXISTS: 'Email already registered! Please enter another email.',
    NAME_ALREADY_EXISTS: 'Name already registered! Please enter another name.',
    FILE_FORMAT_NOT_SUPPORTED: 'File format not supported.',
    REGISTERED_SUCCESSFULLY: 'Registered successfully.',
    SOMETHING_WENT_WRONG: 'Something went wrong.',
    LOGGED_IN_SUCCESSFULLY: 'Logged in successfully.',
    USER_ALREADY_EXIST: 'User already exists with same name/email.',
    PASSWORD_REQUIRED: 'Password required.',
    EMAIL_REQUIRED: 'Email required.',
    INVALID_OTP: 'OTP invalid',
    NAME_REQUIRED: 'Name required.',
    PASSWORD_RESET_OTP: 'Your One Time Password has been sent to your registered email address.',
    PASSWORD_CHANGED: 'Your password has been successfully changed.',
    PASSWORD_RESET_FAILED: 'Your password reset request is failed.',
    USER_UPDATED_SUCCESSFULLY: 'User data has been updated successfully.',
    USER_REMOVED_SUCCESSFULLY: 'User removed successfully.',
    IS_REQUIRED: ' is required.'
};

constants.FB_GRAPH_API = 'https://graph.facebook.com/me?fields=email,gender,name,picture.type(large),birthday,age_range&access_token=';
constants.EXISTING_SINGLE_CATEGORY_ID = '5b28e5a73235d6291cb036ab';

constants.GAME_TYPES = {
    COIN_PUSHER: 1,
};

constants.EMAIL_TYPES = {
    FORGOT_PASSWORD: 1
};

constants.SENDINBLUE = {
    EMAILFORSENDINGEMAIL: ['<registere-email>', 'From'],  // has to be changed when provided by client.
};

constants.SUBJECT_OF_EMAILS = {
    FORGOT_PASSWORD: 'Forgot password'
};

constants.BANK_TRANSACTION_TYPES = {
    DEPOSIT: 1,
    WITHDRAW: 2
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
        FAILED_REQUEST: (msg) => {
            if (!msg) {
                msg = '';
            }
            return {
                statusCode: 400,
                message: msg,
                type: 'FAILED',
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

constants.EMAIL_TEMPLATE = {
    FORGET_PSWRD: "<!DOCTYPE html><html lang=en><head> <meta charset=utf-8> <meta name=viewport content=width=device-width, initial-scale=1.0> <meta name=description content=> <meta name=author content=> <title>Le Passe Trappe</title> <link href=css/font-awesome.min.css rel=stylesheet> <style>p{margin: 0px;}h3{margin: 0px;}.wrapper{padding: 20px; background-color: #F0F0F0;}</style></head><body> <div class=wrapper> <p id=userName>Hi {{name}},</p><p id=resetCode>OTP for reset password: <b>{{code}}</b></p><p>&nbsp;</p><p>If you need assistance, please email our customer service department at <a href=mailto:customerservice@demo.com>customerservice@demo.com</a> or you can refer to our website : <a href=demo.com>demo.com</a></p><p>&nbsp;</p><p>Thanks again for choosing our App, we hope it makes a big difference in your lives ☺</p><p>&nbsp;</p><p>Sincerely,</p><p>&nbsp;</p><p>Founder Name</p><p>Founder</p><a href=demo.com>demo.com</a> <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></div></body></html>"
};


constants.swaggerDefaultResponseMessages = [
    {code: 200, message: 'OK'},
    {code: 400, message: 'Bad Request'},
    {code: 401, message: 'Unauthorized'},
    {code: 404, message: 'Data Not Found'},
    {code: 500, message: 'Internal Server Error'}
];

module.exports = constants;