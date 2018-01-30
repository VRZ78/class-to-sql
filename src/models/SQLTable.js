/**
 * Created by vroub on 12/11/2017.
 */
const index = require('../../index.js')

module.exports = class SQLTable {

    constructor() {
    }

    /**
     * Create the table in the database
     */
    static create() {
        return new Promise((resolve, reject) => {

        })
    }


    /**
     * Persist the instance in the database
     * Return the ID of the inserted row
     */
    save() {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").insert(this.constructor.TABLE_NAME, this, this.constructor.SQL_MAPPING).then((rows) => {
                this.id = rows.insertId;
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        })
    };

    /**
     * Link this class and another class in an intermediate table
     */
    linkTo(instance, intermediateTableName) {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").insertLink(this.id, this.constructor.SQL_MAPPING, intermediateTableName, instance.id, instance.constructor.SQL_MAPPING).then((rows) => {
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        });
    };

    /**
     * Update the instance.
     */
    update() {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").update(this.constructor.TABLE_NAME, this, this.constructor.SQL_MAPPING).then((rows) => {
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
            require("../helpers/" + index.getDBEngine() + "Requester.js").delete(this.constructor.TABLE_NAME, this.id, this.constructor.SQL_MAPPING.id.sqlName).then((rows) => {
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
            require("../helpers/" + index.getDBEngine() + "Requester.js").select(this.TABLE_NAME, this, this.SQL_MAPPING, conditions, manipulations).then((rows) => {
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        })
    }

    /**
     * Same as find all, but populate attributes that reference other classes
     */
    static findAndPopulate(conditions, manipulations) {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").selectCrossTable(this.TABLE_NAME, this, this.SQL_MAPPING, conditions, manipulations).then((rows) => {
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        })
    }

    /**
     * Find instances from a table which link this class and another class
     * @param intermediateTableName
     * @param relationClass
     * @param conditions
     * @param manipulations
     * @returns {Promise}
     */
    static findFromTable(intermediateTableName, relationClass, conditions, manipulations) {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").selectIntermediateTable(intermediateTableName, relationClass.TABLE_NAME, relationClass.SQL_MAPPING, this.TABLE_NAME, this, this.SQL_MAPPING, conditions, manipulations).then((rows) => {
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        })
    }


};