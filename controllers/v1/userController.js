"use strict";

const { 
    encryptPswrd, decryptPswrd, createToken 
} = require('../../utils/utils');

const { 
    RESPONSEMESSAGES, MESSAGES
} = require("../../utils/constants");

const { 
    userInfo 
} = require('../../models');

const { 
    saveData, getOneDoc, updateData, removeOne, 
} = require('../../services/commonService');


const { 
    signUp
} = require('../../services/signUpService');


/**************************************************
 ***** User controller for user business logic ****
 **************************************************/
let userController = {};

/**
 * register an user to the database
 * @param {*} body 
 */
userController.registerUser = async (body) => {
    return new Promise((resolve, reject) => {
        signUp(body).then(user => {
            delete user.signUpType;
            delete user.password;

            resolve(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.REGISTERED_SUCCESSFULLY, user));
        }).catch(error => {

            reject(error);
        })
    
    })

    // body.password = encryptPswrd(body.password)
    // let requiredUser = await saveData(userModel, body);
    // if (requiredUser) {
    //     return Object.assign(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.REGISTERED_SUCCESSFULLY, requiredUser));
    // }
    
};

/**
 * get user data by id
 * @param {*} requestBody 
 */
userController.getUser = async (requestBody) => {
    let Criteria = { _id: requestBody.userId }, Projection = { __v: 0 }, Options = { lean: true };
    let requiredUser = await getOneDoc(userInfo, Criteria, Projection, Options);
    if (requiredUser) {
        delete requiredUser.password;
        return Object.assign(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.USER_FETCHED_SUCCESSFULLY, requiredUser));
    }
    return RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND);
};

/**
 * remove user document 
 * @param {*} requestBody 
 */
userController.removeUser = async (requestBody) => {
    let Criteria = { _id: requestBody.userId };
    let removedUser = await removeOne(userInfo, Criteria);
    console.log('remove dat: ', removedUser);
    if (removedUser) {
        return Object.assign(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.USER_DELETED));
    }
    return RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND);
};

/**
 * update user data by user id
 * @param {*} requestBody 
 */
userController.updateUser = async (requestBody) => {
    return new Promise(async (resolve, reject)=> {
        let Criteria = { _id: requestBody.userId }, Options = {  lean: true, new: true };
        delete requestBody.userId;

        const updatedUser = await updateData(userInfo, Criteria, { $set: requestBody }, Options );
        if( updateData ) 
        delete updateData.password;
           return resolve(Object.assign(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.USER_UPDATED, updatedUser)));    
        reject(RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND));
    });
};

/* export userControllers */
module.exports = userController;