const fs = require('fs');
const sqlTable = require('./src/models/SQLTable.js');
const MySQLRequester = require('./src/helpers/MySQLRequester.js');

module.exports.sqlTable = sqlTable;
module.exports.setConnection = function(connexion) {
    MySQLRequester.setConnection(connexion);
};

