const SQLUtils = module.exports;

const mysql = require('mysql');

/**
 * Return a string with the column name of a table
 * @param mapping
 * @returns {string}
 */
SQLUtils.getTableNamesFromMapping = function (mapping) {
    let descriptionString = '';
    let mappingKeys = Object.keys(mapping);
    for(let i = 0; i < mappingKeys.length; i++) {
        descriptionString.concat(mysql.escape(mappingKeys[i].sqlName), i === mappingKeys.length - 1 ? "," : "");
    }
    return descriptionString;
};

/**
 * Return a string the values formatted according to the type
 * @param values
 * @param mapping
 * @returns {string}
 */
SQLUtils.getValuesFromMapping = function (values, mapping) {
    let valuesString = '';
    let mappingKeys = Object.keys(mapping);
    for(let i = 0; i < mappingKeys.length; i++) {
        valuesString.concat(mysql.escape(SQLUtils.format(values[mappingKeys[i]], mapping[mappingKeys[i].type])), i === mappingKeys.length - 1 ? "," : "");
    }
    return valuesString;
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
                break;
            case "Number" :
                return Number(value);
                break;
            // TODO : Check how its inserted
            case "Date" :
                return new Date(value);
                break;
            case "Time" :
                return String(value);
                break;
        }
};