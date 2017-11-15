/**
 * Created by vroub on 12/11/2017.
 */
const MySQLRequester = require('../helpers/MySQLRequester');

module.exports = class SQLTable {

    constructor() {

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
            require("../helpers/" + this.DB_TYPE + "Requester.js").insert(this.TABLE_NAME, this, this.SQL_MAPPING).then((rows) => {
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
            require("../helpers/" + this.DB_TYPE + "Requester.js").update(this.TABLE_NAME, this, this.SQL_MAPPING).then((rows) => {
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
            require("../helpers/" + this.DB_TYPE + "Requester.js").delete(this.TABLE_NAME, this.id, this.SQL_MAPPING.id.sqlName).then((rows) => {
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
    static find(conditions, manipulations) {
        return new Promise((resolve, reject) => {
            require("../helpers/" + this.DB_TYPE + "Requester.js").select(this.TABLE_NAME, this, this.SQL_MAPPING, conditions, manipulations).then((rows) => {
                this.id = rows.insertId;
                resolve(rows);
            }, function (err) {
                reject(err);
            })
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