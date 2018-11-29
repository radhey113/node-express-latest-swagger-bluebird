"use strict";

const { encryptPswrd, decryptPswrd, createToken } = require('../../utils/utils');
const { RESPONSEMESSAGES, MESSAGES, THIRD_PARTY_LOGIN, LOGIN_TYPE, SERVER  } = require("../../utils/constants");

const { userModel } = require('../../models');
const { saveData, getOneDoc, updateData, removeOne, userThirdPartyIdCheck, updateAccessToken } = require('../../services/commonService');

/**************************************************
 ***** User controller for user business logic ****
 **************************************************/
let userController = {};

/**function to register an user to the system. **/
userController.registerUser = async (body) => {
    let requiredUser = await saveData(userModel, body);
    if (requiredUser) {
        return Object.assign(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.USER_FETCHED_SUCCESSFULLY, requiredUser));
    }
    return RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND);
};

/**function to fetch an user from the system by its id.*/
userController.getUser = async (requestBody) => {
    let Criteria = { _id: requestBody.id }, Projection = { __v: 0 }, Options = { lean: true };
    let requiredUser = await getUserById(userModel, Criteria, Projection, Options);
    if (requiredUser) {
        return Object.assign(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.USER_FETCHED_SUCCESSFULLY), { user: requiredUser });
    }
    return RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND);
};

/**
 * function to remove an user from the system.
 */
userController.removeUser = async (requestBody) => {
    let Criteria = { _id: requestBody.id }, Projection = { __v: 0 }, Options = { lean: true };
    let removedUser = await removeOne(userModel, Criteria, Projection, Options);
    if (removedUser) {
        return Object.assign(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.USER_REMOVED_SUCCESSFULLY));
    }
    return RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND);
};

/**
 * function to update an user to the system.
 */
userController.updateUser = async (requestBody) => {
    let Criteria = { _id: requestBody.id }, Options = { lean: true };
    let updatedUser = await updateData(userModel, Criteria, requestBody, Options );
    if(updatedUser){
        return Object.assign(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.USER_UPDATED_SUCCESSFULLY), { user: updatedUser });
    }
    return RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND);
};

/* export userControllers */
module.exports = userController;