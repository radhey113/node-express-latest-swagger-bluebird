'use strict';


/********************************
 * Calling routes and passing ***
 * @param app (express instance)*
 ******** to create API *********
 ********************************/
let v1Routes = [
    ...require('./user')
];
module.exports = v1Routes;
