/**
 * Created by limeng on 15-8-12.
 */

var mongodb = require('mongodb');
var dbClient;
var db;

var config = {
    'db': {
        'host': '127.0.0.1',
        'port': 27017,
        'user': '',
        'password': '',
        'db_name': 'node_test'
    }
}

module.exports = function () {
    __constructor();

    this.findOneById = function (tableName, idJson, callback) {

    };
    this.insert = function (tableName, rowInfo, callback) {
        connection(function (db) {
            console.log(db);
            var collection = db.collection(tableName);

            collection.insert(rowInfo, function (err, objects) {
                if (err) {
                    callback(false);
                } else {
                    callback(objects);
                }
            });
        });
    };
    this.modify = function (tableName, idJson, rowInfo, callback) {

    };
    this.remove = function (tableName, idJson, callback) {

    };
    this.find = function (tableName, whereJson, orderByJson, limitArr, fieldsArr, callback) {

    };
    function __constructor() {
        connection(function (ret) {

        });
    }
}

function connection(callback) {
    if (!db) {
        var host = config.db.host;
        var port = config.db.port;
        var dbName = config.db.db_name;
        console.log(host);
        console.log(port);
        var server = new mongodb.Server(host, port);

        dbClient = new mongodb.Db(dbName, server, {safe: false});
        dbClient.open(function (err, dbObject) {
            if (err) {
                console.log('connection Err:', err.message);
                throw err;
            }

            db = dbObject;
            callback(dbObject);
            console.log('connection success');
        });
    } else {
        callback(db);
    }
}