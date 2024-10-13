---
uuid: 8b7a7275-1adc-6ac4-c744-ca0b584d5dee
title: Redis7的单实例安装与基本配置
categories:
  - 开发者笔记
tags:
  - Redis7
abbrlink: 242fe420
date: 2024-06-05 19:31:21
---

<meta name="referrer" content="no-referrer" />

<!--more-->

## Redis是什么

Redis的全称是 <u>Remote Dictionary Server</u> 是一个开源的基于内存的高性能键值对（Key - Value）存储系统。可以用作数据库、缓存和消息代理。

## 为什么需要

- 作为缓存使用

Redis 是基于内存做数据存储的，对于关系型数据库来说数据是保存在硬盘上，在读取方面Redis会更快，适合作为缓存使用。所以对于需要频繁查询的操作可以将数据存入Redis中，这样可以极大的减轻数据库服务的压力，提高系统的性能。

![image-20240603032509698](https://qiniu-image.gotojava.cn/blog/202406030325885.png)

- 完成一些特定场景的功能

基于Redis一些数据结构的特性，完成一些类似于排行榜、用户点赞数、访问数、限流、Session会话共享、共同的社交关系、简单消息队列、分布式锁等等，这些功能虽然关系型数据库也能做，但是频繁的访问和修改操作会增加数据库访问压力，但对于Redis来说就非常适合、实现也更方便。

### 注意

> ⚠️注意：需要注意的是，Redis虽然性能很好，但也不是万能的，对于频繁访问的数据，Redis的缓存功能可以极大的减轻数据库的压力。但对于存储一些访问不太频繁的数据，虽然也不是不可以，但是会导致内存资源的浪费。

> Redis 不适合作为业务数据库使用，虽然 Redis 自身也有一些持久化的机制能将数据保存到硬盘，但是无法保证数据的可靠型，所以不要将 Redis 作为业务数据库使用，避免业务数据的丢失。

## 安装

### 说明

- 本次所有的测试验证都是使用[Redis 7.0.0](https://github.com/redis/redis/releases/tag/7.0.0)来进行。获取和相关的变更信息可以通过 [GitHub](https://github.com/redis/redis/releases) 获取。
- 操作系统使用<u>CentOS 7</u>，使用 Parallels Desktop 来模拟主从复制、哨兵、和集群的验证。

- Redis 可视化客户端可以使用 AnotherRedisDesktopManager，通过 [GitHub](https://github.com/qishibo/AnotherRedisDesktopManager/releases) 获取。
- 版本号：Redis 使用标准的做法进行版本管理: <u>主版本号.副版本号.补丁号</u>。 偶数 <u>副版本号</u> 表示一个 <u>稳定的</u> 发布，像 1.2, 2.0, 2.2, 2.4, 2.6, 2.8。奇数副版本号表示 <u>不稳定的</u> 发布，例如 2.9.x 发布是一个不稳定版本，下一个稳定版本将会是Redis 3.0。
- CentOS 7保证可以正常访问网络，修改 [yum 源为阿里云源](https://blog.csdn.net/weixin_38924500/article/details/109555882)、安装 [GCC、GCC-C++](https://gotojava.cn/article/aba7d07)，以方便 Redis 的安装部署。

### 安装

> 生产环境的建议安装方式，使安装符合 Linux 文件系统的规范

- 获取7.0.0安装包

```bash
# /usr/local/src 可以用来放自己安装的第三方源码文件
wget -P /usr/local/src/ https://download.redis.io/releases/redis-7.0.0.tar.gz
```

- 解压

```bash
cd /usr/local/src/
tar -zxf redis-7.0.0.tar.gz
```

- 安装

```bash
cd /usr/local/src/redis-7.0.0/
make && make install
```

- /usr/local/bin下的Redis工具

![Redis 工具说明](https://qiniu-image.gotojava.cn/blog/202406030459591.png)

- 创建redis的配置和数据放置目录

```bash
# 配置文件目录
mkdir -p /etc/redis/

# 数据文件目录
mkdir -p /var/lib/redis/6379

# 日志文件目录
mkdir -p /var/log/redis
```

- 必要配置

> 拷贝原始配置文件到配置文件目录中

```bash
cp /usr/local/src/redis-7.0.0/redis.conf /etc/redis/6379.conf
```

> 修改6379.conf配置文件

```bash
daemonize yes #允许Redis在后台运行，默认为no
protected-mode no #关闭保护模式，允许远程客户端连接，默认为yes
bind 127.0.0.1 ::1 #默认只允许本地机器连接，注释掉该行或者改成机器IP，否则影响远程机器连接
requirepass 111111 #设置Redis连接密码，远程客户端连接需要
dir /var/lib/redis/6379 # 设置Redis数据文件目录，用于存放持久化文件RDB和AOF文件，默认为配置文件的所在目录（即安装目录）
loglevel notice # 设置日志级别（根据需要设置，默认:notice）
logfile "/var/log/redis/6379.log" # 设置日志文件位置
port 6379 # 设置Redis运行端口，默认：6379
save 3600 1 300 100 60 10000 # 开启RDB持久化，默认注释掉，需要打开，如果作为缓存使用，可以不开启
```

### 设置服务自启动

#### 修改启动脚本

因为redis脚本中默认是无密码的，但我们设置了Redis的密码，导致通过服务停止的时候，没有权限访问。为了解决这个问题，需要修改启动脚本，以实现我们的需求。

```bash
REDIS_PASS=111111
$CLIEXEC -p $REDISPORT -a $REDIS_PASS shutdown
```

![image-20240605191616643](https://qiniu-image.gotojava.cn/blog/202406051916738.png)

#### 配置服务自启动

```bash
cp /usr/local/src/redis-7.0.0/utils/redis_init_script /etc/init.d/redis_6379
cd /etc/init.d/ && chkconfig --level 35 redis_6379 on
```

![image-20240603061328082](https://qiniu-image.gotojava.cn/blog/202406030613228.png)

### 服务启停

- 启动

```bash
# redis-server 配置文件位置
redis-server /etc/redis/6379.conf
或
service redis_6379 start
```

- 停止

```bash
# redis-cli -a 连接密码 -p 端口号(默认：6379)  shutdown
redis-cli -a 111111 -p 6379 shutdown
或
service redis_6379 stop
```

## 卸载

> 如果需要卸载Redis，可以删除/usr/local/bin目录下与redis相关的文件

```bash
rm -rf /usr/local/bin/redis-*
```

## 参考

- https://www.cnblogs.com/ggjucheng/archive/2012/08/20/2647788.html
- https://redis.com.cn/topics/why-use-redis.html