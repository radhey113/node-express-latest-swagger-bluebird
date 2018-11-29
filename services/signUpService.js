
'use strict';

let signupService = {};
const { LOGIN_TYPE } = require('../utils/constants');


/***
 * Sign up with normal and facebook both
 * @param body
 * @returns {Promise<any>}
 */
signupService.signUp = async (body) => {
    return new Promise( async (resolve, reject) => {

        let type = body.type, returnData, dataToSave = { ...body };
        let criteria = { email: body.email }, userDataExist = null, projection = { __v: 0 };

        switch(type) {

            case LOGIN_TYPE.NORMAL:

                userDataExist = await userInfo.findOne(criteria, projection).lean();
                /** If user is already registered **/
                if(userDataExist){
                    reject(constants.RESPONSEMESSAGES.ERROR.BAD_REQUEST(constants.MESSAGES.EMAIL_ALREADY_EXISTS));
                }
                let userData = {
                    fullName: body.fullName,
                    gender: body.gender,
                    email: body.email,
                    phone: body.phone,
                    bio: body.bio || "",
                    password: await encryptPassword(body.password),
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    profileImages: {
                        originalUrl: body.originalUrl,
                        thumbnailUrl: body.thumbnailUrl,
                    }
                };
                let newUserInfo = new userInfo(userData);
                await newUserInfo.save();

                if(newUserInfo.errors){
                    console.error(`Errors: ${newUserInfo.errors}`);
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
                userDataExist = await userInfo.findOne(criteria, projection).lean();

                /** fb user already exist **/
                if( userDataExist ){

                    criteria = { _id: userDataExist._id };
                    await userInfo.findOneAndUpdate( criteria, { $set: { fbId: body.fbId } }, { lean: true, new: true });

                    returnData = {
                        token: generateJWTToken(userDataExist._id),
                        userData: userDataExist,
                        firstTime: false
                    }
                } else {

                    /** user signup first time from facebook **/
                    delete dataToSave.type;
                    dataToSave.createdAt = Date.now();
                    dataToSave.updatedAt = Date.now();
                    dataToSave.bio = (dataToSave || {}).bio || '';
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
    })
};

module.exports = signupService;