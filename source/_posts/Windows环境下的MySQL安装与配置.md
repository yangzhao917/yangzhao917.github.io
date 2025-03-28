---
title: Windows环境下的MySQL安装与配置
categories:
  - 开发者笔记
tags:
  - MySQL
abbrlink: 8df25a04
date: 2023-07-27 21:35:31
toc: true
---
<meta name="referrer" content="no-referrer" />

💡MySQL 是最流行的开源 SQL 数据库管理系统，由 Oracle 公司开发、分发和支持。本文将记录在Window7环境下安装MySQL的过程，用于快速查阅、验证和备忘。

<!--more-->

## 获取

本文使用的版本是 `MySQL 5.7.43`，可通过🔗[官网](https://downloads.mysql.com/archives/installer/)获取最新版本，也可以直接通过我的网盘获取。

🔗[ICloud的网盘](https://www.icloud.com.cn/iclouddrive/0fdMqhG1ZbQzXTa-xT6Gq4jyQ#MySQL)：

- 基于32位的 `mysql-installer-community-5.7.42.0`安装版
- 基于64位的 `mysql-5.7.43-winx64`
- RPM版本的 `mysql-5.7.41-1.el7.x86_64.rpm-bundle.tar`

## Windows的安装

> Windows环境：Windows7旗舰版Service Pack 1

- 将MySQL放到安装目录中

此系统为了我的虚拟机，只有一个盘符 `C:`，所以我会放到 `C:\Program Files`目录下。对于MySQL的图形化 `.msi`的安装版本，会默认将安装到 `C:\Program Files\MySQL`目录下。

### 设置环境变量

- 添加系统环境变量 `MYSQL57_HOME`

![image-20230727220925088](http://qiniu-image.gotojava.cn/blog/2023-12-15-191133.png)

> 变量名：MYSQL57_HOME
>
> 变量值：C:\Program Files\mysql-5.7.43-winx64

- 修改系统环境变量 `Path`

![image-20230727221424288](http://qiniu-image.gotojava.cn/blog/2023-12-15-191134.png)

修改Path系统变量，在末尾添加 `;%MYSQL57_HOME%\bin;`

> %环境变量名%表示引用一个已定义的环境变量
>
> “;”号表示分割符，用于分隔上一个环境变量的值

- 测试环境变量

![image-20230727222026852](http://qiniu-image.gotojava.cn/blog/2023-12-15-191135.png)

看到这个说明环境变量配置成功

### 创建配置文件

在MySQL安装目录创建MySQL配置文件 `my.ini`

```
[mysql]

# 设置mysql客户端默认字符集
default-character-set=utf8

[mysqld]
# 设置3306端口
port=3306

# 设置mysql的安装目录
basedir=C:\\Program Files\mysql-5.7.43-winx64

# 设置mysql数据库的数据的存放目录
datadir=C:\\Program Files\mysql-5.7.43-winx64\data

# 允许最大连接数
max_connections=200

# 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8

# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
```

从 MySQL 5.7.6 开始，ZIP存档的MySQL不再包含 `data`目录，这个目录需要我们自己创建和通过MySQL初始化。

如果您想在不同位置使用数据目录，则应将该 `data`目录的全部内容复制到新位置。例如，如果您想用作 `E:\mydata`数据目录，则必须做两件事：

1. 将整个 `data`目录及其所有内容从默认位置（例如 `C:\Program Files\MySQL\MySQL Server 5.7\data`）移动到 `E:\mydata`；
2. 每次启动服务器时，使用[`--datadir`](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_datadir)选项指定新的数据目录位置。

### 初始化和安装

❗以下命令都需要cmd以**管理员身份运行**

1. 初始化数据库

```
# 初始化时生成随机密码，且密码将被标记为已过期，在首次登陆后需要进行密码的修改
C:\Program Files\mysql-5.7.43-winx64\bin>mysqld --initialize

# 初始化时不会生成随机密码，在第一次登陆时使用回车确认即可
C:\Program Files\mysql-5.7.43-winx64\bin>mysqld --initialize-insecure
```

2. 启动服务器/停止服务器

- 启动服务器

> C:\Program Files\mysql-5.7.43-winx64\bin>mysqld --console
>
> 或 mysqld，因为已经配置了环境变量所以这里可以简写为mysqld

![image-20230727230811586](http://qiniu-image.gotojava.cn/blog/2023-12-15-191136.png)

如果省略该[`--console`](https://dev.mysql.com/doc/refman/5.7/en/server-options.html#option_mysqld_console)选项，服务器会将诊断输出写入数据目录中的错误日志（`C:\Program Files\MySQL\MySQL Server 5.7\data`默认情况下）。错误日志是带有扩展名的文件 `.err`，可以使用[`--log-error`](https://dev.mysql.com/doc/refman/5.7/en/server-options.html#option_mysqld_log-error) 选项进行设置。

3. 安装为服务

- 类型为自动启动，服务名默认MySQL(推荐)

```
C:\Program Files\mysql-5.7.43-winx64>mysqld --install
Service successfully installed.
```

- 类型为手动启动，服务名为MySQLServer57

```
C:\Program Files\mysql-5.7.43-winx64>mysqld --install-manual MySQLServer57
```

4. 启动服务

```
C:\Program Files\mysql-5.7.43-winx64>sc start mysql

SERVICE_NAME: mysql
        TYPE               : 10  WIN32_OWN_PROCESS
        STATE              : 2  START_PENDING
                                (NOT_STOPPABLE, NOT_PAUSABLE, IGNORES_SHUTDOWN)
        WIN32_EXIT_CODE    : 0  (0x0)
        SERVICE_EXIT_CODE  : 0  (0x0)
        CHECKPOINT         : 0x1
        WAIT_HINT          : 0x1f40
        PID                : 2192
        FLAGS              :
```

查看服务状态

```
C:\Program Files\mysql-5.7.43-winx64>sc query mysql

SERVICE_NAME: mysql
        TYPE               : 10  WIN32_OWN_PROCESS
        STATE              : 1  STOPPED
        WIN32_EXIT_CODE    : 1077  (0x435)
        SERVICE_EXIT_CODE  : 0  (0x0)
        CHECKPOINT         : 0x0
        WAIT_HINT          : 0x0
```

### 安装后配置

在进行MySQL的初始化操作后，会在MySQL的配置的 `datadir`目录下生成一个以 `主机名.err`的日志文件，在日志文件中查找 `password`关键字来获取MySQL的初始密码。

![image-20230728005557780](http://qiniu-image.gotojava.cn/blog/2023-12-15-191137.png)

```
C:\Windows\system32>mysql -u root -p
Enter password: ************
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.43

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

可通过mysql本地客户端工具连接mysql后，修改初始密码。

#### 修改root密码

```
mysql> alter user root@localhost identified by '123456';
Query OK, 0 rows affected (0.00 sec)
```

#### 允许远程访问

用户默认会有登陆的授权访问限制，只有允许的IP才能访问。所以可以通过修改用户的host字段来修改IP访问限制。

```
# 打开mysql数据库
mysql> use mysql;
Database changed
mysql> update user set host='%' where user = 'root';
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

# 刷新权限表
mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```

### 番外篇

#### 卸载MySQL

1. 停止MySQL

```
C:\Program Files\mysql-5.7.43-winx64>mysqladmin shutdown
```

2. 停止服务

> 可先通过sc query mysql来查询服务状态

```
C:\Program Files\mysql-5.7.43-winx64>sc stop mysql

SERVICE_NAME: mysql
        TYPE               : 10  WIN32_OWN_PROCESS
        STATE              : 3  STOP_PENDING
                                (STOPPABLE, PAUSABLE, ACCEPTS_SHUTDOWN)
        WIN32_EXIT_CODE    : 0  (0x0)
        SERVICE_EXIT_CODE  : 0  (0x0)
        CHECKPOINT         : 0x1
        WAIT_HINT          : 0x5265c00
```

3. 删除服务

```
C:\Program Files\mysql-5.7.43-winx64>sc delete mysql
[SC] DeleteService 成功
```

4. 删除MySQL相关目录文件及环境变量等信息

本文中MySQL安装在C:\Program Files\mysql-5.7.43-winx64目录下，那么在做完上述操作后，我只需要将 `mysql-5.7.43-winx64`目录删除即可。然后再到系统环境变量中删除MySQL的相关环境变量就行。

#### 常用命令

| 命令            | 描述         |
| :-------------- | :----------- |
| sc query mysql  | 查看服务状态 |
| sc delete mysql | 删除服务     |
| sc stop mysql   | 停止服务     |
| sc start mysql  | 启动服务     |

## 总结

MySQL是一个跨平台的关系型数据库，以上记录了Windows7下的安装方式，对于Windows10、WindowsServer、CentOS和其他Linux操作系统来说，方法和思路都是类似的。在具体的操作上会略有不同。

## 参考

- [在 Microsoft Windows 上安装 MySQL](https://dev.mysql.com/doc/refman/5.7/en/windows-installation.html)
