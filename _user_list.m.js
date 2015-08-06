/*
 * 用文件方式来实现用户存储。
 * 此文件已经放弃使用，部分函数不够完善。
 * Lion
 * 2015-08-04
 */

var fs = require('fs');

/*
 * 获取用户列表，直接返回文件内容，加上编码是想得到文件直接内容，如果不加，会是一个对象。
 */
exports.getUserList = function (callback) {
    fs.readFile('user.txt', {
        encoding: 'utf8',
        flag: 'r+'
    }, callback);
}

/*
 * 增加用户，先读出文件中的用户列表，转成数组，之后再push新用户，最后再变成以逗号分隔的字符串，存回文件。
 */
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

/*
 * 移除用户，先读取用户文件中的列表，转化为数组，之后splice掉要删除的用户，再转成以逗号分隔的字符，存回文件。
 */
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

/*
 * 用户是否已经存在，先读取用户文件中的列表，转化为数组，之后遍历数组，查看是否有相同的，如果有，返回true，没有返回false。
 */
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