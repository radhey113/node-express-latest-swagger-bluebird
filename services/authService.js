const jwt = require('jsonwebtoken');

const CONSTANTS = require('../utils/constants');

const MODELS = require('../models');

let authService = {};

/**
 * function to authenticate superadmin.
 */
authService.superAdminValidate = () => {
    return (request, response, next) => {
        validateSuperAdmin(request).then((isAuthorized) => {
            if (isAuthorized) {
                return next();
            }
            let responseObject = CONSTANTS.RESPONSEMESSAGES.ERROR.UNAUTHORIZED(CONSTANTS.MESSAGES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        }).catch((err) => {
            let responseObject = CONSTANTS.RESPONSEMESSAGES.ERROR.UNAUTHORIZED(CONSTANTS.MESSAGES.UNAUTHORIZED);
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
        let authorizedAdmin = jwt.verify(request.headers.authorization, CONSTANTS.jwt.privatekey);
        if (authorizedAdmin.id) {
            let adminDetails = await MODELS.adminModel.findOne({ _id: authorizedAdmin.id }, { __v: 0, password: 0 });
            if (adminDetails) {
                request.user = adminDetails;
                return true;
            }
            return false;
        }
    } catch (err) {
        return false;
    }
};

module.exports = authService;