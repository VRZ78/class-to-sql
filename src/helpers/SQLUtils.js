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
            valuesString = valuesString.concat(mysql.escape(SQLUtils.formatValue(values[mappingKeys[i]], mapping[mappingKeys[i]].type))).concat(',');
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
            updateString = updateString.concat(mysql.escape(SQLUtils.formatValue(values[mappingKeys[i]], mapping[mappingKeys[i]].type))).concat(', ');
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
        conditionString = conditionString.concat(conditionsKeys[i]).concat(" ").concat(SQLUtils.formatConditionSign(Object.keys(condition[conditionsKeys[i]])[0])).concat(" ").concat(condition[conditionsKeys[i]][Object.keys(condition[conditionsKeys[i]])[0]]).concat(" AND");
    }
    return conditionString.substr(0, conditionString.length - 4);
};

/**
 * Build limit and OrderBy
 * @param manipulations
 * @param mapping
 */
SQLUtils.getManipulationString = function (manipulations, mapping) {
    let manipulationString = '';
    let manipulationKeys = Object.keys(manipulations);
    for(let i = 0; i < manipulationKeys.length; i++) {
        manipulationString = manipulationString.concat(SQLUtils.formatManipulation(manipulationKeys[i], manipulations[manipulationKeys[i]], mapping, Object.keys(mapping))).concat(" ");
    }
    return manipulationString;
};


/**
 * Format a value according to its type
 * @param value
 * @param type
 */
SQLUtils.formatValue = function(value, type) {
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

/**
 * Create a string for post request manipulation
 * @param manipulationType
 * @param manipulationValue
 * @param mapping
 * @param mappingKeys
 */
SQLUtils.formatManipulation = function (manipulationType, manipulationValue, mapping, mappingKeys) {
    switch (manipulationType) {
        case "orderBy" :
            return `ORDER BY ${mapping[manipulationValue.value].sqlName} ${manipulationValue.way}`;
        case "limit" :
            return `LIMIT ${manipulationValue}`
    }
};

/**
 * Instantiate new object from the SQL rows
 * @param className
 * @param rows
 */
SQLUtils.createObjectsFromRow = function (className, rows) {
    let objects = [];
    let classKeys = Object.keys(className.SQL_MAPPING);
    for(let i = 0; i < rows.length; i++) {
        objects.push(new arguments[0]());
        for (let j = 0; j < classKeys.length; j++) {
            objects[i][classKeys[j]] = rows[i][className.SQL_MAPPING[classKeys[j]].sqlName];
        }
    }
    return objects;
};


