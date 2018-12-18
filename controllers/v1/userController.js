"use strict";

const {
    encryptPswrd, decryptPswrd,
    generateJWTToken, sendEmailNodeMailer,
    generateOTP, addTimeToDate, tokenManagerFun
} = require('../../utils/utils');
const { RESPONSEMESSAGES, MESSAGES, SERVER, EMAIL_TYPES, OTP_EXPIRY  } = require("../../utils/constants");

const { userModel, verificationModel } = require('../../models');
const { saveData, getOneDoc, updateData, removeOne, updateAccessToken } = require('../../services/commonService');
const { signUp } = require('../../services/signUpService');

const YES = SERVER.YES, NOT = SERVER.NOT;

/**************************************************
 ***** User controller for user business logic ****
 **************************************************/
let userController = {};

/**function to register an user to the system. **/
userController.registerUser = (body) => {
    return new Promise((resolve, reject) => {
        signUp(body).then(user => {
            delete user.signUpType;
            resolve(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.REGISTERED_SUCCESSFULLY, user));
        }).catch(error => {
            reject(error);
        })
    });
};

/**
 * Sign in user
 * @param body
 * @returns {Promise<*|{data, message, type, statusCode}>}
 */
userController.signIn = async (body) => {
    let Criteria = { email: body.email }, updatedData, Projection = { __v: NOT },
        Options = { lean: true }, tokenManagerArr;

    let user = await getOneDoc(userModel, Criteria, Projection, Options);
    if(!user) {
        throw RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.INVALID_CREDENTIALS);
    }
    let isMatched = await decryptPswrd(body.password, user.password);

    if(isMatched){
        tokenManagerArr = await tokenManagerFun(user, (body || {}).deviceToken);
        let accessToken = await generateJWTToken(user._id), criteria = { _id: user._id },
            dataToUpdate = { $set: { tokenManager: tokenManagerArr } },
            options = { ...Options, new: true, projection: { password: NOT, tokenManager: NOT, __v: NOT, signUpType: NOT } };

        updatedData = await updateData(userModel, criteria, dataToUpdate, options);
        return RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.LOGGED_IN_SUCCESSFULLY, { ...updatedData, accessToken });

    }else {
        throw RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.INVALID_CREDENTIALS);
    }
};


/**
 * Forget password email
 * @param body
 * @returns {Promise<*>}
 */
userController.forgotPassword = async (body) => {
    return new Promise(async (resolve, reject) => {

        let criteria = { email: body.email }, projection = {  __v: NOT, password: NOT }, options = { lean: true };
        let user = await getOneDoc(userModel, criteria, projection, options);
        if(!user) {
           return reject(RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND));
        }

        criteria = { userId: user._id }, options = { new: true, lean: true, upsert: true };
        let OTP = generateOTP(), currentDate = new Date(), expiryTime = await addTimeToDate(currentDate, OTP_EXPIRY.TIME_TO_ADD, OTP_EXPIRY.PREFIX);
        let dataToUpdate = { $set: { OTP: OTP, createdAt: new Date(), type: EMAIL_TYPES.FORGOT_PASSWORD, expireAt: expiryTime}};

        const verificationData = await updateData( verificationModel, criteria, dataToUpdate, options);
        user.OTP = verificationData.OTP;
        await sendEmailNodeMailer(user, EMAIL_TYPES.FORGOT_PASSWORD);

        return resolve(Object.assign( RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.PASSWORD_RESET_OTP), { } ));
    })
};



/**
 * Change user password with OTP
 * @param request
 * @returns {Promise<(*|{statusCode, msg, status, type}) & {}>}
 */
userController.changePassword_OTP = async (body) => {
    let verificationDocId, criteria = { email: body.email }, projection = { _id: YES, email: YES}, options = { lean: true };
    const user = await getOneDoc( userModel,criteria, projection, options);
    if(!user) {
        throw RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND);
    }
    criteria = { userId: user._id, OTP: body.otp, type: EMAIL_TYPES.FORGOT_PASSWORD };
    projection = { __v: NOT };

    /** Check OTP is available or not **/
    const OTP_DOC = await getOneDoc(criteria, projection, options );
    if(!OTP_DOC){
        throw RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.INVALID_OTP);
    }
    verificationDocId = OTP_DOC._id;

    /** Reset user password again **/
    let password = await encryptPswrd(body.password);
    let updated = await updateData( userModel, { _id: user._id }, { $set: { password: password } }, options);

    if(updated){
        /** Remove OTP Doc after successfully changing password **/
        await removeOne(verificationModel, { _id: verificationDocId });
        return Object.assign(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.PASSWORD_CHANGED));
    } else{
        throw RESPONSEMESSAGES.ERROR.FAILED_REQUEST(MESSAGES.PASSWORD_RESET_FAILED)
    }
};


/**
 * Remove user from db
 * @param requestBody
 * @returns {Promise<*>}
 */
userController.removeUser = async (body) => {
    let criteria = { _id: body.id }, projection = { __v: NOT }, options = { lean: true };
    let removedUser = await removeOne(userModel, criteria, projection, options);
    if (removedUser) {
        return Object.assign(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.USER_REMOVED_SUCCESSFULLY));
    }
    return RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND);
};

/**
 * Update user from db
 * @param requestBody
 * @returns {Promise<*>}
 */
userController.updateUser = async (body) => {
    let criteria = { _id: body.id }, options = { lean: true };
    let updatedUser = await updateData(userModel, criteria, requestBody, options);
    if(updatedUser){
        return Object.assign(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.USER_UPDATED_SUCCESSFULLY), { user: updatedUser });
    }
    return RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND);
};

/* export userControllers */
module.exports = userController;