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
 * @param value: The value to insert
 * @param mapping: The value to insert
 * @returns {Promise}
 */
MySQLRequester.insert = function (tableName, values, mapping) {
    return new Promise(function (resolve, reject) {
        if(!this.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        }else {
            let descriptionString = SQLUtils.getTableNamesFromMapping(mapping);
            let valuesString = SQLUtils.getValuesFromMapping(values, mapping);
            MySQLRequester.connection.query(`INSERT INTO ${tableName} (${descriptionString}) VALUES ${valuesString}`, function (err, rows) {
              if(err) {
                  reject(err);
              } else {
                  resolve(rows);
              }
            })
        }
    })
};