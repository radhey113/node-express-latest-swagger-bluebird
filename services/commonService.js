'use strict';
let commonService = {};
let {createToken} = require('../utils/utils');
/**
 * Check data is already exist or not common function
 * @param requestBody
 * @returns {Promise<*>}
 */
commonService.checkDataAlreadyExistOrNot = async (requestBody) => {
    let alreadyExistUser = await MODELS.userModel.findOne({email: requestBody.email});
    if (alreadyExistUser) {
        return alreadyExistUser;
    }
    return false;
};

/**
 * Save data common function
 * @param Model
 * @param dataToSave
 * @returns {Promise<*>}
 */
commonService.saveData = async (Model, dataToSave) => {
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
commonService.getOneDoc = async (Model, Criteria, Projection, Options) => {
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
commonService.getManyDoc = async (Model, Criteria, Projection, Options) => {
    const requiredData = await Model.findOne(Criteria, Projection, Options);
    return requiredData;
};


/**
 * Get data common function
 * @param Model
 * @param Criteria
 * @param Projection
 * @param Options
 * @returns {Promise<*>}
 */
commonService.getManyPopulatedDoc = async (Model, Criteria, Projection, Options, Populate) => {
    const requiredData = await Model.findOne(Criteria, Projection, Options).populate(Populate);
    return requiredData;
};


/**
 * remove one document common function
 * @param Model
 * @param Criteria
 * @returns {Promise<*>}
 */
commonService.removeOne = async (Model, Criteria) => {
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
commonService.updateData = async (Model, Criteria, DataToUpdate, Options) => {
    return await Model.findOneAndUpdate(Criteria, DataToUpdate, Options);
};

/**
 * check third party exist or not
 * @param user
 * @returns {Promise<{thirdParty: boolean}>}
 */
commonService.userThirdPartyIdCheck = async (user, body) => {
    let thirdPartyCheck = {
        thirdParty: false
    };
    if ((user || {}).fbId || (body || {}).fbId) {
        console.log(user.fbId);
        thirdPartyCheck.thirdParty = true;
        thirdPartyCheck['accessToken'] = createToken(user._id);
    }
    return thirdPartyCheck;
};

/** update user token **/
commonService.updateAccessToken = async (Model, userId, accessToken, body) => {
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

module.exports = commonService;
