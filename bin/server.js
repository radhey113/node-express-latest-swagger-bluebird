'use strict';

/***********************************
 **** node module defined here *****
 ***********************************/
const EXPRESS = require("express");
const Mongoose = require('mongoose');
Mongoose.Promise = require('bluebird');

const routes = require('../routes');
const CONFIG = require("../config");
const {messageLogs} = require('../utils/utils');
const routeUtils = require('../utils/routeUtils');
const {startCron} = require('../services/cronService');

/**creating express server app for server */
const app = EXPRESS();

/********************************
 ***** Server Configuration *****
 ********************************/
app.set('port', process.env.PORT || CONFIG.SERVER_CONFIG.PORT);
app.use(require("body-parser").json({limit: '50mb'}));
app.use(require("body-parser").urlencoded({limit: '50mb', extended: true}));


/** middleware for api's logging with deployment mode */
let apiLooger = (req, res, next) => {
    messageLogs(null, `api hitted ${req.url} ${process.env.NODE_ENV}`);
    next();
};

/** Used logger middleware for each api call **/
app.use(apiLooger);

/*******************************
 *** For handling CORS Error ***
 *******************************/
app.all('/*', (REQUEST, RESPONSE, NEXT) => {
    RESPONSE.header('Access-Control-Allow-Origin', '*');
    RESPONSE.header('Access-Control-Allow-Headers', 'Content-Type, api_key, Authorization, x-requested-with, Total-Count, Total-Pages, Error-Message');
    RESPONSE.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, OPTIONS');
    RESPONSE.header('Access-Control-Max-Age', 1800);
    NEXT();
});


/** Server is running here */
let startNodeserver = () => {
    return new Promise((resolve, reject) => {
        app.listen(CONFIG.SERVER_CONFIG.PORT, (err) => {
            if (err) reject(err);
            resolve();
        })
    })
};

/** connect database **/
let connectDb = async () => {
    // await Mongoose.connect(CONFIG.SERVER_CONFIG.MONGODB.URL, {useNewUrlParser: true, useCreateIndex: true});
    console.log('Mongo connected at ', CONFIG.SERVER_CONFIG.MONGODB.URL);
    await routeUtils.route(app, routes);
    await startNodeserver();
    // startCron(`*/5 * * * * *`);
};


module.exports = () => {
    connectDb()
        .then(() => {
            console.log(`Node server running on ${CONFIG.SERVER_CONFIG.HOST}:${CONFIG.SERVER_CONFIG.PORT}`);
        }).catch((err) => {
        console.log(`Error in starting server ${err}`);
    });
};