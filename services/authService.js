const jwt = require('jsonwebtoken');

const {SERVER, MESSAGES, RESPONSEMESSAGES } = require('../utils/constants');

const MODELS = require('../models');

let authService = {};

const NOT = SERVER.NOT;

/**
 * function to authenticate superadmin.
 */
authService.superAdminValidate = () => {
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
        let authorizedAdmin = jwt.verify(request.headers.authorization, SERVER.JWT_SECRET);
        if (authorizedAdmin.id) {
            let adminDetails = await MODELS.adminModel.findOne({ _id: authorizedAdmin.id }, { __v: NOT, password: NOT });
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