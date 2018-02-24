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
    linkTo(instance, intermediateTableName, fieldName, instanceFieldName, intermediateMapping, intermediateValues) {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").insertLink(this.id, instance.id, intermediateTableName, fieldName, instanceFieldName,intermediateMapping, intermediateValues).then((rows) => {
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
    static update(values, conditions) {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").updateTable(this.TABLE_NAME, values, this.SQL_MAPPING, conditions).then((rows) => {
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        })
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
     * Update several instances based on condition
     */
    static remove(conditions) {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").deleteTable(this.TABLE_NAME, this.SQL_MAPPING, conditions).then((rows) => {
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        })
    }

    /**
     * Remove Link from this class with another class in an intermediate table
     */
    removeLink(instance, intermediateTableName, fieldName, instanceFieldName) {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").deleteLink(this.id, instance.id, intermediateTableName, fieldName, instanceFieldName).then(() => {
                resolve();
            }, function (err) {
                reject(err);
            })
        });
    };

    /**
     * Remove instances from a table which link this class and another class
     * @param intermediateTableName
     * @param relationClass
     * @param fieldName
     * @param linkFieldName
     * @param conditions
     * @param conditionsRemote
     * @param conditionsLink
     * @returns {Promise}
     */
    static removeFromTable(intermediateTableName, relationClass, fieldName, linkFieldName, conditions, conditionsRemote, conditionsLink) {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").deleteFromTable(intermediateTableName, fieldName, linkFieldName, relationClass.TABLE_NAME, relationClass.SQL_MAPPING, this.TABLE_NAME, this, this.SQL_MAPPING, conditions, conditionsRemote, conditionsLink).then((rows) => {
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        })
    }

    /**
     * Return specific instances according to params
     */
    static find(conditions, manipulations, distinct) {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").select(this.TABLE_NAME, this, this.SQL_MAPPING, conditions, manipulations, distinct).then((rows) => {
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        })
    }

    /**
     * Same as find all, but populate attributes that reference other classes
     */
    static findAndPopulate(conditions, manipulations, distinct) {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").selectCrossTable(this.TABLE_NAME, this, this.SQL_MAPPING, conditions, manipulations, distinct).then((rows) => {
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
     * @param fieldName
     * @param linkFieldName
     * @param additionalMapping
     * @param conditions
     * @param conditionsRemote
     * @param conditionsLink
     * @param manipulations
     * @param distinct
     * @returns {Promise}
     */
    static findFromTable(intermediateTableName, relationClass, fieldName, linkFieldName, additionalMapping, conditions, conditionsRemote, conditionsLink, manipulations, distinct) {
        return new Promise((resolve, reject) => {
            require("../helpers/" + index.getDBEngine() + "Requester.js").selectIntermediateTable(intermediateTableName, fieldName, linkFieldName, relationClass.TABLE_NAME, relationClass.SQL_MAPPING, this.TABLE_NAME, this, this.SQL_MAPPING, conditions, conditionsRemote, conditionsLink, manipulations, distinct, additionalMapping).then((rows) => {
                resolve(rows);
            }, function (err) {
                reject(err);
            })
        })
    }


};