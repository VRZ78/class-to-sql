/**
 * Created by vroub on 12/11/2017.
 */
const classToSql = require("../../src/index.js")
const Profil = require("../models/Profil.js")

module.exports = class Admin extends classToSql.sqlTable {

    static get TABLE_NAME () {
        return  "admin";
    }

    static get SQL_MAPPING () {
        return {
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
            },
            profil: {
                sqlName: "idProfil",
                references: Profil
            }
        }
    };

    static get DB_TYPE() {
        return "MySQL";
    }

    constructor(login, password, firstName, lastName, mailAdmin, profil) {
        super();
        this.login = login;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mailAdmin = mailAdmin;
        this.profil = new Profil(profil);
    }

};