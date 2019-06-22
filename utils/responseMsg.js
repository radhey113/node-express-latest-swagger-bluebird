'use strict';

let responseMsg = {};


responseMsg.user = {
    registerUser: ` 
                        {
                          "statusCode": 200,
                          "message": "Registered successfully.",
                          "type": "Default",
                          "data":  {
                            "_id": "string",
                            "name": "string",
                            "email": "string",
                            "password": "string",
                            "createdAt": "string",
                            "updatedAt": "string",
                            "__v": 0
                          }
                        }
                  `,
    signIn: `
                    {
                      "statusCode": 200,
                      "message": "Logged in successfully.",
                      "type": "Default",
                      "data": {
                        "_id": "string",
                        "role": "string",
                        "name": "string",
                        "email": "string",
                        "fbId": "string",
                        "createdAt": "string",
                        "updatedAt": "string",
                        "accessToken": "string"
                      }
                    }
                `,
    forget_password: `
                    {
                       "statusCode": 200,
                       "message": "Your One Time Password has been sent to your registered email address.",
                       "type": "Default",
                       "data": {}
                    }
    `,
    reset_password: `
                    {
                        "statusCode": 200,
                        "message": "Your password has been successfully changed.",
                        "type": "Default",
                        "data": {}
                    }
                    `
};

module.exports = responseMsg;
