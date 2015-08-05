/*
 * Lion
 * 2015-08-04
 */

var fs = require('fs');

exports.getUserList = function (callback) {
    fs.readFile('user.txt', {
        encoding: 'utf8',
        flag: 'r+'
    }, callback);
}

exports.addUserList = function (userName, callback) {
    this.getUserList(function (err, data) {
        if (err) {
            callback(err, false);
            return false;
        }
        if (!data) {
            data = '';
            var arr = [];
        } else {
            var arr = data.split(',');
        }

        arr.push(userName);

        fs.writeFile('user.txt', arr.join(','), {
            encoding: 'utf8',
            flag: 'w+'
        }, callback(err, true));
    });
}

exports.removeUserList = function (userName, callback) {
    this.getUserList(function (err, data) {
        if (err) {
            callback(err, false);
            return false;
        }
        if (!data) {
            data = '';
            var arr = [];
        } else {
            var arr = data.split(',');
            var len = arr.length;
        }

        for (var i = 0; i < len; i++) {
            if (arr[i] == userName) {
                arr.splice(i, 1);
            }
        }

        fs.writeFile('user.txt', arr.join(','), {
            encoding: 'utf8',
            flag: 'w+'
        }, callback(err, true));
    });
}

exports.isExistUserList = function (userName, callback) {
    this.getUserList(function (err, data) {
        if (err) {
            callback(err, false);
            return false;
        }
        if (!data) {
            data = '';
            var arr = [];
        } else {
            var arr = data.split(',');
            var len = arr.length;
        }

        for (var i = 0; i < len; i++) {

        } if (arr[i] == userName) {
            callback(err, true);
        }

        callback(err, false);
    });
}