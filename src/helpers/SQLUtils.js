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
    for (let i = 0; i < mappingKeys.length; i++) {
        if (ignoreId && mappingKeys[i] !== "id") {
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
    for (let i = 0; i < mappingKeys.length; i++) {
        if (ignoreId && mappingKeys[i] !== "id") {
            valuesString = valuesString.concat(mysql.escape(SQLUtils.formatValue(mapping[mappingKeys[i]].references && values[mappingKeys[i]] && values[mappingKeys[i]].id ? values[mappingKeys[i]].id : values[mappingKeys[i]] !== undefined && values[mappingKeys[i]] !== null && (typeof values[mappingKeys[i]]) === 'object' && values[mappingKeys[i]].constructor !== Date ? null : values[mappingKeys[i]], mapping[mappingKeys[i]].references && values[mappingKeys[i]] && values[mappingKeys[i]].constructor && values[mappingKeys[i]].constructor.SQL_MAPPING && values[mappingKeys[i]].constructor.SQL_MAPPING.id && values[mappingKeys[i]].constructor.SQL_MAPPING.id.type ? values[mappingKeys[i]].constructor.SQL_MAPPING.id.type : mapping[mappingKeys[i]].type))).concat(',');
        }
    }
    return valuesString.substr(0, valuesString.length - 1);
};

/**
 * Build the update string according to the mapping
 * @param values
 * @param mapping
 * @param includeUndefined
 */
SQLUtils.getUpdateString = function (values, mapping, includeUndefined) {
    let updateString = '';
    let mappingKeys = Object.keys(mapping);
    for (let i = 0; i < mappingKeys.length; i++) {
        if (mappingKeys[i] !== "id" && (!includeUndefined ? values[mappingKeys[i]] !== undefined : true)) {
            updateString = updateString.concat(mapping[mappingKeys[i]].sqlName).concat(" = ");
            updateString = updateString.concat(mysql.escape(SQLUtils.formatValue(mapping[mappingKeys[i]].references && values[mappingKeys[i]] && values[mappingKeys[i]].id ? values[mappingKeys[i]].id : values[mappingKeys[i]] !== undefined && values[mappingKeys[i]] !== null && (typeof values[mappingKeys[i]]) === 'object' && values[mappingKeys[i]].constructor !== Date ? null : values[mappingKeys[i]], mapping[mappingKeys[i]].references && values[mappingKeys[i]] && values[mappingKeys[i]].constructor && values[mappingKeys[i]].constructor.SQL_MAPPING && values[mappingKeys[i]].constructor.SQL_MAPPING.id && values[mappingKeys[i]].constructor.SQL_MAPPING.id.type ? values[mappingKeys[i]].constructor.SQL_MAPPING.id.type : mapping[mappingKeys[i]].type))).concat(', ');
        }
    }
    return updateString.substr(0, updateString.length - 2);
};

/**
 * Build the WHERE string depending on the conditions
 * @param tableName
 * @param mapping
 * @param condition
 * @param trim
 * @param operator
 */
SQLUtils.getConditionString = function (tableName, mapping, condition, trim, operator) {
    let conditionString = '';
    let conditionsKeys = Object.keys(condition);
    // Case Or
    if(conditionsKeys.length === 1 && conditionsKeys[0] === '$or') {
        conditionString = conditionString.concat(SQLUtils.getConditionString(tableName, mapping, condition[conditionsKeys[0]],false, "OR"));
        operator = "OR";
    } else {
        for (let i = 0; i < conditionsKeys.length; i++) {
            // In case of operator, do a recursive call
            if (conditionsKeys[i] === '$and' || conditionsKeys[i] === '$or') {
                conditionString = conditionString.concat("(")
                for (let j = 0; j < condition[conditionsKeys[i]].length; j++) {
                    conditionString = conditionString.concat(SQLUtils.getConditionString(tableName, mapping, condition[conditionsKeys[i]][j], j === condition[conditionsKeys[i]].length - 1, conditionsKeys[i].substr(1, 5).toUpperCase()));
                }
                conditionString = conditionString.concat(") ").concat(operator ? operator : "AND").concat(" ");
            } else {
                let currentConditionKeys = Object.keys(condition[conditionsKeys[i]]);
                if (!(mapping[conditionsKeys[i]] && mapping[conditionsKeys[i]].references) || (mapping[conditionsKeys[i]] && mapping[conditionsKeys[i]].references && (currentConditionKeys[0].startsWith("$") && (!currentConditionKeys[0].startsWith("$and") && !currentConditionKeys[0].startsWith("$or"))))) {
                    conditionString = conditionString.concat(tableName).concat('.').concat(mapping[conditionsKeys[i]].sqlName).concat(" ").concat(SQLUtils.formatConditionSign(currentConditionKeys[0], mysql.escape(condition[conditionsKeys[i]][currentConditionKeys[0]]))).concat(" ").concat(mysql.escape(condition[conditionsKeys[i]][currentConditionKeys[0]])).concat(" ").concat(operator ? operator : "AND").concat(" ");
                } else {
                    conditionString = conditionString.concat(SQLUtils.getConditionString(mapping[conditionsKeys[i]].references.TABLE_NAME, mapping[conditionsKeys[i]].references.SQL_MAPPING, condition[conditionsKeys[i]]));
                }
            }
        }
    }
    if (trim) {
        return (!operator || operator === "AND") ? conditionString.substr(0, conditionString.length - 5) : conditionString.substr(0, conditionString.length - 4); // TODO : Trim one less for or
    } else {
        return conditionString;
    }
};

/**
 * Build limit and OrderBy
 * @param manipulations
 * @param mapping
 * @param relatedTableName
 */
SQLUtils.getManipulationString = function (manipulations, mapping, relatedTableName) {
    let manipulationString = '';
    let manipulationKeys = Object.keys(manipulations);
    for (let i = 0; i < manipulationKeys.length; i++) {
        manipulationString = manipulationString.concat(SQLUtils.formatManipulation(manipulationKeys[i], manipulations[manipulationKeys[i]], mapping, Object.keys(mapping), relatedTableName)).concat(" ");
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
    for (let i = 0; i < mappingKeys.length; i++) {
        if (mapping[mappingKeys[i]].references) {
            tableString = tableString.concat('`' + mapping[mappingKeys[i]].references.TABLE_NAME + '`').concat(',');
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
    for (let i = 0; i < mappingKeys.length; i++) {
        if (mapping[mappingKeys[i]].references) {
            LinkString = LinkString.concat('`' + tableName + '`').concat('.').concat(mapping[mappingKeys[i]].sqlName).concat('=').concat('`' + mapping[mappingKeys[i]].references.TABLE_NAME + '`').concat('.').concat(mapping[mappingKeys[i]].references.SQL_MAPPING.id.sqlName).concat(' AND ');
        }
    }
    return LinkString.substr(0, LinkString.length - 5);
};

/**
 * Build a string for an intermediate table that links two other tables
 * @param intermediateTableName
 * @param fieldName
 * @param linkFieldName
 * @param relationMapping
 * @param mapping
 * @param relationTableName
 * @param tableName
 */
SQLUtils.getIntermediateString = function (intermediateTableName, fieldName, linkFieldName, relationTableName, relationMapping, tableName, mapping) {
    return `${intermediateTableName}.${linkFieldName} = ${relationTableName}.${relationMapping.id.sqlName} AND ${intermediateTableName}.${fieldName} = ${tableName}.${mapping.id.sqlName}`
};


/**
 * Prepare String for Aggregation functions
 * @param aggregation
 * @param mapping
 */
SQLUtils.getAggregationString = function (aggregation, mapping) {
    return `${SQLUtils.formatAggregationFunctionName(aggregation.function)}(${mysql.format(mapping[aggregation.attribute].sqlName)})`
};

/**
 * Format a value according to its type
 * @param value
 * @param type
 */
SQLUtils.formatValue = function (value, type) {
    if (value !== undefined && value !== null) {
        switch (type) {
            case "String" :
                return String(value);
            case "Number" :
                return Number(value);
            case "Date" :
                return new Date(value);
            case "Time" :
                return String(value);
        }
    } else {
        return null;
    }

};

/**
 * Return the correct sign according to the condition attribute
 * @param sign
 * @param isNullValue
 * @returns {*}
 */
SQLUtils.formatConditionSign = function (sign, isNullValue) {
    if(isNullValue === 'NULL') {
        return "IS"
    } else {
        switch (sign) {
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
            case "$like" :
                return "LIKE";
        }
    }
};

/**
 * Create a string for post request manipulation
 * @param manipulationType
 * @param manipulationValue
 * @param mapping
 * @param mappingKeys
 * @param relationTableName
 */
SQLUtils.formatManipulation = function (manipulationType, manipulationValue, mapping, mappingKeys, relationTableName) {
    switch (manipulationType) {
        case "orderBy" :
            return `ORDER BY ${relationTableName ? relationTableName + '.' : ''}${mapping[manipulationValue.value].sqlName} ${manipulationValue.way}`;
        case "limit" :
            return `LIMIT ${manipulationValue}`
    }
};

/**
 * Return the name of a function
 */
SQLUtils.formatAggregationFunctionName = function (functionName) {
    switch (functionName) {
        case "average" :
            return "AVG"
        case "count" :
            return "COUNT"
        case "max" :
            return "MAX"
        case "min" :
            return "MIN"
        case "sum" :
            return "SUM"
        case "distinct" :
            return "DISTINCT"
    }
};

/**
 * Instantiate new object from the SQL rows
 * @param className
 * @param mapping
 * @param rows
 * @param additionalMapping
 */
SQLUtils.createObjectsFromRow = function (className, rows, mapping, additionalMapping) {
    let objects = [];
    let classKeys = Object.keys(className.SQL_MAPPING);
    if (additionalMapping) {
        classKeys = classKeys.concat(Object.keys(additionalMapping));
        if (mapping) {
            mapping = Object.assign(mapping, additionalMapping);
        }
    }
    if (!mapping) {
        for (let i = 0; i < rows.length; i++) {
            objects.push(new arguments[0]());
            for (let j = 0; j < classKeys.length; j++) {
                objects[i][classKeys[j]] = rows[i][className.SQL_MAPPING[classKeys[j]].sqlName];
            }
        }
    } else {
        // If mapping, need to instantiate objects of referenced tables
        for (let i = 0; i < rows.length; i++) {
            objects.push(new arguments[0]());
            for (let j = 0; j < classKeys.length; j++) {
                // In case of reference, recursive call to build the object
                if (mapping[classKeys[j]].references) {
                    objects[i][classKeys[j]] = SQLUtils.createObjectsFromRow(mapping[classKeys[j]].references, [rows[i]])[0];
                } else {
                    objects[i][classKeys[j]] = className.SQL_MAPPING[classKeys[j]] ? rows[i][className.SQL_MAPPING[classKeys[j]].sqlName] : rows[i][mapping[classKeys[j]].sqlName];
                }
            }
        }
    }
    return objects;
};