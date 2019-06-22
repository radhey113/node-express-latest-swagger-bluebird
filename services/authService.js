`use strict`;

const jwt = require('jsonwebtoken');

const {SERVER, MESSAGES, RESPONSEMESSAGES} = require('../utils/constants');

const {userModel} = require('../models');

let authService = {};

const NOT = SERVER.NOT, AUTH_PREFIX_LENGTH = SERVER.AUTH_PREFIX.length;

/**
 * function to authenticate superadmin.
 */
authService.adminAuthentication = () => {
    return (request, response, next) => {
        validateSuperAdmin(request).then((isAuthorized) => {
            if (isAuthorized) {
                return next();
            }
            let responseObject = RESPONSEMESSAGES.ERROR.UNAUTHORIZED(MESSAGES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        }).catch((err) => {
            let responseObject = RESPONSEMESSAGES.ERROR.UNAUTHORIZED(MESSAGES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        });
    };
};

/**
 * function to validate superadmin's jwt token and fetch its details from the system.
 * @param {} request
 */
let validateSuperAdmin = async (request) => {
    try {
        let authTokenData = await handleToken(request.headers.authorization);
        let token = authTokenData.token;
        let prefix = authTokenData.prefix;

        let authorizedAdmin = jwt.verify(token, SERVER.JWT_SECRET);
        if (authorizedAdmin.id) {
            let adminDetails = await userModel.findOne(
                {_id: authorizedAdmin.id, "tokenManager.accessToken": token},
                {__v: NOT, password: NOT, createdAt: NOT, updatedAt: NOT, role: NOT, tokenManager: NOT},
                {lean: true}
            );
            if (adminDetails && prefix === SERVER.AUTH_PREFIX) {
                request.user = adminDetails;
                return true;
            }
            return false;
        }
    } catch (err) {
        return false;
    }
};


/**
 * Make vendor authentication
 * @returns {Promise<void>}
 */
authService.userAuthentication2 = async () => {
    return async (request, response, next) => {
        try {
            let authTokenData = await handleToken(request.headers.authorization);
            let token = authTokenData.token;
            let prefix = authTokenData.prefix;

            let user = jwt.verify(token, SERVER.JWT_SECRET);
            if (user.id) {
                let user = await userModel.findOne(
                    {_id: user.id, "tokenManager.accessToken": token},
                    {__v: NOT, password: NOT, createdAt: NOT, updatedAt: NOT, role: NOT, tokenManager: NOT},
                    {lean: true}
                );
                if (user && prefix === SERVER.AUTH_PREFIX) {
                    request.user = user;
                    return next();
                }
                throw null;
            }
        } catch (error) {
            let errorObj = RESPONSEMESSAGES.ERROR.UNAUTHORIZED(MESSAGES.UNAUTHORIZED);
            return response.status(errorObj.statusCode).json(errorObj);
        }
    }
};


/**
 * Make vendor authentication
 * @returns {Promise<void>}
 */
authService.userAuthentication1 = async () => {
    return async (request, response, next) => {
        try {
            let authTokenData = await handleToken(request.headers.authorization);
            let token = authTokenData.token;
            let prefix = authTokenData.prefix;

            let user = jwt.verify(token, SERVER.JWT_SECRET);
            if (user.id) {
                let user = await userModel.findOne(
                    {_id: user.id, "tokenManager.accessToken": token, isBlocked: false, isActive: true},
                    {__v: NOT, password: NOT, createdAt: NOT, updatedAt: NOT, role: NOT},
                    {lean: true}
                );
                if (user && prefix === SERVER.AUTH_PREFIX) {
                    request.user = user;
                    return next();
                }
                throw null;
            }
        } catch (error) {
            let errorObj = RESPONSEMESSAGES.ERROR.UNAUTHORIZED(MESSAGES.UNAUTHORIZED);
            return response.status(errorObj.statusCode).json(errorObj);
        }
    }
};


/**
 * Make user authentication
 * @returns {Promise<void>}
 */
authService.userAuthentication = async () => {
    return async (request, response, next) => {
        try {
            let authTokenData = await handleToken(request.headers.authorization);
            let token = authTokenData.token;
            let prefix = authTokenData.prefix;

            let user = jwt.verify(token, SERVER.JWT_SECRET);
            if (user.id) {
                let userDetails = await userModel.findOne(
                    {_id: user.id, "tokenManager.accessToken": token, isBlocked: false, isActive: true},
                    {__v: NOT, password: NOT, createdAt: NOT, updatedAt: NOT, role: NOT},
                    {lean: true}
                );
                if (userDetails && prefix === SERVER.AUTH_PREFIX) {
                    request.user = userDetails;
                    return next();
                }
                throw null;
            }
        } catch (error) {
            let errorObj = RESPONSEMESSAGES.ERROR.UNAUTHORIZED(MESSAGES.UNAUTHORIZED);
            return response.status(errorObj.statusCode).json(errorObj);
        }
    }
};

/**
 * Auth token handle
 * @param authToken
 * @returns {Promise<{prefix: string, token: string}>}
 */
const handleToken = async authToken => {
    let token = authToken;
    let prefix = token.substring(NOT, AUTH_PREFIX_LENGTH);
    token = token.substring(AUTH_PREFIX_LENGTH);
    return {token, prefix};
};


module.exports = authService;