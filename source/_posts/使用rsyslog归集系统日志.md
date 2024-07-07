---
title: 使用Rsyslog归集系统日志
categories:
  - 开发者笔记
tags:
  - Linux
abbrlink: 1836dc99
date: 2023-08-25 02:33:57
---
<meta name="referrer" content="no-referrer" />

因为项目需要对私有云服务器的日志进行归集，以方便后续对日志进行分析处理。结合项目的实际需求研究了一下Rsyslog的基本使用并进行了有效性的验证，在此对实现过程进行一个记录

<!--more-->

## Rsyslog是什么？

> Rsyslog是一个极快日志处理系统，能够接受来自各种来源的输入，对其进行转换，并将结果输出到不同的目的地。

## 测试环境说明

操作系统：`统信UOS20企业版`

测试服务器IP：`172.25.16.29`

测试客户端IP：`172.25.16.34`

## 服务端配置

> 启动UDP传输并进行端口监听

修改 `/etc/rsyslog.conf`文件，如果没有则添加如下内容

![image-20230825160221797](http://qiniu-image.gotojava.cn/blog/2023-12-15-191033.png)

```
$ModLoad imudp
$UDPServerRun 514
```

> 创建default.conf配置文件

在 `/etc/rsyslog.d/`目录下创建 `default.conf`文件，并加入如下内容：

```shell
# Use default timestamp format  # 使用自定义的格式
$ActionFileDefaultTemplate RSYSLOG_TraditionalFileFormat
# 定义日志模板，日志显示格式如下：
# %$now%：当前日期，格式：2023-08-23，
# %timestamp:8:15%：当前时间戳：时:分:秒，
# %hostname%：主机名
# %FROMHOST-IP%：客户端IP
# %syslogfacility-text%：客户端日志类型
#    auth         #pam产生的日志，认证日志
#    authpriv     #ssh,ftp等登录信息的验证信息，认证授权认证
#    cron         #时间任务相关
#    kern         #内核
#    lpr          #打印
#    mail         #邮件
#    mark(syslog) #rsyslog服务内部的信息,时间标识
#    news         #新闻组
#    user         #用户程序产生的相关信息
#    uucp         #unix to unix copy, unix主机之间相关的通讯
#    local 1~7    #自定义的日志设备
# %syslogseverity-text%：客户端日志级别
#    debug           #有调式信息的，日志信息最多
#    info            #一般信息的日志，最常用
#    notice          #最具有重要性的普通条件的信息
#    warning, warn   #警告级别
#    err, error      #错误级别，阻止某个功能或者模块不能正常工作的信息
#    crit            #严重级别，阻止整个系统或者整个软件不能正常工作的信息
#    alert           #需要立刻修改的信息
#    emerg, panic    #内核崩溃等严重信息
# %app-name%：客户端执行的程序名
# %msg%：消息体
$template myFormat,"%$now% %timestamp:8:15% | %hostname%@%FROMHOST-IP% | %syslogfacility-text% | %syslogseverity-text% | %app-name% | %msg%\n"
$ActionFileDefaultTemplate myFormat   
# 根据客户端的IP单独存放主机日志在不同目录，/data/rsyslog-bak需要手动创建
$template RemoteLogs,"/data/rsyslog-bak/%fromhost-ip%/%fromhost-ip%_%$YEAR%-%$MONTH%-%$DAY%.log"
# 排除本地主机IP日志记录，只记录远程主机日志
:fromhost-ip, !isequal, "127.0.0.1" ?RemoteLogs
# 忽略之前所有的日志，远程主机日志记录完之后不再继续往下记录
& ~
```

> 重启服务端rsyslog服务

```
systemctl restart rsyslog
```

## 客户端配置

修改 `/etc/rsyslog.conf`配置文件

```shell
# 若启用UDP进行传输，则取消下面两行的注释，如果没有则添加到modules下
module(load="imudp")
input(type="imudp" port="514")

或加入如下内容
$ModLoad imudp
$UDPServerRun 514

#使用UDP传输所有日志到日志服务器（在末尾添加如下内容）
*.*    @172.25.16.29
```

> 重启服务端rsyslog服务

```
systemctl restart rsyslog
```

## 测试

> 日期生成

![image-20230825210852478](http://qiniu-image.gotojava.cn/blog/2023-12-15-191035.png)

![image-20230825160343801](http://qiniu-image.gotojava.cn/blog/2023-12-15-191037.png)

> 客户端生成日志

```shell
logger "rsyslog test"
```

![image-20230825161141448](http://qiniu-image.gotojava.cn/blog/2023-12-15-191040.png)

> 服务端监控输出

```shell
tail -20f /rsyslog-bak/172.25.16.34/172.25.16.34_2023-08-25.log
```

![image-20230825161233634](http://qiniu-image.gotojava.cn/blog/2023-12-15-191042.png)
