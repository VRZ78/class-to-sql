const SQLUtils = module.exports;

const mysql = require('mysql');

/**
 * Return a string with the column name of a table
 * @param mapping
 * @returns {string}
 */
SQLUtils.getColumnNamesFromMapping = function (mapping, ignoreId) {
    let descriptionString = '';
    let mappingKeys = Object.keys(mapping);
    for(let i = 0; i < mappingKeys.length; i++) {
        if(ignoreId && mappingKeys[i] !== "id") {
            descriptionString = descriptionString.concat(mapping[mappingKeys[i]].sqlName, ',');
        }
    }
    return descriptionString.substr(0, descriptionString.length - 1);
};

/**
 * Return a string the values formatted according to the type
 * @param values
 * @param mapping
 * @returns {string}
 */
SQLUtils.getValuesFromMapping = function (values, mapping, ignoreId) {
    let valuesString = '';
    let mappingKeys = Object.keys(mapping);
    for(let i = 0; i < mappingKeys.length; i++) {
        if(ignoreId && mappingKeys[i] !== "id") {
            valuesString = valuesString.concat(mysql.escape(SQLUtils.format(values[mappingKeys[i]], mapping[mappingKeys[i]].type))).concat(',');
        }
    }
    return valuesString.substr(0, valuesString.length - 1);
};

/**
 * Build the update string according to the mapping
 * @param values
 * @param mapping
 */
SQLUtils.getUpdateString = function (values, mapping) {
    let updateString = '';
    let mappingKeys = Object.keys(mapping);
    for(let i = 0; i < mappingKeys.length; i++) {
        if(mappingKeys[i] !== "id") {
            updateString = updateString.concat(mapping[mappingKeys[i]].sqlName).concat(" = ");
            updateString = updateString.concat(mysql.escape(SQLUtils.format(values[mappingKeys[i]], mapping[mappingKeys[i]].type))).concat(', ');
        }
    }
    return updateString.substr(0, updateString.length - 2);
};

/**
 * Build the WHERE string depending on the conditions
 * @param mapping
 * @param condition
 */
SQLUtils.getConditionString = function (mapping, condition) {
    let conditionString = '';
    let conditionsKeys = Object.keys(condition);
    for(let i = 0; i < conditionsKeys.length; i++) {
        conditionString = conditionString.concat(conditionsKeys[i]).concat(SQLUtils.formatConditionSign(Object.keys(condition[i])[0])).concat(condition[i][Object.keys(condition[i])[0]]).concat("AND");
    }
    return conditionString;
};

/**
 * Build limit and OrderBy
 * @param manipulation
 */
SQLUtils.getManipulationString = function (manipulation) {

};


/**
 * Format a value according to its type
 * @param value
 * @param type
 */
SQLUtils.format = function(value, type) {
        switch(type) {
            case "String" :
                return String(value);
            case "Number" :
                return Number(value);
            case "Date" :
                return new Date(value);
            case "Time" :
                return String(value);
        }
};

/**
 * Return the correct sign according to the condition attribute
 * @param sign
 * @returns {*}
 */
SQLUtils.formatConditionSign = function (sign) {
    switch(sign) {
        case "$gt" :
            return ">";
        case "$lt" :
            return "<";
        case "$gte" :
            return ">=";
        case "$lte" :
            return "<=";
        case "$ne"  :
            return "<>";
    }
};