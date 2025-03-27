---
uuid: 18ec0960-cb11-1fff-5b1c-bf7f9183e9d5
title: 如何获取Linux系统的年龄
tags:
  - Linux
toc: true
abbrlink: b3ec94dd
date: 2024-11-01 17:56:30
---


本文将介绍几个简单的命令来获取不同 Linux 系统安装时间的方法。

<!-- more -->

## 通用

- stat 命令获取

stat命令Birth字段为空置的操作系统内核版本为3.10.0，不满足条件kernerl >=4.11 所以stat命令显示空值。

```
# stat / | awk '/Birth: /{print $2 " " substr($3,1,5)}'
# uname -r
3.10.0-1160.118.1.el7.x86_64
```

- 通过文件系统获取

通过获取文件系统的创建时间来获取

```bash
# tune2fs -l $(df -P / | awk 'NR==2{print $1}') | grep 'Filesystem created'
Filesystem created:       Mon Jun  3 17:54:37 2024
```

## Debian / Ubuntu

```bash
sudo head -n1 /var/log/installer/syslog
```

## Fedora / Rocky Linux / AlmaLinux

*在 Fedora、Red Hat Enterprise Linux 及其所有分支（如 Rocky Linux、AlmaLinux、Oracle Linux 等）中，我们可以通过检查“ basesystem* ”包的安装日期作为操作系统安装时间的可靠标记。

```
[root@localhost ~]# sudo rpm -qi basesystem | grep -i "install date"
Install Date: 2024年01月02日 星期二 11时15分24秒
```

但是请记住，如果您正在执行就地升级，例如从 Fedora 38 到 Fedora 39、从 Rocky 9.1 到 Rocky 9.2 等，则检索“ *basesystem* ”包信息时显示的日期将是升级时间的日期。

### Arch Linux

```
head -n1 /var/log/pacman.log
```

## Refences

- [Linux Installation Date: How to Discover Your System’s Age](https://linuxiac.com/how-to-find-linux-os-installation-date/)

- [Linux xfs文件系统stat命令Birth字段为空的原因探究](https://blog.csdn.net/Gefangenes/article/details/130629574)
