const MySQLRequester = module.exports;

const mysql = require('mysql');
const SQLUtils = require('./SQLUtils');

/**
 * Pass the connection object to the library
 * @param connection Active mysql connection
 */
MySQLRequester.setConnection = function (connection) {
    MySQLRequester.connection = connection;
};

/**
 * Insert a row in the given table
 * @param tableName : name as in the DB
 * @param values: The value to insert
 * @param mapping: The value to insert
 * @returns {Promise}
 */
MySQLRequester.insert = function (tableName, values, mapping) {
    return new Promise(function (resolve, reject) {
        if (!MySQLRequester.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        } else {
            let descriptionString = SQLUtils.getColumnNamesFromMapping(mapping, true);
            let valuesString = SQLUtils.getValuesFromMapping(values, mapping, true);
            MySQLRequester.connection.query(`INSERT INTO ${mysql.escape(tableName)} (${descriptionString}) VALUES (${valuesString});`, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        }
    })
};

/**
 * Insert data in a table linking two other tables
 * @param id
 * @param mapping: The value to insert
 * @param intermediateTableName
 * @param linkId
 * @param secondMapping
 * @returns {Promise}
 */
MySQLRequester.insertLink = function (id, mapping, intermediateTableName, linkId, linkMapping) {
    return new Promise(function (resolve, reject) {
        if (!MySQLRequester.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        } else {
            MySQLRequester.connection.query(`INSERT INTO ${mysql.escape(intermediateTableName)} (${mapping.id.sqlName},${linkMapping.id.sqlName}) VALUES (${id}, ${linkId});`, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        }
    })
};

/**
 * Update a row in the given table
 * @param tableName : name as in the DB
 * @param values: The value to insert
 * @param mapping: The value to insert
 * @param conditions: Condition on what to insert
 * @returns {Promise}
 */
MySQLRequester.update = function (tableName, values, mapping, conditions) {
    return new Promise(function (resolve, reject) {
        if (!MySQLRequester.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        } else {
            if (!conditions) {
                // Update a single instance
                let updateString = SQLUtils.getUpdateString(values, mapping);
                MySQLRequester.connection.query(`UPDATE ${mysql.escape(tableName)} SET ${updateString} WHERE ${mapping.id.sqlName} = ${values.id};`, function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
            }
        }
    })
};

/**
 * Delete a row from a table
 * @param tableName: Name of the table
 * @param id: ID of the object
 * @param fieldName: Name of the identifier field
 */
MySQLRequester.delete = function (tableName, id, fieldName) {
    return new Promise(function (resolve, reject) {
        if (!MySQLRequester.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        } else {
            MySQLRequester.connection.query(`DELETE FROM ${mysql.escape(tableName)} WHERE ${fieldName} = ${id};`, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        }
    })
};

/**
 * Perform a select on a table. If no conditions are passed, select *
 * @param tableName
 * @param className
 * @param mapping
 * @param conditions
 * @param manipulations
 */
MySQLRequester.select = function (tableName, className, mapping, conditions, manipulations) {
    return new Promise(function (resolve, reject) {
        if (!MySQLRequester.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        } else {
            let manipulationString = "";
            if(manipulations) {
                manipulationString = SQLUtils.getManipulationString(manipulations, mapping);
            }
            if (!conditions) {
                // Without conditions
                MySQLRequester.connection.query(`SELECT * FROM ${mysql.escape(tableName)} ${manipulationString};`, function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(SQLUtils.createObjectsFromRow(className, rows));
                    }
                });
            } else {
                // With condition
                let conditionsString = SQLUtils.getConditionString(tableName, mapping, conditions, true);
                MySQLRequester.connection.query(`SELECT * FROM ${mysql.escape(tableName)} WHERE ${conditionsString} ${manipulationString};`, function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(SQLUtils.createObjectsFromRow(className, rows));
                    }
                });
            }
        }
    })
};

/**
 * Perform a select on different tables and populate each one. If no conditions are passed, select *
 * @param tableName
 * @param className
 * @param mapping
 * @param conditions
 * @param manipulations
 */
MySQLRequester.selectCrossTable = function (tableName, className, mapping, conditions, manipulations) {
    return new Promise(function (resolve, reject) {
        if (!MySQLRequester.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        } else {
            let tableString = SQLUtils.getTableString(mapping);
            let manipulationString = '';
            if (manipulations) {
                manipulationString = SQLUtils.getManipulationString(manipulations, mapping);
            }
            let conditionsString = '';
            if(conditions) {
                conditionsString = SQLUtils.getConditionString(tableName, mapping, conditions, true);
            }
            let tableLinkString = SQLUtils.getTableLinkString(mapping, tableName);
            MySQLRequester.connection.query(`SELECT * FROM ${mysql.escape(tableName)}${tableString.length > 0 ? ',' + mysql.escape(tableString) : ''} WHERE ${tableLinkString} ${conditionsString ? 'AND' : '' } ${conditionsString} ${manipulationString};`, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(SQLUtils.createObjectsFromRow(className, rows, mapping));
                }
            });
        }
    })
};

/**
 * Perform a select on a table linking other tables
 * @param intermediateTableName
 * @param relationTableName
 * @param relationMapping
 * @param tableName
 * @param className
 * @param mapping
 * @param conditions
 * @param manipulations
 */
MySQLRequester.selectIntermediateTable = function (intermediateTableName, relationTableName, relationMapping, tableName, className, mapping, conditions, manipulations) {
    return new Promise(function (resolve, reject) {
        if (!MySQLRequester.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        } else {
            let tableString = SQLUtils.getTableString(mapping);
            let manipulationString = '';
            if (manipulations) {
                manipulationString = SQLUtils.getManipulationString(manipulations, mapping, intermediateTableName);
            }
            let conditionsString = '';
            if(conditions) {
                conditionsString = SQLUtils.getConditionString(intermediateTableName, relationMapping, conditions, true);
            }
            let tableLinkString = SQLUtils.getTableLinkString(mapping, tableName);
            let intermediateString = SQLUtils.getIntermediateString(intermediateTableName, relationTableName, relationMapping, tableName, mapping);
            MySQLRequester.connection.query(`SELECT * FROM ${mysql.escape(tableName)},${mysql.escape(intermediateTableName)},${mysql.escape(relationTableName)}${tableString.length > 0 ? ',' + tableString : ''} WHERE ${intermediateString} ${tableLinkString ? 'AND' : '' } ${tableLinkString} ${conditionsString ? 'AND' : '' } ${conditionsString} ${manipulationString};`, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(SQLUtils.createObjectsFromRow(className, rows, mapping));
                }
            });
        }
    })
};


