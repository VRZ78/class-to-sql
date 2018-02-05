/**
 * Created by vroub on 12/11/2017.
 */
const classToSql = require("../../index.js");
const CalEvent = require("../models/CalEvent.js");
const Profil = require("../models/Profil.js");

module.exports = class Chauffeur extends classToSql.sqlTable {

    static get TABLE_NAME () {
        return  "chauffeur";
    }

    static get SQL_MAPPING () {
        return {
            id: {
                sqlName: "idCh",
                type: "Number"
            },
            login: {
                sqlName: "identifiantCh",
                type: "String"
            },
            password: {
                sqlName: "mdpCh",
                type: "String"
            },
            firstName: {
                sqlName: "prenomCh",
                type: "String"
            },
            lastName: {
                sqlName: "nomCh",
                type: "String"
            },
            email: {
                sqlName: "mailCh",
                type: "String"
            },
            tel: {
                sqlName: "telCh",
                type: "String"
            },
            position: {
                sqlName: "posteCh",
                type: "String"
            },
            isAdmin: {
                sqlName: "accesCh",
                type: "Number"
            },
            color: {
                sqlName: "colorCh",
                type: "String"
            },
            textColor: {
                sqlName: "couleurTexteCh",
                type: "String"
            },
            profil : {
                sqlName: "idProfil",
                References : Profil,
                type: "String"
            }
        }
    };

    static get DB_TYPE() {
        return "MySQL";
    }

    constructor(login, password, firstName, lastName, email, tel, position, isAdmin, color, textColor) {
        super();
        this.login = login;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.tel = tel;
        this.position = position;
        this.isAdmin = isAdmin;
        this.color = color;
        this.textColor = textColor;
    }

};