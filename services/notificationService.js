
`use strict`;

const { SERVER } = require(`./utils/constants`);
let notificationService = {};
const FCM = require('fcm-node');

const fcm = new FCM(SERVER.PUSH_NOTIFICATION_KEY);

/**
 * One to one notification service
 * @param data
 * @returns {boolean}
 */
notificationService.oneToOne = async (deviceToken, data) => {

    let message = {
        registration_ids: deviceToken,
        notification: {
            title: SERVER.PROJECT_NAME,
            body: data.msg,
            sound: `default`,
            badge: SERVER.ARRAY_FIRST_INDEX,
        },
        data: data,
        priority: `high`
    };

    await sendNotification(message);

    return true
};

/**
 * One to many notification
 * @param data
 * @returns {boolean}
 */
notificationService.oneToOne = async (deviceToken, data) => {

    let message = {
        to: deviceToken,
        notification: {
            title: SERVER.PROJECT_NAME,
            body: data.msg,
            sound:`default`,
            badge: SERVER.ARRAY_FIRST_INDEX
        },
        data:data,
        priority: `high`
    };

    await sendNotification(message);

    return true
};


/**
 * Send notification to user
 * @param msg
 * @returns {Promise<void>}
 */
const sendNotification = async (msg) => {
    fcm.send(message, function(err, result){
        if (err) {
            console.log("Something has gone wrong!",err);
            callback(null);
        } else {
            console.log("Successfully sent with response: ", result);
            callback(null,result);
        }
    });
};


/*** Notification export **/
module.exports = notificationService;