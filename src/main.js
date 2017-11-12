const fs = require('fs');

var loadModules = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
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
