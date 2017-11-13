/**
 * Created by vroub on 12/11/2017.
 */
const classToSql = require("../../src/main.js")

module.exports = class Admin extends classToSql.sqlTable {

    constructor(login, password, firstName, lastName, mailAdmin) {
        const TABLE_NAME = "admin";
        const SQL_MAPPING = {
            id: {
                sqlName: "idAdmin",
                type: "Number"
            },
            login: {
                sqlName: "identifiantAdmin",
                type: "String"
            },
            password: {
                sqlName: "mdpAdmin",
                type: "String"
            },
            firstName: {
                sqlName: "nomAdmin",
                type: "String"
            },
            lastName: {
                sqlName: "prenomAdmin",
                type: "String"
            },
            mailAdmin: {
                sqlName: "mailAdmin",
                type: "String"
            }
        };
        super(TABLE_NAME, SQL_MAPPING);
        this.login = login;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mailAdmin = mailAdmin;
    }

};