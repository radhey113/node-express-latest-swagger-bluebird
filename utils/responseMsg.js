
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
    getUserData: `
                        {
                          "statusCode": 200,
                          "message": "Success.",
                          "type": "Default",
                          "data": {
                            "_id": "string",
                            "name": "string",
                            "email": "string",
                            "createdAt": "string",
                            "updatedAt": "string"
                          }
                        }`
                        ,              
    deleteUserData: `
                        {
                          "statusCode": 200,
                          "message": "User data is successfully deleted.",
                          "type": "Default",
                          "data": {}
                        }
                    `,
    updateUserData: `
                        {
                          "statusCode": 200,
                          "message": "User data is successfully updated.",
                          "type": "Default",
                          "data": {}
                        }
    `,                
};

module.exports = responseMsg;
