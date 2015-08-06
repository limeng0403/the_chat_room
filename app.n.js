var userList = require('./user_list.m.js');
var createUserName = require('./create_user_name.m.js');
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
                console.log('login:', userList);
                io.emit('client_user_list', userList);
                socket.emit('user_info', {userid: id, username: userName});
                io.emit('client', {from: '管理员', to: '大家', msg: '欢迎' + userName + '进入聊天室。'});
            } else {
                socket.emit('client', {from: '管理员', to: '大家', msg: '进行聊天室失败，请刷新浏览器重试。'});
            }
        });
    });

    socket.on('logon', function (data) {
        userList.removeUserList(data.id, function (err, status) {
            io.emit('client', {from: '管理员', to: '大家', msg: data.username + '已经退出聊天室。'});
            console.log('logon:', status);
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
                socket.emit('client', {from: '管理员', to: '你', msg: newName + '，此名称已存在，修改失败。'});

            } else {
                var srcName = status.srcname;
                var userList = status.userlist;
                io.emit('client', {from: '管理员', to: '大家', msg: '用户' + srcName + '改名为' + newName + '。'});
                console.log('change_user_name:', userList);
                io.emit('client_user_list', userList);
            }
        });
    });

    socket.on('server', function (data) {
        //data:{from:'userName',to:'userName',msg:'message',imgUrl:'image url'}
        userList.updateUserLastAction(data.from, function (err, status) {
            if (status) {
                console.log('server:', status);
                io.emit('client_user_list', status);
            }
        });

        io.emit('client', data);
    });

    socket.emit('client', {
        from: '管理员',
        to: '大家',
        msg: '欢迎来到聊天室！'
    });
    socket.emit('client', {
        from: '管理员',
        to: '大家',
        msg: '请文明用语。'
    });
    socket.emit('client', {
        from: '管理员',
        to: '大家',
        msg: '因为没有使用数据库，所以不支持用户注册及登录。'
    });
    socket.emit('client', {
        from: '管理员',
        to: '大家',
        msg: '由于没有使用数据，不会记录下用户的聊天记录，请放心使用。'
    });
    socket.emit('client', {
        from: '管理员',
        to: '大家',
        msg: '此应用仅为学习使用，不用作商业用途，开发者不承担任何责任。'
    });
});

console.log('is running:localhost:3000');
