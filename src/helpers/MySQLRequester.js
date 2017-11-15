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
        if(!MySQLRequester.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        }else {
            let descriptionString = SQLUtils.getColumnNamesFromMapping(mapping, true);
            let valuesString = SQLUtils.getValuesFromMapping(values, mapping, true);
            MySQLRequester.connection.query(`INSERT INTO ${tableName} (${descriptionString}) VALUES (${valuesString});`, function (err, rows) {
              if(err) {
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
        if(!MySQLRequester.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        }else {
            if(!conditions) {
                // Update a single instance
                let updateString = SQLUtils.getUpdateString(values, mapping);
                MySQLRequester.connection.query(`UPDATE ${tableName} SET ${updateString} WHERE ${mapping.id.sqlName} = ${values.id};`, function (err, rows) {
                    if(err) {
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
        if(!MySQLRequester.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        }else {
            MySQLRequester.connection.query(`DELETE FROM ${tableName} WHERE ${fieldName} = ${id};`, function (err, rows) {
                if(err) {
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
        if(!MySQLRequester.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        }else {
            let manipulationString = SQLUtils.getManipulationString(manipulations);
            if(!conditions) {
                MySQLRequester.connection.query(`SELECT * FROM ${tableName} ${manipulationString};`, function (err, rows) {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(SQLUtils.createObjectsFromRow(className, rows));
                    }
                });
            } else {
                let conditionsString = SQLUtils.getConditionString(mapping, conditions);
                MySQLRequester.connection.query(`SELECT * FROM ${tableName} WHERE ${conditionsString} ${manipulationString};`, function (err, rows) {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            }
        }
    })
};