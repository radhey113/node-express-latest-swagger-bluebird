"use strict";
/************* Modules ***********/
const MONGOOSE = require("mongoose");
const Schema = MONGOOSE.Schema;
const { LOGIN_TYPE, USER_ROLES, SERVER } = require("../utils/constants");
const { convertKeysValueToArray } = require('../utils/utils');

const signInType = convertKeysValueToArray(LOGIN_TYPE);
const userRoles = convertKeysValueToArray(USER_ROLES);

/**************************************************
 ************* User Model or collection ***********
 **************************************************/
const userSchema = new Schema({
    name        : { type: String, required: true, unique: true, index: true, sparse: true },
    email       : { type: String, unique: true, index: true, sparse: true },

    password    : { type: String },
    createdAt   : { type: Date, default: Date.now },

    updatedAt   : { type: Date, default: Date.now }
});

module.exports = MONGOOSE.model("user", userSchema);
