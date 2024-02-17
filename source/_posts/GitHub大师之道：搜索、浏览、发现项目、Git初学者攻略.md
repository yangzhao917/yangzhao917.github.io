---
title: GitHub大师之道：搜索、浏览、发现项目、Git初学者攻略
categories:
  - 杂文随笔
abbrlink: d6bf6e8c
date: 2023-12-07 22:44:52
---
<meta name="referrer" content="no-referrer" />

GitHub是一个全球性的代码托管平台，上面托管了非常多的优秀项目和学习资料。但是对于庞大的资源内容掌握一些搜索方法和技巧来提高搜索效率是十分有必要的。下面是我经过验证的一些不错的技巧和相关资料，希望能对你有所帮助。

<!--more-->

## 搜索小技巧

![Untitled](http://qiniu-image.gotojava.cn/blog/2023-12-15-191043.png)

- Watch：表示有多少人关注这个项目；
- Star：表示有多少人给这个项目点赞，如果你给这个项目点赞，这个项目会出现在你的点赞列表中。点赞数越多，代表这个项目在社区的热度就越高；
- Fork：表示有多少人拷贝或者克隆了这个项目。如果我们Fork了这个项目，就可以在Fork的基础上再进行优化，优化后的项目在得到原作者认可的情况下，可以再次提交给作者。
- 根据项目名称搜索

> 语法：in:name

![Untitled](http://qiniu-image.gotojava.cn/blog/2023-12-15-191044.png)

```
pdf2excel in:name
```

- 根据项目描述搜索

> 语法：in:description

![Untitled](http://qiniu-image.gotojava.cn/blog/2023-12-15-191044.jpg)

```
Java教程 in:description
```

- 根据项目帮助文档搜索

> 语法：in:readme

![Untitled](http://qiniu-image.gotojava.cn/blog/2023-12-15-191046.png)

```
Java教程 in:in:readme
```

- 根据项目描述、项目文档组合搜索

> 语法：in:readme,description

![Untitled](http://qiniu-image.gotojava.cn/blog/2023-12-15-191047.jpg)

```
Java教程 in:description,readme
```

- 根据starts点赞量搜索，点赞量越高代表项目比较收欢迎

> 语法：stars:≥100

![Untitled](http://qiniu-image.gotojava.cn/blog/2023-12-15-191049.jpg)

```
# 搜索项目名称，项目说明，项目文档中包含pdf2md，stars数量大于等于100的项目
pdf2md in:name,description,readme stars:>=100
```

- 根据forks克隆数量搜索，克隆数量越高代表项目比较收欢迎

> 语法：forks:数量

![Untitled](http://qiniu-image.gotojava.cn/blog/2023-12-15-191050.jpg)

```
# 搜索项目名称，项目说明，项目文档中包含pdf2doc，forks数量大于等于100的项目
pdf2doc in:name,description,readme forks:>=100

# 搜索项目名称，项目说明，项目文档中包含pdf2doc，forks数量100到500区间的项目
pdf2doc in:name,description,readme forks:100..500
```

## 浏览小技巧

- 在线查看项目

在仓库详情按下【.】键，神奇的事情发生了，当前仓库的内容会被当做资源在一个在线的VSCode中打开，方便我们浏览项目的内容，包括在VSCode中代码搜索、快捷跳转、安装插件增强编辑器功能等。

<aside>
💡 实际上github.com的域名会跳转变成”github.dev“。然后当前的仓库就加载到了在线的VSCode中。
</aside>

- 在线运行项目

在项目地址前面加入”gitpod.io/”前缀。我们要看的项目就会在gitpod.io项目中运行，使用操作和VSCode是一样的，既然能运行，那么当然也就可以在线阅读项目喽。而且gitpod.io会自动帮我们识别项目类型并处理安装项目的依赖，简直太香了~

![Untitled](http://qiniu-image.gotojava.cn/blog/2023-12-15-191052.jpg)

## 如何寻找优质项目

- GitHub Trending

[https://github.com/trending](https://github.com/trending)

<aside>
💡 GitHub Trending是<b>一个展示GitHub上当前最受欢迎项目的功能</b>。 每天，GitHub会计算许多项目的活跃度，从而得出一个受欢迎程度排行榜，包括今天、本周和本月的热门项目。
</aside>

- https://github.com/521xueweihan/HelloGitHub

<aside>
💡 分享 GitHub 上有趣、入门级的开源项目。
</aside>

- awesome

![Untitled](http://qiniu-image.gotojava.cn/blog/2023-12-15-191056.jpg)

<aside>
💡 GitHub Awesome 是<b>一个Github 上的一个项目集合，也是一个社区驱动的项目，旨在收集GitHub 上的各种优秀的、值得推荐的项目</b>。 Awesome 通常指令人敬畏的、令人赞叹的事物，所以这个项目的名称取为Awesome XXX，表明它收录的是优秀的、值得推荐的项目。
</aside>

- 找例子

> 语法：关键词 sample

![Untitled](http://qiniu-image.gotojava.cn/blog/2023-12-15-191058.jpg)

- 找模板

> 语法：xxx starter/boilerplat

![Untitled](http://qiniu-image.gotojava.cn/blog/2023-12-15-191101.jpg)

- 找教程

> 语法：xxx tutorial

![Untitled](http://qiniu-image.gotojava.cn/blog/2023-12-15-191104.jpg)

## 指导初学者

- 指导初学者做出首次贡献的方式

<aside>
💡 该项目旨在简化和指导初学者做出首次贡献的方式。如果您想做出第一次贡献，请按照以下步骤操作。
</aside>

[https://github.com/firstcontributions/first-contributions](https://github.com/firstcontributions/first-contributions)

- 最浅显易懂的Git教程

[Git教程-廖雪峰老师的经典教程](https://www.liaoxuefeng.com/wiki/896043488029600)
