---
title: Linux环境下的MySQL的安装和配置
categories:
  - 技术分享
tags:
  - MySQL
abbrlink: 2306cec7
date: 2023-11-13 13:55:23
---
<meta name="referrer" content="no-referrer" />

本文记录MySQL5.7在CentOS7环境下的安装和配置过程。

<!--more-->

## 新特性

MySQL5.7有以下几个方面的新功能

1. 随机root密码

MySQL5.7数据库初始化完成后，会自动生成一个root@localhost的用户，root用户的密码不为空，而是随机产生一个密码。

2. 默认SSL加密

MySQL5.7采用了更加简单的SSL安全访问机制，默认连接使用SSL的加密方式。

3. 密码过期策略

MySQL5.7支持用户设置密码过期策略，要求用户在一定时间过后必须修改密码。

4. 用户锁

MySQL5.7为管理员提供了暂时禁用某个用户的功能，使被锁定的用户无法访问和使用数据库。

5. 全面支持JSON

随着非结构化数据存储需求的持久增长，各种非结构化数据存储的数据应运而生，各大关系型数据库也不甘示弱，纷纷提供对JSON的支持，以应对非结构化数据库的挑战。

MySQL5.7也提供了对JSON的支持，在服务器端提供了一组便于操作JSON的函数。存储的方法是将JOSN编码成BLOB后再由存储引擎进行处理。这样MySQL就同时拥有了关系型数据库和非关系型数据库的优点，并且可以提供完整的事务支持。

1. 支持两类生成列

生成列是通过数据库中的其他列计算得到的一列。当为生成列创建索引时，可以便捷地加快查询速度。MySQL5.7支持虚拟生成列和存储生成列。虚拟生成列只是将数据保存在表的元数据中，作为缺省的生成列类型；存储生成列则是将数据永久保存在磁盘上，需要更多的磁盘空间。

2. 引入系统库

系统库中包含一系列视图、函数和存储过程，通过多线程、多进程、组合事务提交和基于行的优化方式将复制功能提高5倍以上，用户向外扩充其跨商品系统的工作负载时，得以大幅度提升复制的效能和效率。

## 下载

MySQL的版本分为：

- 企业版

MySQL企业版主要面向企业用户，不遵守社区版本的GPL开源协议。享受Oracle公司的7*24h的电话支持服务以及补丁更新服务（企业为此需要支付费用）。

- 社区版

