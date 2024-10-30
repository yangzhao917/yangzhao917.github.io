---
uuid: 5ded43e9-4546-7460-8555-4929471b9ae9
title: SpringBoot嵌入东方通
tags: [SpringBoot,东方通]
toc: true
abbrlink: 7e65becb
date: 2024-10-30 12:39:07
---


本文用于记录 SpringBoot 嵌入 东方通 Web 应用服务器的过程。

## 背景

[TongWeb](https://www.tongtech.com/pctype/25.html) 是国内开发的一款高性能应用服务器软件，可以替代 Tomcat。因项目的国产化要求，需要使用 TongWeb 来替代默认的 Tomcat 容器。

## 版本说明

项目使用的 Spring Boot 版本为`2.5.5`。TongWeb 的版本为`7.0.E.6_P11`。

## 项目结构

 ![image-20241030121505174](https://qiniu-image.gotojava.cn/blog/202410301219116.png)

## Maven配置

```
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.5.5</version>
    <relativePath/>
</parent>

<properties>
    <maven.compiler.source>8</maven.compiler.source>
    <maven.compiler.target>8</maven.compiler.target>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <exclusions>
            <!--排除tomcat依赖-->
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-tomcat</artifactId>
            </exclusion>
        </exclusions>
    </dependency>

    <dependency>
        <groupId>com.tongweb.springboot</groupId>
        <artifactId>tongweb-spring-boot-starter-2.x</artifactId>
        <version>7.0.E.6_P11</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
        <exclusions>
            <exclusion>
                <groupId>org.junit.vintage</groupId>
                <artifactId>junit-vintage-engine</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <mainClass>com.tong.App</mainClass>
            </configuration>
        </plugin>
    </plugins>
</build>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.tongweb</groupId>
            <artifactId>tongweb-embed-dependencies</artifactId>
            <version>7.0.E.6_P11</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## 配置License

- application.yaml

```yaml
server:
  tongweb:
    uri-encoding: UTF-8
    license:
      type: file
      path: classpath:tongweb/license.dat
```

## 测试

![image-20241030122241509](https://qiniu-image.gotojava.cn/blog/202410301222638.png)

## 参考

- 源码：https://github.com/yangzhao917/springboot2-adapter-tongweb7-example
