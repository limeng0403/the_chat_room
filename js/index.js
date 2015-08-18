/**
 * Created by limeng on 15-8-6.
 */

var socket = '';
var msg = '';
var userId = '';
var user = '';
var toUser = '所有人';

var msgListObj = document.getElementById('msgList');
var $msgListobj = $(msgListObj);

$(function () {
    $('#say').focus();

    socket = io.connect('http://localhost:3000');

    socket.emit('login', '');

    socket.on('connect', function () {
        socket.on('user_info', function (data) {
            console.log(data);

            userId = data.userid;
            document.cookie = 'userid=' + userId;
            user = data.username;

            $('#userName').text(user);
        });

        socket.on('system_msg', function (data) {
            var type = data.type;

            if (!type) {
                return false;
            }

            var who = data.who;
            var whoArr = who.split(';');
            var whoArrLen = whoArr.length;
            var msg = data.msg;
            var timestamp = data.timestamp;

            if (who == 'all') {
                who = '所有人';
            }

            for (var i = 0; i < whoArrLen; i++) {
                if (whoArr[i] == 'all') {
                    whoArr[i] = '所有人';
                }
            }

            switch (type) {
                case 'login':
                    var html = '<p><span class="red1">登录动态：</span>';
                    html += '<a href="javascript:void(0)" class="btn-link" onclick="showTo(\'' + who + '\')">' + who + '</a>';
                    html += '进入聊天室。</p>';
                    break;
                case 'logon':
                    var html = '<p><span class="red1">退出动态：</span>';
                    html += '<a href="javascript:void(0)" class="btn-link">' + who + '</a>';
                    html += '退出聊天室。</p>';
                    break;
                case 'warning':
                    var html = '<p><span class="red2">警告消息：</span>';
                    for (var i = 0; i < whoArrLen; i++) {
                        html += '【<a href="javascript:void(0)" class="btn-link" onclick="showTo(\'' + whoArr[i] + '\')">' + whoArr[i] + '</a>】';
                    }
                    html += '注意。' + msg + '</p>';
                    break;
                case 'info':
                    var html = '<p><span class="red2">系统消息：</span>请';
                    for (var i = 0; i < whoArrLen; i++) {
                        html += '【<a href="javascript:void(0)" class="btn-link" onclick="showTo(\'' + whoArr[i] + '\')">' + whoArr[i] + '</a>】';
                    }
                    html += '注意。' + msg + '</p>';
                    break;
                case 'error':
                    var html = '<p><span class="red2">系统错误：</span>';
                    html += msg + '</p>';
                    break;
            }

            $msgListobj.append(html);
        });

        socket.on('client', function (data) {
            console.log(data);

            if (!data.from || !data.to || !data.msg) {
                return false;
            }

            var msgs = '<a href="javascript:void(0)" class="btn-link" onclick="showTo(\'' + data.from + '\')">' + data.from + '</a>';
            if (data.to == 'all') {
                msgs += '对<span class="red1">所有人</span>';
            } else {
                msgs += '对<a href="javascript:void(0)" class="btn-link" onclick="showTo(\'' + data.to + '\')">' + data.to + '</a>';
            }

            msgs += '说：' + data.msg;
            $msgListobj.append('<p>' + msgs + '</p>');

            var scrollH = $msgListobj[0].scrollHeight;
            $msgListobj.scrollTop(scrollH);
        });

        socket.on('client_user_list', function (data) {
            console.log(data);

            if (!data == '') {
                var len = data.length;

                var html = '<p data-userid="0">';
                html += '<a href="javascript:void(0)" onclick="showTo(\'所有人\')">';
                html += '所有人';
                html += '</a>';
                html += '</p>';

                $('#userList ul').html(html);

                for (var i = 0; i < len; i++) {
                    var currTime = parseInt(new Date().getTime() / 1000);
                    var lastTime = data[i].lastaction;

                    var time = currTime - lastTime;

                    var html = '<p data-userid="' + data[i].userid + '">';
                    html += '<a href="javascript:void(0)" onclick="showTo(\'' + data[i].username + '\')">';
                    html += data[i].username;
                    html += '</a>';
                    html += '</p>';

                    $('#userList ul').append(html);
                }

                var timer = setInterval(function () {
                    if (userId) {
                        $('p[data-userid=' + userId + '] img').remove();
                        $('p[data-userid=' + userId + '] .glyphicon').remove();
                        $('p[data-userid=' + userId + '] a').before('<img src="imgs/me.png" height="26" />');
                        $('p[data-userid=' + userId + ']').append('<a href="javascript:void(0)" class="glyphicon glyphicon-refresh" onclick="changeUserName()"></a>');
                        clearInterval(timer);
                    }
                }, 100);
            }
        });
    });

    $('#say').on('keydown', function (e) {
        if (e.keyCode == 13) {
            $('#btnSendMsg').click();
        }
    });

    $('#to').text(toUser);
});

function changeUserName() {
    socket.emit('change_user_name', {
        id: userId,
        username: user
    });
}

function sendMsg() {
    if ($.trim(user) == '') {
        alert('请刷新页面，输入正确用户名。');
        return false;
    }
    var oTo = $('#to');
    var oMsg = $('#say');
    var to = toUser;
    var msg = oMsg.val();

    oTo.text(to);

    if (msg == '') {
        alert('is empty!');
        return false;
    }

    if ($.trim(to) == '' || $.trim(to) == '所有人') {
        to = 'all';
    }

    socket.emit('server', {
        from: user,
        to: to,
        msg: msg
    });

    oMsg.val('');
    oMsg.focus();
}

function showTo(userName) {
    toUser = userName;
    $('#to').text(toUser);
}

window.onbeforeunload = function () {
    socket.emit('logon', {
        id: userId,
        username: user
    });
}

setInterval(function () {
    $('#say').val('现在时间是：' + new Date());
    sendMsg();
}, 12000);
