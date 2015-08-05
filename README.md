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
