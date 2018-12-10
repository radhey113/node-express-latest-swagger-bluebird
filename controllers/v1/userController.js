"use strict";

const {
    encryptPswrd, decryptPswrd,
    generateJWTToken, sendEmailNodeMailer,
    generateOTP, addTimeToDate
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
            delete user.password;

            resolve(RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.REGISTERED_SUCCESSFULLY, user));
        }).catch(error => {

            reject(error);
        })
    });
};

/**
 * function to fetch an user from the system by its id.
 */
userController.signIn = async (body) => {
    let Criteria = { email: body.email }, updatedData,
        Projection = { __v: NOT }, Options = { lean: true }, tokenManagerArr = [];

    let user = await getOneDoc(userModel, Criteria, Projection, Options);
    if(!user) {
        throw RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.INVALID_CREDENTIALS);
    }

    let isMatched = await decryptPswrd(body.password, user.password);

    if(isMatched){
        let accessToken = await generateJWTToken(user._id);
        tokenManagerArr.push({
             accessToken: accessToken,
             deviceToken: body.deviceToken
        });

        /** update user with token **/
        updatedData = await updateData(userModel, { _id: user._id }, { $set: { tokenManager: tokenManagerArr } }, { lean: true, new: true });
        delete updatedData.password;
        delete updatedData.tokenManager;
        delete updatedData.__v;
        delete updatedData.signUpType;

        return RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.LOGGED_IN_SUCCESSFULLY, { ...updatedData, accessToken });

    }else {
        throw RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.INVALID_CREDENTIALS);
    }
};

userController.forgotPassword = async (body) => {
    return new Promise(async (resolve, reject) => {

        let user = await getOneDoc(userModel, { email: body.email }, {  __v: NOT, password: NOT }, { lean: true });

        if(!user) {
           return reject(RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND));
        }
        let OTP = generateOTP();

        let currentDate = new Date();
        let expiryTime = await addTimeToDate(new Date(), OTP_EXPIRY.TIME_TO_ADD, OTP_EXPIRY.PREFIX);

        const verificationData = await updateData(
            verificationModel,
            { userId: user._id },
            { $set: { OTP: OTP, createdAt: new Date(), type: EMAIL_TYPES.FORGOT_PASSWORD, expireAt: expiryTime}},
            { new: true, lean: true, upsert: true }
        );

        user.OTP = verificationData.OTP;

        await sendEmailNodeMailer(user, EMAIL_TYPES.FORGOT_PASSWORD);

        return resolve(Object.assign(
            RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.PASSWORD_RESET_OTP),
            { }
        ));
    })
};



/**
 * Change user password with OTP
 * @param request
 * @returns {Promise<(*|{statusCode, msg, status, type}) & {}>}
 */
userController.changePassword_OTP = async (body) => {

    let verificationDocId;

    /** Check user is exist or not  **/
    const user = await getOneDoc( userModel,{ email: body.email }, { _id: YES, email: YES}, { lean: true });

    if(!user) {
        throw RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.NOT_FOUND);
    }

    /** Check OTP is available or not **/
    const OTP_DOC = await getOneDoc(
        verificationModel,
        { userId: user._id, OTP: body.otp, type: EMAIL_TYPES.FORGOT_PASSWORD },
        { __v: YES },
        { lean: true }
        );

    if(!OTP_DOC){
        throw RESPONSEMESSAGES.ERROR.DATA_NOT_FOUND(MESSAGES.INVALID_OTP);
    }
    verificationDocId = OTP_DOC._id;

    /** Reset user password again **/
    let password = await encryptPswrd(body.password);
    let updated = await updateData( userModel, { _id: user._id }, { $set: { password: password } }, { lean: true });

    if(updated){

        /** Remove OTP Doc after successfully changing password **/
        await removeOne(verificationModel, { _id: verificationDocId });
        return Object.assign(
            RESPONSEMESSAGES.SUCCESS.MISSCELANEOUSAPI(MESSAGES.PASSWORD_CHANGED)
        )
    } else{
        throw RESPONSEMESSAGES.ERROR.FAILED_REQUEST(MESSAGES.PASSWORD_RESET_FAILED)
    }
};



/**
 * function to remove an user from the system.
 */
userController.removeUser = async (requestBody) => {
    let Criteria = { _id: requestBody.id }, Projection = { __v: NOT }, Options = { lean: true };
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