"use strict";
/************* Modules ***********/
const MONGOOSE = require("mongoose");
const Schema = MONGOOSE.Schema;

const {convertKeysValueToArray} = require('../utils/utils');
const {LOGIN_TYPE, SERVER} = require('../utils/constants');

const loginType = convertKeysValueToArray(LOGIN_TYPE);

/**************************************************
 ************* User Model or collection ***********
 **************************************************/
const userSchema = new Schema({
    name: {type: String, required: true, unique: true, index: true, sparse: true},
    email: {type: String, unique: true, index: true, sparse: true},
    password: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

module.export = MONGOOSE.model("user", userSchema);
