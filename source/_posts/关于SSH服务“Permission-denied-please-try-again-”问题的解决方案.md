---
title: '关于SSH服务“Permission denied, please try again.”问题的解决方案'
categories:
  - 技术分享
tags:
  - Linux
abbrlink: 9fdf7a25
date: 2023-09-08 22:06:33
---

<meta name="referrer" content="no-referrer" />

通过SSH远程登陆时，告知被禁止登陆。经过排查和查询网络资料。因为这个问题遇到的概率比较低。所以在这里把解决过程记录以下。

<!--more-->

通过SSH终端工具连接时报以下问题：

![image-20230908200743172](https://p.ipic.vip/t3qfun.png)

这里说一下情况，服务器是云主机，托管于私有云供应商。然后通过堡垒机进行统一管理和运维。然后由于前一段时间的等级保护安全测评工作，服务器已经做了安全加固，也对SSH的版本进行了升级，跟远程登陆有关的安全措施如下：

1. 设置口令复杂度；
2. 设置口令重复使用次数限制；
3. 设置密码过期时间
4. 限制本地登陆和远程登陆次数；
5. 禁用root远程SSH登陆；
6. 升级OpenSSH；

本次登陆使用的是普通账号，报的是`userauth failed`。而不是密码错误的信息。

而且云管账户下的机器为统一口令，不会出现个别机器口令不一样的情况，而且这个主机和其他主机安全策略完全一样，其他主机可以正常登陆。

通过其他终端访问该服务器，并通过问题机器的VNC查看SSH日志，情况是这样的

![image-20230908202026877](https://p.ipic.vip/mlyph3.png)

> 通过`tail -100f /var/log/auth.log`查看认证日志

![image-20230908202134973](https://p.ipic.vip/t7b2yy.png)

发现是SSH可以验证成功的，但是客户端的登陆被禁止。

此时问题陷入了僵局。后来在同事的提醒下，通过VNC的终端查看了问题机器的错误登陆次数：

```shell
pam_tally2 --user wsupport
```

![image-20230908202445787](https://p.ipic.vip/acppm9.png)

发现登陆错误次数达到了124次，然后尝试对错误登陆次数进行重置

```shell
pam_tally2 --user wsupport  --reset
```

![image-20230908202644624](https://p.ipic.vip/ypo8gu.png)

重新尝试SSH登陆后，发现可以正常登陆。
