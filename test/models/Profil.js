/**
 * Created by vroub on 12/11/2017.
 */
const classToSql = require("../../index.js")

module.exports = class Profil extends classToSql.sqlTable {

    static get TABLE_NAME () {
        return  "profil";
    }

    static get SQL_MAPPING () {
        return {
            id: {
                sqlName: "idProfil",
                type: "Number"
            },
            name: {
                sqlName: "nomProfil",
                type: "String"
            }
        }
    };

    static get DB_TYPE() {
        return "MySQL";
    }

    constructor(id, name) {
        super();
        this.id = id;
        this.name = name;
    }

};