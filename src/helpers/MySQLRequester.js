const MySQLRequester = module.exports;

const mysql = require('mysql');

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
MySQLRequester.insert = function (tableName, value, mapping) {
    return new Promise(function (resolve, reject) {
        if(!this.connection) {
            reject(new Error("No MySQL connection set. Use setConnection first."));
        }else {
            MySQLRequester.connection.query("")
        }
    })
};