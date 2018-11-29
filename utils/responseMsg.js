
'use strict';

let responseMsg = {};


responseMsg.user = {
    registerUser: ` 
                      If normal user then response will be: 
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

};

module.exports = responseMsg;
