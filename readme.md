# 一个基于python aiohttp的博客网站
---
- [网站链接](http://47.106.180.217/user/home)
- 网站代码层次：
  - ORM层：操作数据库，实现数据库表、基本操作和python对象及其方法之间的转换。
  - Model 层：Python 类：User,Blog,Comment,及其相关方法
  - app 层： 编写后端handlers, 即处理前端各种请求并作出响应的函数,绑定到app上
  - 前端页面 层： 前端的用于交互的javascript代码
 ---
 **项目目录结构**
 ## webapp
 - webapp
    - www
      - static   `存放静态文件`
      - templates ## `存放模板文件`
        - html
        - css
        - js
      - app.py 
        > 创建app进程，编写处理请求的handlers并绑定，让进程一直运行
      - models.py
        > User,Blog,Comment类，每个类下有其常用的函数
      - orm.py
        > 先编写数据库基本操作函数：select(sql), execute(sql)
          再编写元类Model类即，Models中三个类的基类，Model类下有通用的常用操作函数：find,delete,update,save等
      - framework.py
        > 该模块用于帮助handler编写，简化handler编写的过程，提高速度和效率。
          提供了两种响应的封装：jsonResponse,apiError
      - tool.py
      - config.py
        > 用于配置：数据库信息，模板文件位置信息，网站目录信息等
