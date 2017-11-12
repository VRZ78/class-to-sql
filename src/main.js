const fs = require('fs');
const sqlTable = require('./models/SQLTable.js')
const MySQLRequester = require('./helpers/MySQLRequester.js');

const loadModules = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        let newPath = path + '/' + file;
        let stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {

        }
    });
};


loadModules(__dirname + "/models");
loadModules(__dirname + "/helpers");


/**
 * Make class available
 * @type {{sqlTable: *}}
 */
module.exports = {
    sqlTable : sqlTable,
    setConnection: MySQLRequester.setConnection
};
