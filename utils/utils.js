
'use strict';

let { SERVER } = require('./constants');
const MONGOOSE = require('mongoose');
const BCRYPT = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
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

/**
 * get Enum array from object
 * @param keyName
 * @returns {any[]}
 */
let getEnumArray = (keyName) => {
  // return Object.keys(CONSTANTS[keyName]).map((key) => {
  //   return CONSTANTS[keyName][key];
  // });
};

/** used for converting string id to mongoose object id */
let convertIdToMongooseId = (stringId) => {
  return MONGOOSE.Types.ObjectId(stringId);
};


/** create jsonwebtoken **/
let createToken = (userId) => {
  let jwtToken = jwt.sign({
		id: userId,
		timestamp: Date.now
	}, SERVER.JWT_SECRET, { algorithm: 'HS256' });
	return jwtToken;
};

/** Convert error to readable form **/
let convertErrorIntoReadableForm = (error) => {
  let errorMessage = '';
  if (error.message.indexOf("[") > -1) {
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
       'authorization': Joi.string().required().description(msg)
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



/*exporting all object from here*/
module.exports = {
  encryptPswrd: encryptPswrd,
  decryptPswrd: decryptPswrd,
  convertIdToMongooseId: convertIdToMongooseId,
  createToken: createToken,
  messageLogs: messageLogs,
  getEnumArray:getEnumArray,
  convertErrorIntoReadableForm:convertErrorIntoReadableForm,
  authorization: authorization,
  convertKeysValueToArray: convertKeysValueToArray
};