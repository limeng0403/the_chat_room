/*
 * Lion
 * 2015-08-04
 */

var userArr = [];

exports.getUserList = function (callback) {
    callback(false, userArr);
}

exports.addUserList = function (userName, callback) {
    this.getUserList(function (err, data) {
        if (err) {
            callback(err, false);
            return false;
        }

        var time = new Date().getTime();
        time = parseInt(time / 1000);

        data.push({
            username: userName,
            lastaction: time
        });

        userArr = data;

        callback(false, userArr);
    });
}

exports.removeUserList = function (userName, callback) {
    this.getUserList(function (err, data) {
        if (err) {
            callback(err, false);
            return false;
        }

        var arr = data;
        var len = arr.length;

        for (var i = 0; i < len; i++) {
            if (arr[i].username == userName) {
                arr.splice(i, 1);
            }
        }

        userArr = arr;

        callback(false, userArr);
    });
}

exports.isExistUserList = function (userName, callback) {
    this.getUserList(function (err, data) {
        if (err) {
            callback(err, false);
            return false;
        }

        var arr = data;
        var len = arr.length;

        for (var i = 0; i < len; i++) {
            if (arr[i].username == userName) {
                callback(err, true);
            }
        }

        callback(err, false);
    });
}

exports.updateUserLastAction = function (userName, callback) {
    this.isExistUserList(userName, function (err, data) {
        if (!data) {
            callback(false, userArr);
            return false;
        }

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
    });
}