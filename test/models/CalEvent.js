/**
 * Created by vroub on 13/11/2017.
 */
const classToSql = require("../../src/main.js")

module.exports = class CalEvent extends classToSql.sqlTable {

    static get TABLE_NAME () {
        return  "evenement";
    }

    static get SQL_MAPPING () {
        return {
            id: {
                sqlName: "idEv",
                type: "Number"
            },
            title: {
                sqlName: "titreEv",
                type: "String"
            },
            description: {
                sqlName: "descriptionEv",
                type: "String"
            },
            lieu: {
                sqlName: "lieuEv",
                type: "String"
            },
            heureDeb: {
                sqlName: "heureDebutEv",
                type: "Number"
            },
            minuteDeb: {
                sqlName: "minuteDebutEv",
                type: "Number"
            },
            heureFin: {
                sqlName: "heureFinEv",
                type: "Number"
            },
            minuteFin: {
                sqlName: "minuteFinEv",
                type: "Number"
            },
            dateDeb: {
                sqlName: "dateDebutEv",
                type: "Date"
            },
            dateFin: {
                sqlName: "dateFinEv",
                type: "Date"
            }
        }
    };

    static get DB_TYPE() {
        return "MySQL";
    }

    constructor(id, title, description, lieu, heureDeb, minuteDeb, heureFin, minuteFin, dateDeb, dateFin) {

        super();
        this.id = id;
        this.title = title;
        this.description = description;
        this.lieu = lieu;
        this.heureDeb = heureDeb;
        this.heureFin = heureFin;
        this.minuteDeb = minuteDeb;
        this.minuteFin = minuteFin;
        this.dateDeb = dateDeb;
        this.dateFin = dateFin;

    }

};

