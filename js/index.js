/**
 * Created by limeng on 15-8-6.
 */

var socket = '';
var msg = '';
var userId = '';
var user = '';

$(function () {
    $('#say').focus();

    socket = io.connect('http://localhost:3000');

    socket.emit('login', '');

    socket.on('user_info', function (data) {
        console.log(data);

        userId = data.userid;
        document.cookie = 'userid=' + userId;
        user = data.username;

        $('#userName').text(user);
    });

    socket.on('connect', function () {
        socket.on('client', function (data) {
            console.log(data);

            if (!data.from || !data.to || !data.msg) {
                return false;
            }

            var obj = document.getElementById('msgList');
            var $obj = $(obj);

            var msgs = '<a href="javascript:void(0)" class="btn-link">' + data.from + '</a>';
            msgs += '对<a href="javascript:void(0)" class="btn-link">' + data.to + '</a>';
            msgs += '说：' + data.msg;
            $obj.append('<p>' + msgs + '</p>');

            var scrollH = $obj[0].scrollHeight;
            $obj.scrollTop(scrollH);
        });

        socket.on('client_user_list', function (data) {
            console.log(data);

            if (!data == '') {
                var len = data.length;

                $('#userList ul').html('');

                for (var i = 0; i < len; i++) {
                    var currTime = parseInt(new Date().getTime() / 1000);
                    var lastTime = data[i].lastaction;

                    var time = currTime - lastTime;

                    var html = '<p data-userid="' + data[i].userid + '">';
                    html += '<a href="javascript:void(0)" onclick="showTo(\''+data[i].username+'\')">';
                    html += data[i].username;
                    html += '</a>';
                    html += '</p>';

                    $('#userList ul').append(html);
                }

                var timer = setInterval(function () {
                    if (userId) {
                        $('p[data-userid=' + userId + '] a').before('<img src="imgs/me.png" height="26" />');
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
    var oTo = document.getElementById('to');
    var oMsg = document.getElementById('say');
    var to = oTo.value;
    var msg = oMsg.value;

    if (msg == '') {
        alert('is empty!');
        return false;
    }

    if ($.trim(to) == '') {
        to = '大家';
    }

    socket.emit('server', {
        from: user,
        to: to,
        msg: msg
    });

    oMsg.value = '';
    $(oMsg).focus();
}

function showTo(userName){
    $('#to').val(userName);
}

window.onbeforeunload = function () {
    socket.emit('logon', {
        id: userId,
        username: user
    });
}
