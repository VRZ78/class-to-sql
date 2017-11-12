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
            require("../helpers/" + this.dbType + "Requester.js").insert(this.tableName, this, this.sqlMapping).then(function (rows) {
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

        })
    };

    /**
     * Delete from the db
     */
    remove() {
        return new Promise((resolve, reject) => {

        })
    };

    /**
     * Return all the instances of the class stored in the DB
     */
    findAll() {
        return new Promise((resolve, reject) => {

        })
    }

    /**
     * Same as find all, but populate attributes that reference other classes
     */
    findAndPopulate() {
        return new Promise((resolve, reject) => {

        })
    }

    /**
     * Perform a specific request
     */
    find(params) {
        return new Promise((resolve, reject) => {

        })
    }

};