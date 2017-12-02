const fs = require('fs');
const sqlTable = require('./models/SQLTable.js');
const MySQLRequester = require('./helpers/MySQLRequester.js');

module.exports.sqlTable = sqlTable;
module.exports.setConnection = function(connexion) {
    MySQLRequester.setConnection(connexion);
};

