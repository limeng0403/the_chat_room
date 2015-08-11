/**
 * Created by limeng on 15-8-10.
 */

var config = require('../config/database.conf.js').config();
var mysql = require('mysql');

module.exports = function () {
    __constructor();

    this.findOneById = function (tableName, idJson, callback) {
        dbClient.query('select * from ' + tableName + ' where ?', idJson, function (err, results) {
            if (err) {
                console.log('getData Error:' + error.message);
                dbClient.end();
                callback(false);
            } else {
                if (results) {
                    callback(results.pop());
                } else {
                    callback(results);
                }
            }
        });
    }

    this.insert = function (tableName, rowInfo, callback) {
        dbClient.query('insert into ' + tableName + ' set ?', rowInfo, function (err, result) {
            if (err) {
                throw err;
            }

            callback(result.insertId);
        });
    }

    this.modify = function (tableName, idJson, rowInfo, callback) {
        dbClient.query('update ' + tableName + ' set ? where ?', [rowInfo, idJson], function (err, result) {
            if (err) {
                console.log('ClientReady Error:' + err.message);
                callback(false);
            } else {
                callback(result);
            }
        });
    }

    this.remove = function (tableName, idJson, callback) {
        dbClient.query('delete from ' + tableName + ' where ?', idJson, function (err, results) {
            if (err) {
                console.log('ClientReady Error:' + err.message);
                dbClient.end();
                callback(false);
            } else {
                callback(true);
            }
        });
    }

    /*
     * @param tableName string
     * @param whereJson json desc(and 和 or 区别，其中的条件为key值、连接符大于小于还是等于value值)
     * @param orderByJson json desc({'key':'time','type':'desc'})
     * @param limitArr array desc(第一个元素是返回偏移量，第二个元素是返回数量，如果为空，则返回全部)
     * @param fieldsArr array desc(返回哪些字段)
     */
    this.find = function (tableName, whereJson, orderByJson, limitArr, fieldsArr, callback) {
        var andWhere = whereJson['and'];
        var orWhere = whereJson['or'];
        var andArr = [];
        var orArr = [];

        for (var i = 0; i < andWhere.length; i++) {
            andArr.push(andWhere[i]['key'] + andWhere[i]['opts'] + andWhere[i]['value']);
        }

        for (var i = 0; i < orWhere.length; i++) {
            orArr.push(orWhere[i]['key'] + orWhere[i]['opts'] + orWhere[i]['value']);
        }

        var filedsStr = fieldsArr.length > 0 ? fieldsArr.join(',') : '*';
        var andStr = andArr.length > 0 ? andArr.join(' and ') : '';
        var orStr = orArr.length > 0 ? ' or ' + orArr.join(' or ') : '';
        var limitStr = limitArr.length > 0 ? ' limit ' + limitArr.join(',') : '';
        var orderStr = orderByJson ? ' order by ' + orderByJson['key'] + ' ' + orderByJson['type'] : '';
        var sql = 'select ' + filedsStr + ' from ' + tableName + ' where ' + andStr + orStr + orderStr + limitStr;

        console.log(sql);

        dbClient.query(sql,function(err,results){
            if(err){
                console.log('GetData Error:'+err.message);
                dbClient.end();
                callback(false);
            }else{
                callback(results);
            }
        });
    }

    function __constructor() {
        client = {};
        client.host = config.host;
        client.port = config.port;
        client.user = config.user;
        client.password = config.password;
        client.database = config.dbName;

        dbClient = mysql.createConnection(client);
        dbClient.connect();
        dbClient.query('set names utf8;', function (error, result) {
            if (error) {
                console.log('ClientConnectionReady Error:', error.message);
                dbClient.end();
                return false;
            }

            console.log('connection local mysql success');
        });
    }
}