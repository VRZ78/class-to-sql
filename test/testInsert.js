/**
 * Created by vroub on 12/11/2017.
 */
const mysql = require('mysql');
const classToSql = require('../src/main.js');
const Admin = require('./models/admin.js');

classToSql.setConnection(mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'belair'
}));

let newUser = new Admin("vrz", "pass", "Roubs", "Victor", "vroubi78@gmail.com");
newUser.save().then(function (rows) {
    console.log(rows)
}, function (err) {
    console.log(err);
});