/**
 * Created by vroub on 12/11/2017.
 */
const mysql = require('mysql');
const classToSql = require('../src/main.js');
const CalEvent = require('./models/CalEvent.js');

classToSql.setConnection(mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'belair'
}));

// Insert with dates
let newEvent;
const insert = function () {
    newEvent = new CalEvent(undefined, "Test Event", "Description Event", "ici", 14, 15, 16, 15, new Date(), new Date());
    newEvent.save().then(function (rows) {
        console.log(rows.insertId);
    }, function (err) {
        console.log(err);
    })
};

// Update
const update = function () {
    newEvent = new CalEvent(644, "Test Event2", "Description Event2", "ici", 14, 15, 16, 15, new Date(), new Date());
    newEvent.update().then(function (rows) {
        console.log(rows);
    }, function (err) {
        console.log(err);
    })
};

// Remove
const remove = function () {
    newEvent = new CalEvent(644, "Test Event2", "Description Event2", "ici", 14, 15, 16, 15, new Date(), new Date());
    newEvent.remove().then(function (rows) {
        console.log(rows);
    }, function (err) {
        console.log(err);
    })
};

// Find all
const findAll = function () {
    CalEvent.find().then(function (calevents) {
        console.log(calevents)
    }, function (err) {
        console.log(err);
    });
};

const findAllManipulation = function (manipulations) {
    CalEvent.find(undefined, manipulations).then(function (calevents) {
        console.log(calevents)
    }, function (err) {
        console.log(err);
    });
}

const findAllConditionManipulation = function (condition, manipulations) {
    CalEvent.find(condition, manipulations).then(function (calevents) {
        console.log(calevents)
    }, function (err) {
        console.log(err);
    });
}

findAllConditionManipulation({idEv: {$gt: 300}},{orderBy: {value: "title", way: 'ASC'}, limit: 10});


