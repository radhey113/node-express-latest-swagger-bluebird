'use strict';

let {SERVER, RESPONSEMESSAGES, MESSAGES, SUBJECT_OF_EMAILS, EMAIL_TYPES, EMAIL_TEMPLATE} = require('./constants');
const MONGOOSE = require('mongoose');
const BCRYPT = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const nodemailer = require('nodemailer');
const handleBar = require('handlebars');
const moment = require('moment');

let saltRounds = SERVER.BCRYPT_SALT;

/**
 * incrypt password in case user login implementation
 * @param {*} userPassword
 * @param {*} cb
 */
let encryptPswrd = (userPassword) => {
    let salt = BCRYPT.genSaltSync(saltRounds);
    let encryptedPassword = BCRYPT.hashSync(userPassword, salt);
    return encryptedPassword;
};

/**
 * @param {** decrypt password in case user login implementation} payloadPassword
 * @param {*} userPassword
 * @param {*} cb
 */
let decryptPswrd = async (payloadPassword, userPassword) => {
    return BCRYPT.compare((payloadPassword || ""), (userPassword || ""));
};

/** used for converting string id to mongoose object id */
let convertIdToMongooseId = (stringId) => {
    return MONGOOSE.Types.ObjectId(stringId);
};


/** create jsonwebtoken **/
let generateJWTToken = (userId, timeZone) => {
    let jwtToken = jwt.sign({
        id: userId, timeZone, timestamp: Date.now
    }, SERVER.JWT_SECRET, {algorithm: 'HS256'});
    return jwtToken;
};