社区版的维护由MySQL的开源社区提供支持，不能像商业版那样获取Oracle的电话支持和补丁服务。社区版是免费获取。MySQL的社区版可通过官网[MySQL Communify Downloads](https://dev.mysql.com/downloads/mysql/)获取。本文也主要针对该版本进行测试。

## 安装

实验使用环境为：

操作系统（虚拟机环境）：CentOS Linux release 7.5.1804 (Core)

MySQL版本：mysql-5.7.41-1.el7.x86_64

```sql
[root@centos7 ~]# ls
anaconda-ks.cfg  mysql-5.7.41-1.el7.x86_64.rpm-bundle.tar
# 解压归档tar包
[root@centos7 ~]# tar -xf mysql-5.7.41-1.el7.x86_64.rpm-bundle.tar

# 卸载关于mariadb的依赖包文件，一台服务器只能安装一个MySQL/MariaDB软件
[root@centos7 ~]# rpm -qa | grep mariadb
mariadb-libs-5.5.56-2.el7.x86_64
# -e：删除指定的包；--nodeps：在安装时不检查依赖关系
[root@centos7 ~]# rpm -e --nodeps mariadb-libs-5.5.56-2.el7.x86_64

# 服务器和客户端库的通用文件
[root@centos7 ~]# rpm -ivh mysql-community-common-5.7.41-1.el7.x86_64.rpm 
警告：mysql-community-common-5.7.41-1.el7.x86_64.rpm: 头V4 RSA/SHA256 Signature, 密钥 ID 3a79bd29: NOKEY
准备中...                          ################################# [100%]
正在升级/安装...
   1:mysql-community-common-5.7.41-1.e################################# [100%]

# MySQL数据库客户端应用程序的共享库
[root@centos7 ~]# rpm -ivh mysql-community-libs-5.7.41-1.el7.x86_64.rpm 
警告：mysql-community-libs-5.7.41-1.el7.x86_64.rpm: 头V4 RSA/SHA256 Signature, 密钥 ID 3a79bd29: NOKEY
准备中...                          ################################# [100%]
正在升级/安装...
   1:mysql-community-libs-5.7.41-1.el7################################# [100%]

# MySQL客户端应用程序和工具
[root@centos7 ~]# rpm -ivh mysql-community-client-5.7.41-1.el7.x86_64.rpm 
警告：mysql-community-client-5.7.41-1.el7.x86_64.rpm: 头V4 RSA/SHA256 Signature, 密钥 ID 3a79bd29: NOKEY
准备中...                          ################################# [100%]
正在升级/安装...
   1:mysql-community-client-5.7.41-1.e################################# [100%]

# 数据库服务器和相关工具 
[root@centos7 ~]# rpm -ivh mysql-community-server-5.7.41-1.el7.x86_64.rpm 
警告：mysql-community-server-5.7.41-1.el7.x86_64.rpm: 头V4 RSA/SHA256 Signature, 密钥 ID 3a79bd29: NOKEY
准备中...                          ################################# [100%]
正在升级/安装...
   1:mysql-community-server-5.7.41-1.e################################# [100%]

# 启动MySQL服务
[root@centos7 ~]# systemctl start mysqld
# 查看MySQL服务状态
[root@centos7 ~]# systemctl status mysqld
● mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: active (running) since 二 2023-11-07 01:08:56 CST; 2s ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 12837 ExecStart=/usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid $MYSQLD_OPTS (code=exited, status=0/SUCCESS)
  Process: 12722 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 12840 (mysqld)
   CGroup: /system.slice/mysqld.service
           └─12840 /usr/sbin/mysqld --daemonize --pid-file=/var/run/mysqld/mysqld.pid

11月 07 01:08:53 centos7 systemd[1]: Starting MySQL Server...
11月 07 01:08:56 centos7 systemd[1]: Started MySQL Server.
```

## 配置

### 修改MySQL密码

> 获取随机密码登陆

MySQL在安装完成后，会生成一个随机密码，我们通过root用户➕随机密码便可以登陆MySQL服务器。随机密码会生成在 `/var/log/mysqld.log`中。我们可以通过 `tail -100f /var/log/mysqld.log | grep -i "password”`来获取随机密码。

![Untitled](https://p.ipic.vip/8vii5t.png)

> 使用skip_grant_tables跳过密码验证

也可以通过修改MySQL的配置文件my.cnf，通过跳过密码校验，来免登陆MySQL修改密码。通过在/etc/my.cnf配置文件中，添加 `skip_grant_tables`来实现跳过密码校验。

![Untitled](https://p.ipic.vip/glg5tc.png)

修改完成后，需要通过 `systemctl restart mysqld`重启MySQL服务，使配置文件的内容生效。

通过mysql  -u root -p来登陆MySQL服务器，因为我们跳过了密码校验，所以在提示：“Enter password”时，回车即可。像下面这样：

![Untitled](https://p.ipic.vip/ovm29j.png)

<aside>
⚠️ 如果需要恢复密码验证，则移除”`skip_grant_tables`”这行内容，重启MySQL服务就可以了。

</aside>

> 修改root密码

```sql
# 修改当前登陆用户的密码为root
mysql> ALTER USER user() identified by "root";
Query OK, 0 rows affected (0.00 sec)

# 刷新权限
mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```

### 开放远程连接

默认情况下MySQL是不允许本地以外的其他服务器远程访问的，这个时候需要我们进行授权操作。

```sql
# 打开mysql数据库
mysql> use mysql;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A
Database changed
# 修改记录，允许远程访问
mysql> update user set host = '%' where user ='root';
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0
# 刷新权限信息
mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```

```sql
# 开放防火墙3306端口
[root@centos7 ~]# firewall-cmd --zone=public --add-port=3306/tcp --permanent
# 刷新防火墙规则
[root@centos7 ~]# firewall-cmd --reload
# 移除3306端口
[root@centos7 ~]# firewall-cmd --zone=public --remove-port=3306/tcp --permanent
# 查看当前防火墙规则列表
[root@centos7 ~]# firewall-cmd --list-all
```

### 获取服务器状态信息

```sql
mysql> status
--------------
mysql  Ver 14.14 Distrib 5.7.41, for Linux (x86_64) using  EditLine wrapper

Connection id:          12
Current database:       mysql
Current user:           root@localhost
SSL:                    Not in use
Current pager:          stdout
Using outfile:          ''
Using delimiter:        ;
Server version:         5.7.41 MySQL Community Server (GPL)
Protocol version:       10
Connection:             Localhost via UNIX socket
Server characterset:    latin1
Db     characterset:    latin1
Client characterset:    utf8
Conn.  characterset:    utf8
UNIX socket:            /var/lib/mysql/mysql.sock
Uptime:                 33 min 20 sec

Threads: 1  Questions: 116  Slow queries: 0  Opens: 175  Flush tables: 1  Open tables: 168  Queries per second avg: 0.058
--------------
```

### MySQL安装目录说明

| 文件夹             | 文件夹内容                                       |
| ------------------ | ------------------------------------------------ |
| /var/bin           | 客户端和脚本（mysqladmin、mysqldump等命令）      |
| /usr/sbin          | mysqld服务器                                     |
| /var/lib/mysql     | 日志文件、socket文件和数据库                     |
| /usr/share/info    | 信息格式的手册                                   |
| /usr/share/man     | UNIX帮助页                                       |
| /usr/include/mysql | 头文件                                           |
| /usr/lib/mysql     | MySQL的依赖库                                    |
| /usr/share/mysql   | 错误消息、字符集、安装文件和配置文件             |
| /etc/rc.d/init.d/  | 启动脚本文件的mysql目录，用来启动和停止MySQL服务 |

### MySQL数据目录说明

<aside>
⚠️ MySQL数据目录的位置可以通过/etc/my.cnf配置文件中的datadir配置获得。

</aside>

![Untitled](https://p.ipic.vip/ytm1qd.png)

| 文件名称                                                                                           | 作用                                                                                           |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| auto.cnf                                                                                           | MySQL服务器的选项文件，用于存储server-uuid的值，server-uuid用于标识MySQL实例在集群中的唯一性。 |
| ca-key.pem                                                                                         | CA 私钥, 用于生成服务器端/客户端的数字证书                                                     |
| ca.pem                                                                                             | CA 证书, 用于生成服务器端/客户端的数字证书                                                     |
| client-cert.pem                                                                                    | 客户端连接时使用的证书                                                                         |
| client-key.pem                                                                                     | 客户端连接时使用的私钥                                                                         |
| ib_buffer_pool                                                                                     | InnoDB引擎的缓存数据文件，用于存储缓存                                                         |
| ibdata1                                                                                            | 共享表空间（系统表空间），如果使用的是InnoDB引擎，默认大小为10M                                |
| ib_logfile0                                                                                        | 支持事务性引擎的redo日志文件                                                                   |
| ib_logfile1                                                                                        | 支持事务性引擎的redo日志文件                                                                   |
| ibtmp1                                                                                             | 存储临时对象的空间，比如临时表对象等                                                           |
| mysql.sock                                                                                         | Socket连接的文件，用于MySQL客户端和MySQL服务器的本地连接（同一机器）                           |
| mysql.sock.lock                                                                                    | MySQL的一个文件锁，用于控制并发访问数据库的情况                                                |
| private_key.pem                                                                                    | 密钥对的私钥                                                                                   |
| public_key.pem                                                                                     | 密钥对的公钥                                                                                   |
| server-cert.pem                                                                                    | 服务器端的数字证书                                                                             |
| server-key.pem                                                                                     | 服务器端的 RSA 私钥                                                                            |
| mysql、performance_schema、sys                                                                     | 系统的内置数据库：                                                                             |
| information_schema：存储了数据库对象信息，包括用户表信息、列信息、权限信息、字符集信息、分区信息； |                                                                                                |
| mysql：负责存储数据库用户、用户访问权限信息；                                                      |                                                                                                |
| sys：MySQL5.7版本的数据库，提供了一些视图，用于帮助开发者和使用者更方便地查看性能问题。            |                                                                                                |

- test是我们自己创建的测试库，结构如下：

![Untitled](https://p.ipic.vip/6vmgcn.png)

db.opt：用来保存数据库的配置信息，比如该库的默认字符集编码和字符集排序规则。

> InnoDB引擎

*.frm：用来保存每个数据表的元数据和表结构信息，当数据库崩溃时，可以用.frm文件恢复表结构。

*.ibd：用来存储表的数据。

> MyISAM引擎

*.MYD：存储MyISAM表的数据。

*.MYI：存储MyISAM表的索引及相关信息。

<aside>
⚠️ 在MySQL中，一个数据库可以使用多个存储引擎。所以该数据库下可能既存在InnoDB引擎的文件，也存在MyISAM引擎的文件。

</aside>

### MySQL配置文件（my.cnf）

> 服务器端参数“[mysqld]”

| 参数名称                       | 说明                                                                                                                                          |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| port                           | 表示MySQL服务器的端口号                                                                                                                       |
| basedir                        | 表示MySQL的安装路径                                                                                                                           |
| datadir                        | MySQL数据文件的存储位置                                                                                                                       |
| default_character_set          | 服务端默认的字符集                                                                                                                            |
| default_storage_engine         | 创建数据表时，默认使用的存储引擎                                                                                                              |
| sql_mode                       | sql模式的参数，该参数可以检验SQL语句的严格程度。sql_mode的参数参考：http://www.gamecolg.com/program_m_onvideo_m_inkey_m_gta1662479699017.html |
| max_connections                | 允许同时访问服务器的最大连接数                                                                                                                |
| query_cache_size               | 查询时的缓存大小                                                                                                                              |
| table_open_cache               | 表示所有进程打开表的总数                                                                                                                      |
| tmp_table_size                 | 内存中每个临时表允许的最大大小                                                                                                                |
| thread_cache_size              | 缓存的最大线程数                                                                                                                              |
| myisam_max_sort_file_size      | MySQL重建索引时所允许的最大临时文件大小                                                                                                       |
| myisam_sort_buffer_size        | 重建索引时的缓存大小                                                                                                                          |
| key_buffer_size                | 关键词的缓存大小                                                                                                                              |
| read_buffer_size               | MyISAM全表扫描的缓存大小                                                                                                                      |
| read_rnd_buffer_size           | 表示将排序好的数据存入该缓存中                                                                                                                |
| sort_buffer_size               | 表示用于排序的缓存大小                                                                                                                        |
| innodb_log_file_size           | InnoDB日志文件的大小                                                                                                                          |
| innodb_log_buffer_size         | 用于存储日志数据的缓存区大小                                                                                                                  |
| innodb_buffer_pool_size        | 缓存的大小，InnoDB使用一个缓冲池保存索引和原始数据                                                                                            |
| innodb_thread_concurrency      | InnoDB存储引擎允许的线程最大数                                                                                                                |
| innodb_flush_log_at_trx_commit | 提交日志的时机，为1时会在每次提交后将事务日志写入到磁盘上                                                                                     |

## 问题记录

### CentOS7忘记密码怎么办？

[CentOS7如果忘记密码，密码重置详细步骤_centos修改密码忘记密码-CSDN博客](https://blog.csdn.net/qq_45887180/article/details/115819136)

### ERROR 1820（HY000）

错误提示：You must reset your password using ALTER USER statement before executing this statement.

解决方案：[MySQL 报错：ERROR 1820 (HY000): You must reset your password using ALTER USER statement before-CSDN博客](https://blog.csdn.net/Wing_kin666/article/details/110921440)
