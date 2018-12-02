"use strict";
/************* Modules ***********/
const MONGOOSE = require("mongoose");
const Schema = MONGOOSE.Schema;
const { convertKeysValueToArray } = require('../utils/utils');
const { LOGIN_TYPE, SERVER } = require('../utils/constants');

const loginType = convertKeysValueToArray(LOGIN_TYPE);
console.log(loginType);


/**************************************************
 ************* User Model or collection ***********
 **************************************************/
const userSchema = new Schema({
    userId      : { type: Schema.Types.ObjectId, ref: 'user' },
    loginType   : [{ type: Number, enum: loginType, default: loginType[SERVER.ARRAY_FIRST_INDEX] }],
    createdAt   : { type: Date, default: Date.now },
    updatedAt   : { type: Date, default: Date.now }
});

module.exports = MONGOOSE.model("user", userSchema);
