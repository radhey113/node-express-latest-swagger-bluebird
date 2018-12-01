
'use strict';

const Joi = require('joi');
const { LOGIN_TYPE } = require('../../utils/constants');
const { convertKeysValueToArray } = require('../../utils/utils');
const { user } = require('../../utils/responseMsg');
const { authorization, convertErrorIntoReadableForm } = require('../../utils/utils');
const { registerUser, getUser, removeUser, updateUser } = require('../../controllers').v1.userController;

const signInType = convertKeysValueToArray(LOGIN_TYPE);

let Routes = [];
Routes = [
	{
		method: 'POST',
		path: '/v1/user',
		joiSchemaForSwagger: {
			body: {
                name: Joi.string().optional().allow(``).description(`User unique name.`).label(`Name`),
                email: Joi.string().optional().allow(``).description(`User\'s email id.`).label(`Email`),
                password: Joi.string().optional().allow(``).description(`User password.`).label(`Password`),
			},
			group: `User`,
			description: `Route to register an user to the database.`,
			model: `Register`,
            responseClass: user.registerUser
		},
        failAction: convertErrorIntoReadableForm,
		handler: registerUser,
	},
    {
		method: 'GET',
		path: '/v1/user/:userId',
		joiSchemaForSwagger: {
			params: {
				userId: Joi.string().required().description('User id.'),
			},
			// headers: authorization(`Admin's JWT token.`),
			group: 'User',
			description: 'Route to get an user from the database.',
			model: 'User_Fetch',
			responseClass: user.getUserData
		},
		auth: false,
        failAction: convertErrorIntoReadableForm,
		handler: getUser
    },
    {
		method: 'DELETE',
		path: '/v1/user/:userId',
		joiSchemaForSwagger: {
			params: {
				userId: Joi.string().required().description('User id.').example('5bfd2d692dc87f6b67445421'),
			},
			group: 'User',
			description: 'Route to remove an user from the database.',
			model: 'User_Fetch',
			responseClass: user.deleteUserData
		},
		auth: false,
        failAction: convertErrorIntoReadableForm,
		handler: removeUser
    },
    {
        method: `PUT`,
        path: `/v1/user/:userId`,
        joiSchemaForSwagger: {
            params: {
                userId: Joi.string().description('User id.'),
            },
            body: {
				name: Joi.string().required().description(`Update User name.`),
				email: Joi.string().required().description(`Update User\'s email id.`)
            },
            group: `User`,
            description: `Route to update an user to the database.`,
			model: `User_Updation`,
			responseClass: user.updateUserData
        },
        auth: false,
        failAction: convertErrorIntoReadableForm,
        handler: updateUser
    }
];
module.exports = Routes;

