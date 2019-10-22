'use strict';
let commonService = {};
let {createToken, emailOrNameValidation, customRequiredMsg, encryptPswrd} = require('../utils/utils');
let {SERVER} = require('../utils/constants');
let NOT = SERVER.NOT;

class CommonService {

    constructor() {
        this.signUp = this.signUp.bind(this);
    }

    /**
     * Save data common function
     * @param Model
     * @param dataToSave
     * @returns {Promise<*>}
     */
    async saveData(Model, dataToSave){
        return Model(dataToSave).save();
    };

    /**
     * Get data common function
     * @param Model
     * @param Criteria
     * @param Projection
     * @param Options
     * @returns {Promise<*>}
     */
    async getOneDoc(Model, Criteria, Projection, Options){
        return await Model.findOne(Criteria, Projection, Options);
    };

    /**
     * Get data common function
     * @param Model
     * @param Criteria
     * @param Projection
     * @param Options
     * @returns {Promise<*>}
     */
    async getManyDoc(Model, Criteria, Projection, Options){
        return await Model.findOne(Criteria, Projection, Options);
    };


    /**
     * Get data common function
     * @param Model
     * @param Criteria
     * @param Projection
     * @param Options
     * @returns {Promise<*>}
     */
    async getManyPopulatedDoc(Model, Criteria, Projection, Options, Populate){
        return await Model.findOne(Criteria, Projection, Options).populate(Populate);
    };


    /**
     * remove one document common function
     * @param Model
     * @param Criteria
     * @returns {Promise<*>}
     */
    async removeOne(Model, Criteria){
        return await Model.findOneAndRemove(Criteria);
    };

    /**
     * Update data common function
     * @param Model
     * @param Criteria
     * @param DataToUpdate
     * @param Options
     * @returns {Promise<*>}
     */
    async updateData(Model, Criteria, DataToUpdate, Options){
        return await Model.findOneAndUpdate(Criteria, DataToUpdate, Options);
    };


    /**
     * Aggregate query
     * @param Model
     * @param Criteria
     * @returns {Promise<*>}
     */
    async aggregateQuery(Model, Criteria){
        return await Model.aggregate(Criteria);
    };

    /**
     * check third party exist or not
     * @param user
     * @returns {Promise<{thirdParty: boolean}>}
     */
    async userThirdPartyIdCheck(user, body){
        let thirdPartyCheck = {
            thirdParty: false
        };
        if ((user || {}).fbId || (body || {}).fbId) {
            thirdPartyCheck.thirdParty = true;
            thirdPartyCheck['accessToken'] = createToken(user._id);
        }
        return thirdPartyCheck;
    };

    /**
     * Normal signup with email
     * @param body
     * @param model
     * @param body
     * @returns {Promise<{userData: {}, firstTime: boolean}>}
     */
    async signUp(model, body){
        try {
            let type = body.signUpType, returnData = {}, error, userDataExist = null;
            /** If user is already registered **/

            let criteria = {$or: [{email: body.email}, {name: body.name}]}, projection = {__v: NOT}, options = {lean: true};
            userDataExist = await this.getOneDoc(model, criteria, projection, options);

            if (userDataExist) {
                error = emailOrNameValidation(userDataExist, body);
                if (error) throw error;
            }
            /** Check name and email is exist or not **/
            customRequiredMsg(body, ['email', 'password', 'name']);

            body.password = await encryptPswrd(body.password);
            await this.saveData(model, body);
            return returnData;
        } catch(error) {
            throw error;
        }
    };

    /** update user token **/
    async updateAccessToken(Model, userId, accessToken, body){
        return await commonService.updateData(
            Model,
            {_id: userId},
            {
                $set: {
                    tokenManager: [
                        {
                            accessToken: (accessToken || ''),
                            deviceToken: (body.deviceToken || '')
                        }
                    ],
                    updatedAt: new Date(),
                    fbId: body.fbId,
                }
            },
            {
                new: true,
                lean: true
            }
        )
    };
}

module.exports = new CommonService();
