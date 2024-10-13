---
uuid: b916a4a6-3bb6-2fd5-e30b-7261da1ea53e
title: UOS升级OpenSSH
categories:
  - 开发者笔记
tags:
  - Linux
abbrlink: 947b9fd7
date: 2023-09-14 14:46:11
---
<meta name="referrer" content="no-referrer" />

因密码测评的整改要求，需要对线上服务器进行OpenSSH的升级，遂在此记录一下升级过程

<!--more-->

服务器使用的是统信的UOS，使用方式和Ubuntu的使用方式很像。

- 操作系统版本

```shell
wsupport@wsupport-PC:~$ lsb_release -a
No LSB modules are available.
Distributor ID:	Uos
Description:	UnionTech OS Server 20 Enterprise
Release:	20
Codename:	fou
```

- 升级前的OpenSSH版本

```shell
wsupport@wsupport-PC:~$ ssh -V
OpenSSH_7.9p1 Debian-10+deb10u1, OpenSSL 1.1.1d  10 Sep 2019
```

## 更新apt源

1. 使用root用户修改 `/etc/apt/sources.list`文件

> vi /etc/apt/sources.list

- 政务网

```shell
deb [by-hash=force] http://172.23.1.32/enterprise-packages.chinauos.com/server-enterprise/  fou/sp3  main contrib non-free
```

- 互联网

```shell
deb [trusted=yes] http://172.22.1.32/enterprise-packages.chinauos.com/server-enterprise/  fou/sp3  main contrib non-free
```

2. 更新源

```shell
# apt update
命中:1 http://172.23.1.32/enterprise-packages.chinauos.com/server-enterprise fou/sp3 InRelease
正在读取软件包列表... 完成
正在分析软件包的依赖关系树   
正在读取状态信息... 完成   
有 140 个软件包可以升级。请执行 ‘apt list --upgradable’ 来查看它们。
```

## 更新OpenSSH

1. 安装 `libssl-dev`

```shell
# apt install libssl-dev -y
```

2. 上传 `openssh`和 `zlib`

| [ICloud获取](https://www.icloud.com.cn/iclouddrive/0a6Z5YjRTUOVDwyyjh69fLAoQ) | [百度网盘获取](https://pan.baidu.com/s/1N74CdsrofonJvyEmS87voA?pwd=ges3) |
| :------------------------------------------------------------------------: | :-------------------------------------------------------------------: |

```shell
root@wsupport-PC:/home/wsupport/Downloads# ls
install_package  openssh-9.4p1.tar.gz  zlib-1.2.13.tar.gz

# 解压源码包
root@wsupport-PC:/home/wsupport/Downloads# tar -zxf openssh-9.4p1.tar.gz 
root@wsupport-PC:/home/wsupport/Downloads# tar -zxf zlib-1.2.13.tar.gz 
root@wsupport-PC:/home/wsupport/Downloads# 
root@wsupport-PC:/home/wsupport/Downloads# ls
install_package  openssh-9.4p1	openssh-9.4p1.tar.gz  zlib-1.2.13  zlib-1.2.13.tar.gz
```

3. 编译安装

- 安装zlib

```shell
root@wsupport-PC:/home/wsupport/Downloads/zlib-1.2.13# ./configure
root@wsupport-PC:/home/wsupport/Downloads/zlib-1.2.13# make && make install
```

- 安装open-ssh

```shell
root@wsupport-PC:/home/wsupport/Downloads# cd openssh-9.4p1
root@wsupport-PC:/home/wsupport/Downloads/openssh-9.4p1# ./configure
root@wsupport-PC:/home/wsupport/Downloads/openssh-9.4p1# make && make install
```

## 升级验证

再次查看OpenSSH的版本，发现已经升级成功，由原来的 `7.9p1 Debian-10+deb10u1`升级到了 `9.4p1`

```
root@wsupport-PC:~# ssh -V
OpenSSH_9.4p1, OpenSSL 1.1.1d  10 Sep 2019
```
