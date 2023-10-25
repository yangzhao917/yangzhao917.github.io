---
title: MacOS修改文件时间属性
categories:
  - 工具
tags:
  - MacOS
abbrlink: 43757ee8
date: 2023-10-08 21:50:38
---

<meta name="referrer" content="no-referrer" />

记录在MacOS下修改文件的时间属性。

<!--more-->

> 修改文件创建时间：

```bash
touch -t 201209160330.00 /Users/name/Desktop/somefile.jpg
```

> 修改文件修改时间：

```bash
touch -mt 201209160330.00 /Users/name/Desktop/somefile.jpg
```

> 批量修改文件修改时间：

```bash
touch -mt 200801120000 /Volumes/Mac\ HD/Pictures/Album/*
```

