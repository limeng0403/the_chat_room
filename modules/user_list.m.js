/*
 * 用JSON方式来实现用户存储。
 * 暂时方案，
 * Lion
 * 2015-08-05
 */
var createUserName = require('./create_user_name.m.js');

/*
 * 存储用户数据，数据结构[{id:id,username:userName,lastaction:lastAction},...]
 */
var userArr = [];

/*
 * 增加用户，直接push，last action用的是时间戳，因为主要是用到秒，所以取到的时间要除以1000，再取整。
 * 返回用户列表数组
 */
exports.addUserList = function (callback) {
    var id = new Date().getTime() + '' + parseInt(Math.random() * 100);
    var userName = createUserName.createUserName('male');
    var time = new Date().getTime();
    time = parseInt(time / 1000);

    userArr.push({
        userid: id,
        username: userName,
        lastaction: time
    });

    callback(false, {id: id, username: userName, userlist: userArr});
}

exports.removeUserList = function (userId, callback) {
    var len = userArr.length;
    var newArr = [];

    for (var i = 0; i < len; i++) {
        if (userArr[i].userid != userId) {
            newArr.push(userArr[i]);
        }
    }

    userArr = newArr;

    callback(false, userArr);
}

exports.isExistUserList = function (userName, callback) {
    var len = userArr.length;

    for (var i = 0; i < len; i++) {
        if (userArr[i].username == userName) {
            callback(false, true);
        }
    }

    callback(false, false);
}

exports.updateUserLastAction = function (userName, callback) {
    var len = userArr.length;

    for (var i = 0; i < len; i++) {
        if (userArr[i].username == userName) {
            var time = new Date().getTime();
            time = parseInt(time / 1000);

            userArr[i].lastaction = time;
            break;
        }
    }

    callback(false, userArr);
}

exports.updateUserName = function (userid, newName, callback) {
    var srcName = '';

    this.isExistUserList(newName, function (err, status) {
        if (status) {
            callback(false, false);
        } else {
            var len = userArr.length;

            for (var i = 0; i < len; i++) {
                if (userArr[i].userid == userid) {
                    srcName = userArr[i].username;
                    userArr[i].username = newName;
                    break;
                }
            }

            if (srcName == '') {
                callback(false, false);
            }

            callback(false, {srcname: srcName, newname: newName, userlist: userArr});
        }
    });
}