"use strict";
/************* Modules ***********/
const MONGOOSE = require("mongoose");
const Schema = MONGOOSE.Schema;

const { convertKeysValueToArray } = require('../utils/utils');
const { LOGIN_TYPE, SERVER } = require('../utils/constants');

const loginType = convertKeysValueToArray(LOGIN_TYPE);

/**************************************************
 ************* User Model or collection ***********
 **************************************************/
const userSchema = new Schema({
    name        : { type: String, required: true, unique: true, index: true, sparse: true },
    email       : { type: String, unique: true, index: true, sparse: true },
    password    : { type: String },
    createdAt   : { type: Date, default: Date.now },

    fbId        : { type: String, default: '' },
    signUpType  : [{ type: Number, enum: loginType, default: loginType[SERVER.ARRAY_FIRST_INDEX] }],
    isFb        : { type: Boolean, default: false },
    isGuest     : { type: Boolean, default: false },
    updatedAt   : { type: Date, default: Date.now }
});

module.exports = MONGOOSE.model("user", userSchema);
