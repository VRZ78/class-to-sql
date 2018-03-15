const fs = require('fs');
const sqlTable = require('./src/models/SQLTable.js');
const MySQLRequester = require('./src/helpers/MySQLRequester.js');
let dbEngine;
// Exposed classes and functions
module.exports.sqlTable = sqlTable;
module.exports.setConnection = function(connexion) {
    MySQLRequester.setConnection(connexion);
};
module.exports.setDBEngine = function (engine) {
    dbEngine = engine
};
module.exports.getDBEngine = function () {
    return dbEngine
};
module.exports.customQuery = function (query, classToInstantiate) {
    return new Promise(function(resolve, reject) {
        if(dbEngine === "MySQL") {
            MySQLRequester.customQuery(query, classToInstantiate).then(function(objects) {
                resolve(objects);
            }, function(err) {
                reject(err);
            })
        }
    })

}

