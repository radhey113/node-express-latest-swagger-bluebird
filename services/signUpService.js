
'use strict';

let signupService = {};
const { LOGIN_TYPE, RESPONSEMESSAGES, MESSAGES, SERVER } = require('../utils/constants');
const { generateJWTToken, encryptPswrd } =  require('../utils/utils');
const { userModel } = require('../models');
const { saveData, getOneDoc, updateData } = require('./commonService');

const NOT = SERVER.NOT;
/***
 * Sign up with normal and facebook both
 * @param body
 * @returns {Promise<any>}
 */
signupService.signUp = async (body) => {
    return new Promise( async (resolve, reject) => {
        try {

            let type = body.signUpType, returnData;
            let criteria = { $or: [ { email: body.email }, { name: body.name } ] },
                userDataExist = null, projection = { __v: NOT }, options = { lean: true }, tokenManager= [], newUserInfo, error;

            switch(type) {

                case LOGIN_TYPE.NORMAL:
                    userDataExist = await getOneDoc(userModel, criteria, projection, options);

                    /** normal signup with email **/
                    returnData = await normalSignUp(userDataExist, body);
                    break;

                case LOGIN_TYPE.FB:
                    /** Check required validation **/
                    error = requiredValidation(body);

                    if(error) {
                        return reject(error);
                    }
                    criteria = { $or: [ { fbId: body.fbId },  { email: body.email } ] };
                    userDataExist = await getOneDoc( userModel, criteria, projection, options);

                    /** fb user already exist **/
                    if( userDataExist ){
                        returnData = await fbSignUp_UserExist(userDataExist, body);
                    } else {

                        /** user signup first time from facebook **/
                        returnData = await fbSignup_firstTime(body);
                    }
                    break;

                case LOGIN_TYPE.GUEST:

                    /** Generate guest user **/
                    returnData = await guestSignup(body);
            }
            resolve(returnData);
        }
        catch(e){
            reject(e);
        }
    })
};

/**
 * Normal signup with email
 * @param userDataExist
 * @param body
 * @returns {Promise<{userData: {}, firstTime: boolean}>}
 */
const normalSignUp = async (userDataExist, body) => {
    let error, newUserInfo;

    /** If user is already registered **/
    if(userDataExist){
        error = emailOrNameValidation(userDataExist, body);
        if(error)
            throw error;
    }

    /** Check naem and email is exist or not **/
    error = requiredValidation(body);
    if(error) {
        throw error;
    }

    /** encript password **/
    body.password = await encryptPswrd(body.password);

    /** save data **/
    newUserInfo = await saveData(userModel, body);

    if(newUserInfo.errors){
        throw newUserInfo.errors;
    }

    return {
        userData: {},
        firstTime: true
    }
};

/**
 * guest sign up
 * @param body
 */
const guestSignup = async (body) => {

    let dataToSave = {}, newUserInfo, tokenManager = [];
    
    /** Generate guest user **/
    dataToSave.name = `${SERVER.GUEST_PREFIX}${Date.now()}`;
    dataToSave.password = encryptPswrd(((body || {}).password || ''));

    delete body.type;

    dataToSave.createdAt = Date.now();
    dataToSave.updatedAt = Date.now();

    /** save data **/
    newUserInfo = await saveData(userModel, dataToSave);
    let userData = newUserInfo._doc;

    tokenManager = [{
        deviceToken: (body || {}).deviceToken || '',
        accessToken: generateJWTToken(userData._id)
    }];

    /** update token **/
    userData = await updateData(userModel, { _id: userData._id }, { $set: { tokenManager: tokenManager } }, { new: true, lean: true });
    delete userData.tokenManager;
    delete userData.__v;

    userData.accessToken = tokenManager[SERVER.ARRAY_FIRST_INDEX].accessToken;
    return {
        ...userData,
        firstTime: true
    };

};

/***
 * fb sign up login when user is already exist
 * @param user
 * @param body
 * @returns {Promise<{[p: string]: *}>}
 */
const fbSignUp_UserExist = async (user, body) => {
    let criteria = { _id: user._id }, options = { lean: true, new: true };

    let tokenManager = [{
        deviceToken: (body || {}).deviceToken || '',
        accessToken: await generateJWTToken(user._id)
    }];

    /** update token and fb id **/
    user = await updateData(userModel, criteria, { $set: { fbId: body.fbId, tokenManager: tokenManager } }, options);

    delete user.tokenManager;
    delete user.__v;
    user.accessToken = tokenManager[SERVER.ARRAY_FIRST_INDEX].accessToken;
    return {
        ...user,
        firstTime: false
    }
};

/**
 * fb sign up first time
 * @param body
 * @returns {Promise<{firstTime: boolean}>}
 */
const fbSignup_firstTime = async (body) => {
    let dataToSave = { ...body };

    /** user signup first time from facebook **/
    delete dataToSave.type;
    dataToSave.createdAt = Date.now();
    dataToSave.updatedAt = Date.now();

    let newUserInfo = await saveData(userModel, dataToSave);
    let userData = newUserInfo._doc;

    let tokenManager = [{
        deviceToken: (body || {}).deviceToken || '',
        accessToken: generateJWTToken(userData._id)
    }];

    /** update token and fb id **/
    userData = await updateData(userModel, { _id: userData._id }, { $set: { tokenManager: tokenManager } }, { new: true, lean: true });
    delete userData.tokenManager;
    delete userData.__v;
    userData.accessToken = tokenManager[SERVER.ARRAY_FIRST_INDEX].accessToken;
    return {
        ...userData,
        firstTime: true
    }
};

/**
 * Email validation
 * @param obj
 * @param body
 * @returns {*}
 */
const emailOrNameValidation = (obj, body) => {
    if(obj.email && obj.email === body.email){
        return RESPONSEMESSAGES.ERROR.BAD_REQUEST(MESSAGES.EMAIL_ALREADY_EXISTS);
    } else if (obj.name && obj.name === body.name) {
        return RESPONSEMESSAGES.ERROR.BAD_REQUEST(MESSAGES.NAME_ALREADY_EXISTS);
    }

    return '';
};

/****
 * Required Validation
 * @param body
 * @returns {*}
 */
const requiredValidation = (body) => {
    if (!body.email) {
        return RESPONSEMESSAGES.ERROR.BAD_REQUEST(MESSAGES.EMAIL_REQUIRED);
    }
    else if (!body.name) {
        return RESPONSEMESSAGES.ERROR.BAD_REQUEST(MESSAGES.NAME_REQUIRED);
    }
    return '';
};

module.exports = signupService;