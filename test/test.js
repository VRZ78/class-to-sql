/**
 * Created by vroub on 12/11/2017.
 */
const mysql = require('mysql');
const classToSql = require('../index.js');
const CalEvent = require('./models/CalEvent.js');
const Admin = require('./models/Admin.js');
const Chauffeur = require("./models/Chauffeur.js");

classToSql.setDBEngine("MySQL");
classToSql.setConnection(mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'belair'
}));

// Insert with dates
let newEvent;
const insert = function () {
    return new Promise((resolve, reject) => {
        newEvent = new CalEvent(undefined, "Test Event", "Description Event", "ici", 14, 15, 16, 15, new Date(), new Date());
        newEvent.save().then(function (rows) {
            console.log("New Event inserted")
            resolve();
        }, function (err) {
            console.log(err);
            reject();
        })
    })
};

// Update
const update = function () {
    return new Promise((resolve, reject) => {
        newEvent.update().then(function (rows) {
            console.log("Updated event successfully")
            resolve();
        }, function (err) {
            console.log(err);
            reject();
        })
    });
};

// Remove
const remove = function () {
    return new Promise((resolve, reject) => {
        newEvent.remove().then(function (rows) {
            console.log("Event successfully deleted")
            resolve();
        }, function (err) {
            console.log(err);
            reject();
        })
    });
};

// Find all
const findAll = function () {
    return new Promise((resolve, reject) => {
        CalEvent.find().then(function (calevents) {
            console.log('Found ' + calevents.length + ' events')
            resolve();
        }, function (err) {
            console.log(err);
            reject();
        });
    });
};

const findAllManipulation = function (manipulations) {
    return new Promise((resolve, reject) => {
        CalEvent.find(undefined, manipulations).then(function (calevents) {
            console.log('Found ' + calevents.length + ' events with manipulation' + manipulations)
            resolve();
        }, function (err) {
            console.log(err);
            reject();
        });
    });
};

const findAllConditionManipulation = function (condition, manipulations) {
    return new Promise((resolve, reject) => {
        CalEvent.find(condition, manipulations).then(function (calevents) {
            console.log('Found ' + calevents.length + ' events with conditions ' + condition + ' and manipulation ' + manipulations)
            resolve();
        }, function (err) {
            console.log(err);
            reject();
        });
    });
};

const findAndPopulate = function (condition, manipulation) {
    return new Promise((resolve, reject) => {
        Admin.findAndPopulate(condition, manipulation).then(function (admins) {
            console.log('Found ' + admins.length + ' admins with profile objects')
            resolve();
        }, function (err) {
            console.log(err);
            reject();
        });
    });
};

const findFromTable = function (intermediateTable, intermediateClass, conditions, manipulations) {
    return new Promise((resolve, reject) => {
        CalEvent.findFromTable(intermediateTable, intermediateClass, conditions, manipulations).then(function (calEvents) {
            console.log('Found ' + calEvents.length + ' events with conditions from another table ' + conditions + ' and manipulation ' + manipulations)
            resolve();
        }, function (err) {
            console.log(err);
            reject();
        });
    });
};

const linkTo = function () {
    return new Promise((resolve, reject) => {

        let singleChauffeur;
        Chauffeur.find({id: {$eq: 2}}).then(function (chauffeur) {
            singleChauffeur = chauffeur[0];
            newEvent.linkTo(singleChauffeur, 'chauffeur_and_evenement').then(function () {
                console.log('event successfully linked to a chauffeur')
                resolve();
            }, function (err) {
                console.log(err);
                reject();
            })
        }, function (err) {
            console.log(err);
            reject();
        })
    });
};

let startDate = new Date();

findAll().then(function () {
    insert().then(function () {
        update().then(function () {
            findAll().then(function () {
                findAllManipulation({orderBy: {value: "title", way: 'ASC'}, limit: 10}).then(function () {
                    findAllConditionManipulation({id: {$gt: 300}, heureDeb: {$eq: 16}}, {
                        orderBy: {
                            value: "title",
                            way: 'ASC'
                        }, limit: 10
                    }).then(function () {
                        findAndPopulate({profil: {id: {$gt: 1}}}, {
                            orderBy: {
                                value: "id",
                                way: 'ASC'
                            }
                        }).then(function () {
                            findFromTable("chauffeur_and_evenement", Chauffeur, {id: {$eq: 2}}, {
                                orderBy: {
                                    value: "id",
                                    way: 'ASC'
                                }
                            }).then(function () {
                                linkTo().then(function () {
                                    remove().then(function () {
                                        findAll().then(function () {
                                            console.log("----------------------------------------------");
                                            console.log("Done in " + (new Date() - startDate) + " ms");
                                        }, function (err) {
                                            console.log(err);
                                        })
                                    }, function (err) {
                                        console.log(err);
                                    })
                                }, function (err) {
                                    console.log(err);
                                })
                            }, function (err) {
                                console.log(err);
                            })
                        }, function (err) {
                            console.log(err);
                        })
                    }, function (err) {
                        console.log(err);
                    })
                }, function (err) {
                    console.log(err);
                })
            }, function (err) {
                console.log(err);
            })
        }, function (err) {
            console.log(err);
        })
    }, function (err) {
        console.log(err);
    })
}, function (err) {
    console.log(err);
});




