"use strict";
/************* Modules ***********/
const MONGOOSE = require("mongoose");
const Schema = MONGOOSE.Schema;

/**************************************************
 ************* User Model or collection ***********
 **************************************************/
const userSchema = new Schema({
    name        : { type: String, required: true, unique: true, index: true, sparse: true },
    email       : { type: String, required: true, unique: true, index: true, sparse: true },

    password    : { type: String },
    createdAt   : { type: Date, default: Date.now },

    updatedAt   : { type: Date, default: Date.now }
});

module.exports = MONGOOSE.model("user", userSchema);
