---
title: SSH 连接不到 EC2 Linux 实例原因排查
categories:
  - 开发者笔记
tags:
  - Linux
abbrlink: 306847ba
date: 2024-01-19 03:56:12
toc: true
---
<meta name="referrer" content="no-referrer" />

Amazon Elastic Compute Cloud (EC2) 是一个在 AWS 云平台上提供可扩展计算能力的按需计算服务。本文用于记录MacOS环境下连接EC2实例的排查过程。

<!--more-->

当时由于第一次接触AWS的EC2产品，对AWS除了知道它和阿里云一样都属于云计算公司以外，并没有过多的了解。但在之前已经使用过腾讯云、阿里云的相关云服务产品，有一定的云上使用经验。

网上的大多数方案都是基于Windows的方法，对于MacOS的平台的资料并不多或者没法通过验证。因对AWS产品的不熟，在困扰许久的情况下，我联系了AWS的中国区的官方支持人员。在与亚马逊的小姐姐沟通后，她们针对我的问题与技术进行了沟通并对我的问题进行了邮件回复和文档支持。

以下是邮件回复的的文档资料（部分内容）

1. 在 Linux 或者 mac 环境下，常见的ssh的命令：

```shell
 ssh -i /path/<替换为您自己的秘钥名称>.pem ec2-user@publicdns-hostname-or-ipv4-address
```

2. 在 windows 下，请参考使用 [putty 从 windows 连接到 linux 实例](https://docs.aws.amazon.com/zh_cn/AWSEC2/latest/UserGuide/putty.html)。通常分为两步，秘钥格式的转换，以及连接。

连接时，请使用 `ec2-user`账户进行登陆，对于 `publicdns-hostname-or-ipv4-address` 的获取可以通过 AWS 控制台的 EC2 实例列表中获取。但是公共的DNS地址会比较长，我们使用公有的 `Ipv4` 同样是可以去连接的。

![image-20240119043653371](https://qiniu-image.gotojava.cn/blog/image-20240119043653371.png)

在连接之前，首先要确定，我们的实例地址是可以连接的。这个可以通过 `ping` 来确认。

![image-20240119044001526](https://qiniu-image.gotojava.cn/blog/image-20240119044001526.png)

如果发现连接可达，但是SSH连接无法建立的时候，可以通过配置AWS的配置安全组来解决。配置一条SSH的安全组规则就可以了。（这种情况通常是最常见的）

![image-20240119044450513](https://qiniu-image.gotojava.cn/blog/image-20240119044450513.png)

虽然上面使用命令解决了SSH连接实例的问题，但是每次连接还是很麻烦的，最后找到了一个比较友好的MacOS下的一个开源工具 [Tabby](https://tabby.sh/) ，可以很好解决秘钥连接的问题。国产的 FinalShell 工具也是支持的，但是我没有验证成功。下图是 Tabby的截图，颜值还是不错的~

![image-20240119050926033](https://qiniu-image.gotojava.cn/blog/image-20240119050926033.png)

参考文档：

- [启动&amp;连接EC2指导-新版](https://pan.baidu.com/s/1VIGY-7oBVbdyUeBWQUhWUg?pwd=8888)（pdf）
- [SSH 连接不到 EC2 Linux 实例原因排查](https://pan.baidu.com/s/1VIGY-7oBVbdyUeBWQUhWUg?pwd=8888)（pdf）
