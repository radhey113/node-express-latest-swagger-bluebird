`use strict`;
const {caseSensitive, convertIdToMongooseId} = require('../utils/utils');

class Criteria {
    constructor() {
        this.getCriteria = this.getCriteria.bind(this);
        this.orQuery = this.orQuery.bind(this);
        this.andQuery = this.andQuery.bind(this);
        this.lookupQuery = this.lookupQuery.bind(this);
    }

    /**
     * Get criteria
     * @param body
     * @param criteria
     * @returns {*}
     */
    getCriteria(body, criteria) {
        let search = '';

        if (body.search)
            search = caseSensitive(body.search);

        if (body.id)
            criteria['_id'] = convertIdToMongooseId(body.id);

        if (body.hasOwnProperty('isActive'))
            criteria['isActive'] = body.isActive;

        if (body.hasOwnProperty('isBlocked'))
            criteria['isBlocked'] = body.isBlocked;

        if (body.hasOwnProperty('isDeleted'))
            criteria['isDeleted'] = body.isDeleted;

        if (body.type)
            criteria['type'] = body.type;

        if (body.from && body.to)
            criteria['$and'] = [{criteria: {$gte: body.from}}, {criteria: {$lte: body.to}}];

        if (body.email)
            criteria['email'] = body.email;

        if (body.userName)
            criteria['userName'] = body.userName;

        if (search) {
            criteria['$or'] = [
                {name: search}, {fullName: search},
                {firstName: search}, {lastName: search},
                {email: search},
            ];
        }
        return criteria;
    }

    /**
     * Lookup query
     * @param body
     * @returns {{$lookup: {from}}}
     */
    lookupQuery({from, localKey, foreignKey, as}) {
        return {
            $lookup: {
                from,
                localField: localKey,
                foreignField: foreignKey,
                as
            }
        }
    }

    /**
     * Or criteria
     * @param keysToOr
     * @param value
     */
    orQuery(keysToOr = [], value = '') {
        let query = [];
        let lengthOfKeys = keysToOr.length;
        for(let index = 0; index < lengthOfKeys; index++) {
            query.push({[keysToOr[index]]: value});
        }
        return {$or: query};
    }

    /**
     * And Query
     * @param keysToAnd
     * @param value
     */
    andQuery(keysToAnd = [], value = '') {
        let query = [];
        let lengthOfKeys = keysToAnd.length;
        for(let index = 0; index < lengthOfKeys; index++) {
            query.push({[keysToAnd[index]]: value});
        }
        return {$and: query};
    }

    /**
     * Set projections
     * @param keys
     * @param value
     */
    projectionCriteria(keys = [], value = '') {
        let lengthOfKeys = keys.length, projection = {};
        for(let index = 0; index < lengthOfKeys; index++) {
            projection[keys[index]] = value;
        }
        return projection;
    }

    /**
     * Update query
     * @param dataToUpdate
     * @param property
     * @returns {{[p: string]: *}}
     */
    updateQuery(dataToUpdate = {}, property = '$set') {
        dataToUpdate = {[property]: dataToUpdate};
        return dataToUpdate;
    }
}

module.exports = new Criteria();
