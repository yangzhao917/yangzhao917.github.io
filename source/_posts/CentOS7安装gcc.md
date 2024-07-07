---
title: CentOS7 安装 gcc/gcc-c++
categories: ['开发者笔记']
tags: ['Linux']
abbrlink: aba7d07
date: 2024-06-03 04:18:38
---


<meta name="referrer" content="no-referrer" />

本文用于记录gcc、gcc+c++在CentOS 7下的在线安装、离线安装两种安装方式。

<!--more-->

## gcc是什么？

GCC（GNU Compiler Collection）是一个支持多种编程语言（如C、C++、Fortran等）的开源编译器系统，它能够将源代码编译成可执行的机器代码。

### 在线安装

```bash
yum install gcc -y
```

### 离线安装

下载地址：https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/

下载列表：

```bash
# -P：指定到下载目录，如果目录不存在，则自动创建
wget -P ./gcc https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/cpp-4.8.5-44.el7.x86_64.rpm
wget -P ./gcc https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/gcc-4.8.5-44.el7.x86_64.rpm
wget -P ./gcc https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/glibc-devel-2.17-317.el7.x86_64.rpm
wget -P ./gcc https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/glibc-headers-2.17-317.el7.x86_64.rpm
wget -P ./gcc https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/kernel-headers-3.10.0-1160.el7.x86_64.rpm
wget -P ./gcc https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/libmpc-1.0.1-3.el7.x86_64.rpm
wget -P ./gcc https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/mpfr-3.1.1-4.el7.x86_64.rpm

# --nodeps 不检查包的依赖关系；--force强制安装
rpm  -ivh  ./gcc/*.rpm --nodeps --force
```

## gcc+c++是什么

GCC-C++（也称为g++）是GCC（GNU Compiler Collection）中的一个编译器组件，用于编译C++语言的源代码。它是GCC的一个子集，专门处理C++代码。

### 在线安装

```bash
yum install gcc-c++ -y
```

### 离线安装

```bash
wget -P gcc-c++ https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/gcc-c++-4.8.5-44.el7.x86_64.rpm
wget -P gcc-c++ https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/compat-libstdc++-33-3.2.3-72.el7.x86_64.rpm
wget -P gcc-c++ https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/libstdc++-devel-4.8.5-44.el7.x86_64.rpm

# --nodeps 不检查包的依赖关系；--force强制安装
rpm  -ivh  ./gcc-c++/*.rpm --nodeps --force
```

