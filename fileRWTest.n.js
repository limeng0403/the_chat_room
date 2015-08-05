var userList = require('./user_list.plus.js');
var io = require('socket.io').listen(3000);
var stc = require('node-static');

var fileServer = new stc.Server('./');

require('http').createServer(function (req, res) {
    req.addListener('end', function () {
        fileServer.serveFile('/index.html', 200, {}, req, res);
    }).resume();
}).listen(8000);

console.log('is running:localhost:8000');

io.sockets.on('connection', function (socket) {
    socket.on('login',function(data){
        userList.addUserList(data.username,function(err,status){
            if(status){
                io.emit('client',{from:'系统',to:'大家',msg:'欢迎'+data.username+'进入聊天室。'});
                console.log(status);
                io.emit('client_user_list',status);
            }else {
                socket.emit('client', {from: '系统', to: '大家', msg: '进行聊天室失败，请刷新浏览器重试。'});
            }
        });
    });

    socket.on('logon',function(data){
        userList.removeUserList(data.username,function(err,status){
            io.emit('client', {from: '系统', to: '大家', msg: data.username+'已经退出聊天室。'});
            io.emit('client_user_list',status);
        });
    });

    socket.on('server', function (data) {
        console.log(data);

        //data:{from:'userName',to:'userName',msg:'message',imgUrl:'image url'}
        userList.updateUserLastAction(data.from,function(err,status){
            if(status){
                io.emit('client_user_list',status);
            }
        });

        io.emit('client', data);
    });

    socket.emit('client', {
        from: 'System',
        to: '大家',
        msg: '欢迎来到聊天室！'
    });
    socket.emit('client', {
        from: 'System',
        to: '大家',
        msg: '请文明用语。'
    });
});

console.log('is running:localhost:3000');
