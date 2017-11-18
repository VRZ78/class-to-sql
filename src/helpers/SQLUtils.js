const SQLUtils = module.exports;

const mysql = require('mysql');

/**
 * Return a string with the column name of a table
 * @param mapping
 * @param ignoreId
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
 * @param ignoreId
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
        let currentConditionKeys = Object.keys(condition[conditionsKeys[i]]);
        conditionString = conditionString.concat(mapping[conditionsKeys[i]].sqlName).concat(" ").concat(SQLUtils.formatConditionSign(currentConditionKeys[0])).concat(" ").concat(condition[conditionsKeys[i]][currentConditionKeys[0]]).concat(" AND ");
    }
    return conditionString.substr(0, conditionString.length - 5);
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
 * Return a string with the different tables referenced in a mapping
 * @param: mapping
 */
SQLUtils.getTableString = function (mapping) {
    let tableString = '';
    let mappingKeys = Object.keys(mapping);
    for(let i = 0; i < mappingKeys.length; i++) {
        if(mapping[mappingKeys[i]].references) {
            tableString = tableString.concat(mapping[mappingKeys[i]].references.TABLE_NAME).concat(',');
        }
    }
    return tableString.substr(0, tableString.length - 1);
};

/**
 * Build a string that links the related tables
 * @param mapping
 */
SQLUtils.getTableLinkString = function (mapping, tableName) {
    let LinkString = '';
    let mappingKeys = Object.keys(mapping);
    for(let i = 0; i < mappingKeys.length; i++) {
        if(mapping[mappingKeys[i]].references) {
            LinkString = LinkString.concat(tableName).concat('.').concat(mapping[mappingKeys[i]].references.SQL_MAPPING.id.sqlName).concat('=').concat(mapping[mappingKeys[i]].references.TABLE_NAME).concat('.').concat(mapping[mappingKeys[i]].references.SQL_MAPPING.id.sqlName).concat(' AND ');
        }
    }
    return LinkString.substr(0, LinkString.length - 5);
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
        case "$eq" :
            return "=";
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
 * @param mapping
 * @param rows
 */
SQLUtils.createObjectsFromRow = function (className, rows, mapping) {
    let objects = [];
    let classKeys = Object.keys(className.SQL_MAPPING);
    if(!mapping) {
        for(let i = 0; i < rows.length; i++) {
            objects.push(new arguments[0]());
            for (let j = 0; j < classKeys.length; j++) {
                objects[i][classKeys[j]] = rows[i][className.SQL_MAPPING[classKeys[j]].sqlName];
            }
        }
    } else {
        // If mapping, need to instantiate objects of referenced tables
        for(let i = 0; i < rows.length; i++) {
            objects.push(new arguments[0]());
            for (let j = 0; j < classKeys.length; j++) {
                // In case of reference, recursive call to build the object
                if(mapping[classKeys[j]].references) {
                    objects[i][classKeys[j]] = SQLUtils.createObjectsFromRow(mapping[classKeys[j]].references, [rows[i]])[0];
                } else {
                    objects[i][classKeys[j]] = rows[i][className.SQL_MAPPING[classKeys[j]].sqlName];
                }
            }
        }
    }
    return objects;
};