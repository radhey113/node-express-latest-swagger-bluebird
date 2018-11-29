
'use strict';

const swaggerUI = require('swagger-ui-express');
const swaggerConfig = require('../config/swaggerConfig');
const swJson = require('../services/swaggerService');
const Joi = require('joi');

const CONFIG = require('../config');
const CONSTANTS = require('../utils/constants');
const { convertErrorIntoReadableForm } = require('./utils');

const authService = require('../services/authService');
let routeUtils = {};

/**function to create routes in the express.**/
routeUtils.route = async (app, routes = []) => {
    routes.forEach(route => {
        let middlewares = [getValidatorMiddleware(route)];
        if (route.auth === CONSTANTS.AVAILABLE_AUTHS.SUPER_ADMIN) {
            middlewares.push(authService.superAdminValidate());
        }
        app.route(route.path)[route.method.toLowerCase()](...middlewares, getHandlerMethod(route.handler));
    });
    createSwaggerUIForRoutes(app, routes);
};

/**
 * function to validate request body/params/query/headers with joi schema to validate a request is valid or not.
 * @param {*} route 
 */
let joiValidatorMethod = async (request, route) => {
    if (route.joiSchemaForSwagger.params && Object.keys(route.joiSchemaForSwagger.params).length) {
        request.params = await Joi.validate(request.params, route.joiSchemaForSwagger.params);
    }
    if (route.joiSchemaForSwagger.body && Object.keys(route.joiSchemaForSwagger.body).length) {
        request.body = await Joi.validate(request.body, route.joiSchemaForSwagger.body);
    }
    if (route.joiSchemaForSwagger.query && Object.keys(route.joiSchemaForSwagger.query).length) {
        request.query = await Joi.validate(request.query, route.joiSchemaForSwagger.query);
    }
    if (route.joiSchemaForSwagger.headers && route.joiSchemaForSwagger.headers.authorization && Object.keys(route.joiSchemaForSwagger.headers).length) {
        request.headers = await Joi.validate(request.headers, route.joiSchemaForSwagger.headers);
    }
};

/**
 * middleware to validate request body/params/query/headers with JOI.
 * @param {*} route 
 */
let getValidatorMiddleware = (route) => {
    return (request, response, next) => {
        joiValidatorMethod(request, route).then((result) => {
            return next();
        }).catch((err) => {
            let error = convertErrorIntoReadableForm(err);
            let responseObject = CONSTANTS.RESPONSEMESSAGES.ERROR.BAD_REQUEST(error.message.toString());
            return response.status(responseObject.statusCode).json(responseObject);
        });
    };
};

/**
 * middleware for all response handler.
 * @param {*} handler 
 */
let getHandlerMethod = (handler) => {
    return (request, response) => {
        let body = {
            ...(request.body || {}),
            ...(request.params || {}),
            ...(request.query || {}),
        };
        handler(body)
            .then((result) => {
                response.status(result.statusCode).json(result);
            })
            .catch((err) => {
                if (!err.statusCode && !err.status) {
                    err = CONSTANTS.RESPONSEMESSAGES.ERROR.INTERNAL_SERVER_ERROR(CONSTANTS.MESSAGES.SOMETHING_WENT_WRONG);
                }
                response.status(err.statusCode).json(err);
            });
    };
};

/**
 * function to create Swagger UI for the available routes of the application.
 * @param {*} app Express instance.
 * @param {*} routes Available routes.
 */
let createSwaggerUIForRoutes = (app, routes = []) => {
    const host = CONFIG.SERVER_CONFIG.HOST + ':' + CONFIG.SERVER_CONFIG.PORT;
    const swaggerBasePath = '/';

    swJson.swaggerDoc.createJsonDoc(swaggerConfig, host, swaggerBasePath);
    routes.forEach(route => {
        swJson.swaggerDoc.addNewRoute(route.joiSchemaForSwagger, route.path, route.method.toLowerCase());
    });

    const swaggerDocument = require('../swagger.json');
    app.use('/document', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
};



module.exports = routeUtils;