# the_chat_room

用nodejs开发的聊天室程序

暂时需要socket.io、node-static模块，可以到[npmjs](http://www.npmjs.org)里找到并安装。

socket.io是实现数据即时传送的。

node-static是来实现返回静态页面的。由于没用expressjs所以，用了这个模块。

说明一下各个文件的功能：

-_user_list.plugs.js

>这个文件是进行读写操作的，一开始想用文件存储登录用户信息，但是在测试的过程中发现，由于文件操作用的是异步的，当用户加入进来时不能获取到最新的用户数据，所以放弃了，使用json对象来进行用户存储，这是暂时方案，以后会数据库。

-app.n.js

>这是程序的主入口，不多说了。

-index.html

>这是程序的页面，不多说了。

-user_list.plug.js

>这是用json来实现用户存储的模块。

###服务监听(客户端)：

***user_info***
>当前登录用户信息服务，由于没有登录系统，用户名与ID都是由后台生成的，后台生成后给前台，通过此服务。

格式：

```
{
    userid: userId,
    username: userName
}
```

***system_msg***
>系统级消息服务，处理系统发出的消息。

格式：
>其中的type见代码后说明

```
{
    'type':'login',
    'who':userName,
    'msg':message,
    'timestamp':timeStamp
}
```

>type说明：login-登录；logon-退出；warning-警告；info-消息；error-错误；

***client***
>用户级消息服务，处理用户间发送的消息。

格式：

```
{
    from:'userName',
    to:'userName',
    msg:'message',
    imgUrl:'image url'
}
```

***client_user_list***
>客户端用户列表服务，处理当前聊天室中所有用户列表。

格式：

```
[
    {
        id:id,
        username:userName,
        lastaction:lastAction
    },
    ...
]
```

###服务监听(服务端)：
***login***
>用户登录服务，随机生成用户信息

格式：

暂时没有格式。设想将用户信息以cookie的形式保存在用户本地，不至于每次刷新浏览器的时候会生成新的用户名。

***logon***
>退出聊天室

格式：

```
[
    {
        id:id
    }
]
```

***change_user_name***
>刷新用户名

格式：

```
[
    {
        id:id，
        username:userName
    }
]
```

***server***
>监听从客户端传来的消息

格式：

```
[
    {
        from:'userName',
        to:'userName',
        msg:'message',
        imgUrl:'image url'
    }
]
```

足以看出我的设想了，但是没有做到。

现在的应用与设想的应用差距：

1、不能发送表情
2、没有私聊
3、不能保存信息，至少用户刚刚进入聊天室时可以看到几条聊天记录。

由于想兼容移动浏览器，所以暂时没有了想法，等有了好的想法再继续下去。

timestamp:2015-08-18