"use strict";

/******************************************
 ****** Default Server configuration ******
 ******************************************/
let SERVER_CONFIG = {
    MONGODB: {
        HOST: "127.0.0.1",
        PORT: 27017,
        NAME: "mongodb",
        CONNECTOR: "mongodb",
        URL: process.env.DB_URL || "mongodb://127.0.0.1/demo_dev",
        DATABASE: "demo_dev",
        USER: "",
        PASSWORD: "",
    },
    HOST: "0.0.0.0",
    TYPE: "http://",
    PORT: process.env.SERVER_PORT || '2200'
};


/***********************************
 ** Maintain server Configuration **
 **** according to env variable ****
 ***********************************/
if (process.env.NODE_ENV === "development") {

    SERVER_CONFIG.MONGODB.USER = "";
    SERVER_CONFIG.MONGODB.PASSWORD = "";
} else if (process.env.NODE_ENV === "production") {

    SERVER_CONFIG.MONGODB.URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/demo";
    SERVER_CONFIG.MONGODB.DATABASE = "le_passe_Trappe_prod";
    SERVER_CONFIG.MONGODB.USER = "user";
    SERVER_CONFIG.MONGODB.PASSWORD = "password";
    SERVER_CONFIG.PORT = process.env.SERVER_PORT || "2201";
}

/** exporting server configuration **/
module.exports = SERVER_CONFIG;



