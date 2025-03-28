---
title: Windows环境Oracle数据库自动备份的实现
categories:
  - 开发者笔记
tags:
  - Oracle
abbrlink: a639d743
date: 2023-06-08 14:05:15
toc: true
---
<meta name="referrer" content="no-referrer" />

<!--more-->

## 1.创建批处理文件（.bat）

```bash
@echo off   
echo ================================================   
echo  Windows环境下Oracle数据库的自动备份脚本  
echo  1. 使用当前日期命名备份文件。  
echo  2. 自动删除7天前的备份。  
echo ================================================  
::以“YYYYMMDD”格式取出当前时间。  
set BACKUPDATE=%date:~0,4%%date:~5,2%%date:~8,2%  
::设置用户名、密码和要备份的数据库。  
set USER=xxx  
set PASSWORD=123456  
set DATABASE=dbtest  
::创建备份目录。  
if not exist "D:\backup\data"       mkdir D:\backup\data  
if not exist "D:\backup\log"        mkdir D:\backup\log  
set DATADIR=D:\backup\data  
set LOGDIR=D:\backup\log  
exp %USER%/%PASSWORD%@%DATABASE%  file=%DATADIR%\data_%BACKUPDATE%.dmp log=%LOGDIR%\log_%BACKUPDATE%.log  
::删除7天前的备份。  
forfiles /p "%DATADIR%" /s /m *.* /d -7 /c "cmd /c del @path"  
forfiles /p "%LOGDIR%" /s /m *.* /d -7 /c "cmd /c del @path"  
exit
```

## 2.添加定时任务执行计划

### 2.1打开任务计划程序

【控制面板】-【管理工具】-【任务计划程序】

### 2.2创建计划任务

![](http://qiniu-image.gotojava.cn/blog/2023-12-15-191139.jpg)

### 2.3选择计划任务的执行循环周期

![](http://qiniu-image.gotojava.cn/blog/2023-12-15-191142.jpg)

### 2.4选择计划任务的执行时间

![](http://qiniu-image.gotojava.cn/blog/2023-12-15-191144.jpg)

### 2.5选择程序位置

![](http://qiniu-image.gotojava.cn/blog/2023-12-15-191147.jpg)

![](http://qiniu-image.gotojava.cn/blog/2023-12-15-191149.jpg)

### 2.6确认任务摘要

![](http://qiniu-image.gotojava.cn/blog/2023-12-15-191152.jpg)

> 点击“完成”，完成定时任务的创建。

## 参考

- <a href="https://www.cnblogs.com/johnhery/p/9941963.html">%date~0,4%和 %time~0,2%等用法详解 </a>
- <a href="https://www.cnblogs.com/login2012/p/5794572.html">Windows环境下Oracle数据库的自动备份脚本 </a>
- <a href="https://blog.csdn.net/YBaog/article/details/100023073">Windows Server 2012 / 2016 定时任务设置和无法执行的解决方法 </a>
