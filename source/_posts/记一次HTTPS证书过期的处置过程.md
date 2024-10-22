---
uuid: 43dde236-74f2-d7ea-04b5-0d89dfc0eef9
title: 记一次HTTPS证书过期的处置过程
toc: true
abbrlink: ac3d766f
date: 2024-10-23 00:12:30
---

<meta name="referrer" content="no-referrer" />

记一次 HTTPS 证书过期的处置过程的流水帐。

## 背景

因为应用上线的需求在阿里云租用了一台服务器，考虑到后期上线的需求一并注册了一个证书。但近期因为项目关系导致该应用的上线一直在延期，证书因为申请是免费证书（DigiCert RSA）每次只有3个月的有效期，导致证书过期后没有及时更新，在Nginx的网关层`HTTP`又做了301跳转到`HTTP`的重定向。导致出现了下面的情况。

![image-20241022233525178](https://qiniu-image.gotojava.cn/blog/202410222335262.png)

![](https://qiniu-image.gotojava.cn/blog/202410222306643.png)

查看证书详情我们可以看到，我们证书在10月1日早上8点就失效了，所以导致证书过期。

## 临时解决方案

1. 解除301重定向

由于服务端做了301的跳转，导致网关层接受到的所有 HTTP 请求都会重定向到 HTTPS 。所以这里注释掉`return 301`的 HTTPS 跳转，并重写 HTTPS 的跳转使 HTTPS 的请求重定向到 HTTP 以解决证书无效的问题。并通过 <u>nginx -s reload</u> 重载nginx配置，使配置生效。此时网站的访问就会恢复正常。

![image-20241022232942746](https://qiniu-image.gotojava.cn/blog/202410222330859.png)

- HTTPS 重定向 HTTP

```bash
return 301 http://$server_name$request_uri;
```

- 更新 nginx 配置

```bash
nginx -s reload
```

2. 获取新证书

向域名提供商提交申请，签发成功后会有邮件通知。DigiCert RSA 的审核周期预计在5分钟以内。![image-20241022234835430](https://qiniu-image.gotojava.cn/blog/202410222348543.png)

## 更新证书

- 获取证书

点击下载获取应用的证书文件。根据服务器类型获取对应的证书文件即可。

![image-20241022235602136](https://qiniu-image.gotojava.cn/blog/202410222356272.png)

- 部署证书

1. 将压缩文件解压，将签发的证书文件覆盖上传到对应的证书位置。

![image-20241022235859498](https://qiniu-image.gotojava.cn/blog/202410222358664.png)

![image-20241023000335484](https://qiniu-image.gotojava.cn/blog/202410230003590.png)

2. 恢复配置文件的 HTTPS `301`重定向。

![image-20241023000828198](https://qiniu-image.gotojava.cn/blog/202410230008287.png)

```bash
return 301 https://$server_name$request_uri;
```

3. 使用 `nginx -s reload`重新加载配置文件使配置生效。

- 验证

页面恢复正常，有效期延长。

![image-20241023001055537](https://qiniu-image.gotojava.cn/blog/202410230010654.png)
