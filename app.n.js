/*
 * 主入口
 * system_msg:系统消息
 *
 */
var userList = require('./modules/user_list.m.js');
var createUserName = require('./modules/create_user_name.m.js');
var tools = require('./modules/tools.m.js');
var config = require('./config/config.conf.js');
var io = require('socket.io').listen(3000);
var stc = require('node-static');

var fileServer = new stc.Server('./');

require('http').createServer(function (req, res) {

    req.addListener('end', function () {
        fileServer.serve(req, res, function (err, res) {
            console.log(res);
        });
    }).resume();
}).listen(8000);

console.log('is running:localhost:8000');

io.sockets.on('connection', function (socket) {
    socket.on('login', function (data) {
        userList.addUserList(function (err, status) {
            var id = status.id;
            var userName = status.username;
            var userList = status.userlist;

            if (status) {
                io.emit('client_user_list', userList);
                socket.emit('user_info', {userid: id, username: userName});
                io.emit('system_msg', {
                    'type': 'login',
                    'who': userName,
                    'msg': '进入聊天室。',
                    'timestamp': tools.getTimestamp()
                });
            } else {
                socket.emit('system_msg', {
                    'type': 'info',
                    'who': 'all',
                    'msg': '某人进入聊天室失败。',
                    'timestamp': tools.getTimestamp()
                });
            }
        });
    });

    socket.on('logon', function (data) {
        userList.removeUserList(data.id, function (err, status) {
            io.emit('system_msg', {
                'type': 'logon',
                'who': data.username,
                'msg': '已经退出聊天室。',
                'timestamp': tools.getTimestamp()
            });
            io.emit('client_user_list', status);
        });
    });

    socket.on('change_user_name', function (data) {
        var userId = data.id;
        var userName = data.username;
        var newName = createUserName.createUserName();

        userList.updateUserName(userId, newName, function (err, status) {
            if (!status) {
                socket.emit('user_info', {userid: userId, username: userName});
                socket.emit('system_msg', {
                    'type': 'error',
                    'who': newName,
                    'msg': '此名称已存在，修改失败。',
                    'timestamp': tools.getTimestamp()
                });
            } else {
                var srcName = status.srcname;
                var userList = status.userlist;
                io.emit('system_msg', {
                    'type': 'info',
                    'who': 'all',
                    'msg': '用户' + srcName + '改名为' + newName + '。',
                    'timestamp': tools.getTimestamp()
                });
                console.log('change_user_name:', userList);
                io.emit('client_user_list', userList);
            }
        });
    });

    socket.on('server', function (data) {
        //data:{from:'userName',to:'userName',msg:'message',imgUrl:'image url'}

        data.msg=data.msg.replace(/</ig,'&lt;');
        data.msg=data.msg.replace(/>/ig,'&gt;');

        io.emit('client', data);
    });

    var welcome=config.welcome()
    var len=welcome.length;

    for(var i=0;i<len;i++){
        socket.emit('system_msg', {
            'type': 'info',
            'who': 'all',
            'msg': welcome[i],
            'timestamp': tools.getTimestamp()
        });
    }

});

console.log('is running:localhost:3000');
