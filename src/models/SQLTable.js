/**
 * Created by vroub on 12/11/2017.
 */
const MySQLRequester = require('../helpers/MySQLRequester');

module.exports = class SQLTable {

    constructor(tableName, sqlMapping, dbType) {
        this.tableName = tableName;
        this.sqlMapping = sqlMapping;
        dbType ? this.dbType = dbType : this.dbType = "MySQL";
    }

    /**
     * Create the table in the database
     */
    create() {
        return new Promise((resolve, reject) => {

        })
    }


    /**
     * Persist the instance in the database
     * Return the ID of the inserted row
     */
    save() {
        return new Promise((resolve, reject) => {
            require("../helpers/" + this.dbType + "Requester.js").insert(this.tableName, this, this.sqlMapping).then((rows) => {
                this.id = rows.insertId;
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        })
    };

    /**
     * Update the instance.
     */
    update() {
        return new Promise((resolve, reject) => {
            require("../helpers/" + this.dbType + "Requester.js").update(this.tableName, this, this.sqlMapping).then((rows) => {
                this.id = rows.insertId;
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        })
    };

    /**
     * Update several instances based on condition
     */
    static update(values, condition) {

    }

    /**
     * Delete the instance from the db
     */
    remove() {
        return new Promise((resolve, reject) => {
            require("../helpers/" + this.dbType + "Requester.js").delete(this.tableName, this.id, this.sqlMapping.id.sqlName).then((rows) => {
                this.id = rows.insertId;
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        })
    };

    /**
     * Return specific instances according to params
     */
    static find(params) {
        return new Promise((resolve, reject) => {

        })
    }

    /**
     * Same as find all, but populate attributes that reference other classes
     */
    static findAndPopulate(params) {
        return new Promise((resolve, reject) => {

        })
    }
};