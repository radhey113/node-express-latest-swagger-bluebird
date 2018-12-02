
'use strict';

let signupService = {};
const { LOGIN_TYPE, RESPONSEMESSAGES, MESSAGES } = require('../utils/constants');
const { generateJWTToken, convertErrorIntoReadableForm } =  require('../utils/utils');
const { userInfo } = require('../models');
const { saveData, getOneDoc, updateData } = require('./commonService');


/***
 * Sign up with normal and facebook both
 * @param body
 * @returns {Promise<any>}
 */
signupService.signUp = async (body) => {
    return new Promise( async (resolve, reject) => {
       try { 
        let type = body.signUpType, returnData, dataToSave = { ...body };
        let criteria = { $or: [ { email: body.email }, { name: body.name } ] }, userDataExist = null, 
        projection = { __v: 0 }, options = { lean: true };

        switch(type) {

            case LOGIN_TYPE.NORMAL:
                userDataExist = await getOneDoc(userInfo, criteria, projection, options);
                
                /** If user is already registered **/
                if(userDataExist){
                    if(userDataExist.email === body.email){
                        reject(RESPONSEMESSAGES.ERROR.BAD_REQUEST(MESSAGES.EMAIL_ALREADY_EXISTS));
                    } else if (userDataExist.name === body.name) {
                        reject(RESPONSEMESSAGES.ERROR.BAD_REQUEST(MESSAGES.NAME_ALREADY_EXISTS));
                    }
                }
                
                let newUserInfo = new userInfo(body);
                await newUserInfo.save();

                if(newUserInfo.errors){
                    throw newUserInfo.errors;
                }

                returnData = {
                    userData: newUserInfo,
                    firstTime: true
                };
                break;

            case LOGIN_TYPE.FB:
                criteria = {
                    $or: [
                        { fbId: body.fbId },
                        { email: body.email }
                    ]
                };
                userDataExist = await getOneDoc( userInfo, criteria, projection, options);

                /** fb user already exist **/
                if( userDataExist ){

                    criteria = { _id: userDataExist._id };
                    options.new = true;
                    await updateData(userInfo, criteria, { $set: { fbId: body.fbId } }, options);

                    returnData = {
                        token: generateJWTToken(userDataExist._id),
                        ...userDataExist,
                        firstTime: false
                    }
                } else {
                
                    /** user signup first time from facebook **/
                    delete dataToSave.type;
                    dataToSave.createdAt = Date.now();
                    dataToSave.updatedAt = Date.now();

                    dataToSave['profileImages'] = {
                        originalUrl: body.originalUrl || "",
                        thumbnailUrl: body.thumbnailUrl || "",
                    };

                    let newUserInfo = new userInfo(dataToSave);
                
                    await newUserInfo.save();
                    returnData = {
                        token: generateJWTToken(newUserInfo._id),
                        userData: newUserInfo,
                        firstTime: true
                    }
                }
                break;
        }
        resolve(returnData);
       }
       catch(e){
           reject(e);
       }
    })
};

module.exports = signupService;