/** Convert error to readable form **/
let convertErrorIntoReadableForm = (error) => {
    let errorMessage = '';
    if (error.message.indexOf("[") > SERVER.NOT_FOUND_INDEX) {
        errorMessage = error.message.substr(error.message.indexOf("["));
    } else {
        errorMessage = error.message;
    }
    errorMessage = errorMessage.replace(/"/g, '');
    errorMessage = errorMessage.replace('[', '');
    errorMessage = errorMessage.replace(']', '');
    error.message = errorMessage;
    return error;
};

/***************************************
 **** Logger for error and success *****
 ***************************************/
let messageLogs = (error, success) => {
    if (error)
        console.error(`\x1b[31m` + error);
    else
        console.log(`\x1b[32m` + success);
};

/**
 * Joi authorization for swagger
 * @param msg
 * @returns {*}
 */
const authorization = (msg) => {
    return Joi.object({
        'authorization': Joi.string().required().description(msg).label(`Authorization`),
        'api_secret': Joi.string().required().description(`Enter api secret.`).label(`API Secret`)
    }).unknown();
};

/**
 * Enter api secret
 * @returns {*|*}
 */
const apiSecret = () => {
    return Joi.object({
        'api_secret': Joi.string().required().description(`Enter api secret.`).label(`API Secret`)
    }).unknown();
};


/**
 * @param Obj
 * @returns {any[]} Convert object keys value to array of values
 */
const convertKeysValueToArray = Obj => {
    return Object.keys(Obj).map(key => {
        return Obj[key];
    })
};

/**
 * Generate 6 digit OTP
 * @returns {number}
 */
const generateOTP = () => {
    const OTP = Math.floor(100000 + Math.random() * 900000);
    return OTP;
};


/**
 * Send Email from node mailer
 * @param email
 */
const sendEmailNodeMailer = (userObject, type) => {
    return new Promise((resolve, reject) => {

        /** Generate test SMTP service account from ethereal.email
         Only needed if you don't have a real mail account for testing **/
        let transporter = nodemailer.createTransport({
            service: SERVER.NODEMAILER_CODE,
            auth: {
                user: SERVER.NODEMAILER_USER,
                pass: SERVER.NODEMAILER_PASSWORD
            }
        });

        /** setup email data with unicode symbols **/
        const mailData = emailTypes(userObject, type), email = userObject.email;
        let template = handleBar.compile(mailData.template);


        let result = template(mailData.data);
        const subject = mailData.Subject;

        let mailOptions = {
            from: '"demo" <contact@demo.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            // text: 'Hello world?', // plaΩin text body
            html: result // html body
        };

        /** send mail with defined transport object **/
        transporter.sendMail(mailOptions, (error, info) => {

            if (error) {
                console.log('Message error: ', error);
                reject(error);
            }
            console.log('Message sent: %s', info.messageId);
            /** Preview only available when sending through an Ethereal account **/

            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            /** Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
             Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou... **/

            resolve(null);
        });
    });
};


/**
 * Check mail type
 * @param userObject
 * @param type
 * @returns {{Subject: string, data: {}, template: string}}
 */
const emailTypes = (userObject, type) => {
    let EmailStatus = {
        Subject: '',
        data: {},
        template: ''
    };
    switch (type) {

        case EMAIL_TYPES.FORGOT_PASSWORD:
            /** let link = `${constants.SERVER.VERIFICATION_URL}?email=${userObject.email}&type=${constants.VERIFICATION_TYPE.EMAIL}&otp=${userObject.otp}`; **/
            EmailStatus['Subject'] = SUBJECT_OF_EMAILS.FORGOT_PASSWORD;
            EmailStatus.template = EMAIL_TEMPLATE.FORGET_PSWRD;
            break;

        default:
            EmailStatus['Subject'] = 'Welcome Email!';
            break;

    }
    EmailStatus.data['name'] = userObject.name;
    EmailStatus.data['code'] = userObject.OTP;
    return EmailStatus;
};

/**
 * Add some time (minutes, hours, or second)
 * @param date
 * @param timetoadd
 */
const addTimeToDate = (date, timetoadd, timePrefix) => {
    return moment(date).add(timetoadd, timePrefix).toDate();
};

/**
 * Generate device Token Array
 * @param user
 * @param deviceToken
 * @returns {Promise<{accessToken: ArrayBuffer, deviceToken: (*|string)}[]>}
 */
const tokenManagerFun = async (user, deviceToken) => {
    return [{
        deviceToken: deviceToken || '',
        accessToken: await generateJWTToken(user._id)
    }];
};


/**
 * Criteria for or
 * @param body
 * @param criteriaKeys
 * @returns {Promise<{$or: Array}>}
 */
const orCriteria = async (body, id, criteriaKeys) => {
    let lengthOfCriteria = criteriaKeys.length, criteria = {_id: {$ne: id}, $or: []}, obj, keys = [];
    for (let i = SERVER.NOT; i < lengthOfCriteria; i++) {
        obj = {};
        if (body[criteriaKeys[i]]) {
            obj[criteriaKeys[i]] = body[criteriaKeys[i]];
            criteria[`$or`].push(obj);
            keys.push(criteriaKeys[i]);
        }
    }
    return {criteria, keys};
};


/** Case sensitive search **/
const caseSensitive = (queryText) => {
    return new RegExp(["^.*", queryText, ".*$"].join(""), "i");
};


/**
 * Is required
 * @param body
 * @param keys
 * @returns {Promise<void>}
 */
const customRequiredMsg = async (body, keys) => {
    for (let i = SERVER.NOT; i < keys.length; i++) {
        if (!body[keys[i]]) {
            keys[i] = keys[i].charAt(SERVER.NOT).toUpperCase() + keys[i].substr(SERVER.YES);
            throw RESPONSEMESSAGES.ERROR.BAD_REQUEST(keys[i] + MESSAGES.IS_REQUIRED);
        }
    }
    return null;
};


/**
 * Current time in minutes
 * @returns {Promise<void>}
 */
const currentTimeInMinutes = () => {
    let currentDate = new Date().toLocaleString(TIME_ZONE.ASIA_KOLKATA.LNG, {timeZone: TIME_ZONE.ASIA_KOLKATA.ZONE});
    currentDate = new Date(currentDate);
    let getTimeInMinutes = ((currentDate.getHours() * SERVER.COMMON_TIME) + currentDate.getMinutes());
    return getTimeInMinutes;
};

/*exporting all object from here*/
module.exports = {
    encryptPswrd: encryptPswrd,
    decryptPswrd: decryptPswrd,
    convertIdToMongooseId: convertIdToMongooseId,
    generateJWTToken: generateJWTToken,
    messageLogs: messageLogs,
    convertErrorIntoReadableForm: convertErrorIntoReadableForm,
    authorization: authorization,
    convertKeysValueToArray: convertKeysValueToArray,
    emailTypes: emailTypes,
    sendEmailNodeMailer: sendEmailNodeMailer,
    generateOTP: generateOTP,
    addTimeToDate: addTimeToDate,
    tokenManagerFun: tokenManagerFun,
    orCriteria: orCriteria,
    caseSensitive: caseSensitive,
    currentTimeInMinutes: currentTimeInMinutes,
    customRequiredMsg: customRequiredMsg
};