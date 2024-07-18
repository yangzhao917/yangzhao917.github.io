---
title: Redis7的主从复制
categories: ['开发者笔记']
tags: ['Redis7']
date: 2024-05-31 02:45:39
---
<meta name="referrer" content="no-referrer" />

<!--more-->

## 主从复制是什么

主从复制是将一台Redis服务器的数据，复制到其他的Redis服务器。前者称为主节点（Master），后者称为从节点（Slave）。数据的复制是单向的，只能由主节点到从节点。主（Master）Redis的服务器作为写服务，从（Slave）服务器作为读服务，当Master服务器的数据发生变化时，自动将新的数据异步同步到其他Slave数据库。

![db-redis-copy-1](https://qiniu-image.gotojava.cn/blog/202406020402800.png)

## 作用

* 读写分离

读写分离是指将读操作和写操作分别分配到不同的Redis服务实例上进行处理，从而提高服务器的性能、减轻单台实例的访问压力。

* 容灾备份

主（Master）Redis服务器上的数据，从（Slave）Redis服务器上都有，当主节点故障时，从节点依旧可以正常提供服务，从而避免单台服务器的故障和数据安全的问题。

* 水平扩容支撑高并发

当单台主、从节点的服务器压力过大时，可以通过扩充服务器节点来增加主、从节点的服务器数量，从而缓解服务器压力。

## 主从复制

### 架构说明

为了方便测试和验证，我用虚拟机开了三台服务器，模拟一主二从的架构配置。主、从之间可以相互通信、正常ping通、防火墙关闭。

```tex
主节点：Master，端口号6379，IP：10.211.55.37
从节点1：Slave，端口号6380，IP：10.211.55.38
从节点2：Slave，端口号6381，IP：10.211.55.39
```

![image-20240601040457616](https://qiniu-image.gotojava.cn/blog/image-20240601040457616.png)

### 主节点配置

针对redis配置文件进行修改，文件名为：redis-6379.conf，该文件名复制原有的redis.conf文件，原有文件保持不变。

- 开启后台运行

```bash
daemonize yes
```

- 注释掉绑定IP

```bash
# bind 127.0.0.1 -::1
```

- 关闭保护模式，允许远程访问

```bash
protected-mode no
```

- 指定服务端口 

```bash
port 6379
```

- 指定服务工作目录

```bash
# 原有参数为：./
dir /opt/redis-7.0.0/data
```

- 指定PID进程名字

```bash
pidfile /var/run/redis_6379.pid
```

- 指定log文件名字

```bash
logfile "/opt/redis-7.0.0/log/redis-6379.log"
```

- 指定服务连接密码

```bash
requirepass 111111
```

- 指定RDB持久化文件名字

```bash
# The filename where to dump the DB
dbfilename dump-6379.rdb
```

- 指定AOF持久化文件名字（非必须）

```bash
# 开启AOF
appendonly yes
# AOF文件保存目录
appenddirname "appendonlydir"
# AOF文件名称
appendfilename "appendonly.aof"
```

### 从节点1配置

针对redis配置文件进行修改，文件名为：redis-6380.conf，该文件名复制原有的redis.conf文件，原有文件保持不变。

- 开启后台运行

```bash
daemonize yes
```

- 注释掉绑定IP

```bash
# bind 127.0.0.1 -::1
```

- 关闭保护模式，允许远程访问

```bash
protected-mode no
```

- 指定服务端口

```bash
port 6380
```

- 指定服务工作目录

```bash
# 原有参数为：./
dir /opt/redis-7.0.0/data
```

- 指定PID进程名字

```bash
pidfile /var/run/redis_6380.pid
```

- 指定log文件名字

```bash
logfile "/opt/redis-7.0.0/log/redis-6380.log"
```

- 指定服务连接密码

```bash
requirepass 111111
```

- 指定RDB持久化文件名字

```bash
# The filename where to dump the DB
dbfilename dump-6380.rdb
```

- 指定AOF持久化文件名字（非必须）

```bash
# 开启AOF
appendonly yes
# AOF文件保存目录
appenddirname "appendonlydir"
# AOF文件名称
appendfilename "appendonly.aof"
```

- 指定主服务器信息

```bash
# 指定主节点的IP和端口
replicaof 10.211.55.37 6379
# 指定主节点的密码
masterauth 111111
```

### 从节点2配置

针对redis配置文件进行修改，文件名为：redis-6381.conf，该文件名复制原有的redis.conf文件，原有文件保持不变。

- 开启后台运行

```bash
daemonize yes
```

- 注释掉绑定IP

```bash
# bind 127.0.0.1 -::1
```

- 关闭保护模式，允许远程访问

```bash
protected-mode no
```

- 指定服务端口

```bash
port 6381
```

- 指定服务工作目录

```bash
# 原有参数为：./
dir /opt/redis-7.0.0/data
```

- 指定PID进程名字

```bash
pidfile /var/run/redis_6381.pid
```

- 指定log文件名字

```bash
logfile "/opt/redis-7.0.0/log/redis-6381.log"
```

- 指定服务连接密码

```bash
requirepass 111111
```

- 指定RDB持久化文件名字

```bash
# The filename where to dump the DB
dbfilename dump-6381.rdb
```

- 指定AOF持久化文件名字（非必须）

```bash
# 开启AOF
appendonly yes
# AOF文件保存目录
appenddirname "appendonlydir"
# AOF文件名称
appendfilename "appendonly.aof"
```

- 指定主服务器信息

```bash
# 指定主节点的IP和端口
replicaof 10.211.55.37 6379
# 指定主节点的密码
masterauth 111111
```

⚠️注意：对于在从节点上指定主节点信息也可以使用`<u>`replicaof 主节点IP 主节点端口`</u>`来实现，但这种方式在Redis服务重启后会自动失效。

### 服务启动顺序

- 先启动Master，再依次启动Slave。

```bash
# 启动Master
[root@centos-7 redis-7.0.0]# redis-server /opt/redis-7.0.0/conf/redis-6379.conf 
[root@centos-7 redis-7.0.0]# ps -ef | grep redis | grep -v grep
root     21039     1  0 05:22 ?        00:00:00 redis-server *:6379
# 启动Slave1
[root@CentOS7_2 conf]# redis-server /opt/redis-7.0.0/conf/redis-6380.conf
[root@CentOS7_2 conf]# ps -ef | grep redis | grep -v grep
root     20473     1  0 05:23 ?        00:00:00 redis-server *:6380
# 启动Slave2
[root@CentOS7_3 conf]# redis-server /opt/redis-7.0.0/conf/redis-6381.conf 
[root@CentOS7_3 conf]# ps -ef | grep redis | grep -v grep
root     20886     1  0 05:25 ?        00:00:00 redis-server *:6381
```

- 查看Master日志

![image-20240601053212558](https://qiniu-image.gotojava.cn/blog/image-20240601053212558.png)

- 查看Slave1从机日志

![image-20240601053457482](https://qiniu-image.gotojava.cn/blog/image-20240601053457482.png)

- 查看Slave2从机日志

![image-20240601053555808](https://qiniu-image.gotojava.cn/blog/image-20240601053555808.png)

### 查看主从关系

```bash
info replication
```

- Master节点

```bash
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:2
slave0:ip=10.211.55.39,port=6381,state=online,offset=14100,lag=1
slave1:ip=10.211.55.38,port=6380,state=online,offset=14100,lag=0
master_failover_state:no-failover
master_replid:c1aacbe52fa4d2c420efb86536953b2905cc323c
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:14100
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:14100
```

- Slave节点

```bash
127.0.0.1:6380> info replication
# Replication
role:slave
master_host:10.211.55.37
master_port:6379
master_link_status:up
master_last_io_seconds_ago:2
master_sync_in_progress:0
slave_read_repl_offset:14044
slave_repl_offset:14044
slave_priority:100
slave_read_only:1
replica_announced:1
connected_slaves:0
master_failover_state:no-failover
master_replid:c1aacbe52fa4d2c420efb86536953b2905cc323c
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:14044
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:14044
```

### 临时指定主节点

⚠️：通过slaveof命令在从节点上配置的主节点信息，会在节点重启后自动失效。

```bash
# 指定主节点信息
SLAVEOF 主节点IP 主节点端口
# 查看主从关系
info replication
```

需要注意的是，如果指定的节点结构是链式的，那么只有主节点Master才可以写数据，其他节点只能读数据，该方式只能改变数据同步的方向，但这种方式可以缓解Master的连接压力，避免因为网络问题导致的数据同步的延时问题。如果想使某台Redis数据库停止与其他数据库服务的同步可以使用`<u>`SLAVEOF no one`</u>`来实现，使用`<u>`SLAVEOF no one`</u>`停止同步后不会删除已有的数据，只是不再接受主节点新的数据变化。

![image-20240602032415214](https://qiniu-image.gotojava.cn/blog/202406020324387.png)

### 主从复制存在的问题

1. 从机可以执行写命令吗？

主从复制的环境下，只有主节点可以进行写操作，从节点只能进行读操作，如果从节点进行写操作，会报错：

![image-20240601054540689](https://qiniu-image.gotojava.cn/blog/image-20240601054540689.png)

2. Slave节点是从开始复制还是从加到主从节点时才开始复制？

主从复制的情况下Slave节点是从头开始复制，如果主节点在从节点加入后有写入操作，从节点也会自动同步。

3. 主节点宕机后，从节点会不会变为主节点？

不会，主节点宕机后，从节点不会升级为主节点，从机的数据可以正常提供查询服务，等待主节点重启。

4. 主节点宕机后，重启后主从关系是否存在，从机还能否顺利复制？

主节点宕机后，不会影响主从关系，主节点恢复后，依然可以正常数据同步。

## 实现原理

![1717273886518](https://qiniu-image.gotojava.cn/blog/202406020436829.jpeg)

## 主从复制的缺点

- 主从数据不一致的问题

所有的操作都是通过Master写入的，然后异步同步到Slave节点上，所以Master同步到Slave节点上时可能会因网络问题存在一定的延时，导致主从数据不一致的问题。当Master的负载压力比较大或者指向Master的Slave节点过多时，延迟问题也会更加严重。

- Master节点故障问题

如果Master节点因故障宕机，默认情况下不会自动重选Master，会导致无法写操作无法继续。

## 参考

- https://www.cnblogs.com/kismetv/p/9236731.html
- https://pdai.tech/md/db/nosql-redis/db-redis-x-copy.html
