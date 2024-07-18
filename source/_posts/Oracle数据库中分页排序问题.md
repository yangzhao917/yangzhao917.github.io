---
title: 达梦查询分页排序问题
categories:
  - 开发者笔记
tags:
  - Oracle
abbrlink: e057bf2e
date: 2023-06-08 14:00:55
---
<meta name="referrer" content="no-referrer" />

<!--more-->

## 问题复现

- 环境：达梦7

查询SQL如下

```sql
SELECT
id,
duty_date,
duty_leader,
duty_leader_id,
duty_week,
day_people,
day_people_id,
night_people,
night_people_id,
driver_people,
is_work,
ISNULL( ( SELECT COUNT ( id ) FROM T_OA_DUTY_PRINT_LOG WHERE is_print = '1' AND duty_id = t1.id AND created_by = 'a5051dc718b942eb876e967836ec2953' GROUP BY duty_id ), 0 ) AS PRINT_COUNT 
FROM
T_OA_DUTY_PRINT AS t1 
WHERE
1 = 1 
ORDER BY
SUBSTR ( t1.duty_date, 0, 7 ) DESC,
duty_date ASC
```

发现数据库的查询结果数据是正确的

![](http://qiniu-image.gotojava.cn/blog/2023-12-15-191114.png)

但页面返回的数据排序是有问题的

![](http://qiniu-image.gotojava.cn/blog/2023-12-15-191117.png)

## 问题分析

通过跟踪和调试，发现处理的逻辑拼接了以下代码

![](http://qiniu-image.gotojava.cn/blog/2023-12-15-191122.png)

那么拼接后的SQL就是这样

![](http://qiniu-image.gotojava.cn/blog/2023-12-15-191125.png)

```sql
SELECT
	* 
FROM
	(
	SELECT
		rownum rn,
		id,
		duty_date,
		duty_leader,
		duty_leader_id,
		duty_week,
		day_people,
		day_people_id,
		night_people,
		night_people_id,
		driver_people,
		is_work,
		ISNULL( ( SELECT COUNT ( id ) FROM T_OA_DUTY_PRINT_LOG WHERE is_print = '1' AND duty_id = t1.id AND created_by = 'a5051dc718b942eb876e967836ec2953' GROUP BY duty_id ), 0 ) AS PRINT_COUNT 
	FROM
		T_OA_DUTY_PRINT AS t1 
	WHERE
		1 = 1 
	ORDER BY
		SUBSTR ( t1.duty_date, 0, 7 ) DESC,
		duty_date ASC 
	) template 
WHERE
	template.rn> 0 
	AND template.rn<= 20
```

![](http://qiniu-image.gotojava.cn/blog/2023-12-15-191129.png)

也就是查询后的数据的**ROWNUM**的值并没有被重新排序，那么由根据ROWNUM进行分页，数据的排序自然就不对了。

## 解决方式

```sql
SELECT
	ROWNUM rn,tmp.*
FROM
	(
	SELECT
		id,
		duty_date,
		duty_leader,
		duty_leader_id,
		duty_week,
		day_people,
		day_people_id,
		night_people,
		night_people_id,
		driver_people,
		is_work,
		ISNULL( ( SELECT COUNT ( id ) FROM T_OA_DUTY_PRINT_LOG WHERE is_print = '1' AND duty_id = t1.id AND created_by = 'a5051dc718b942eb876e967836ec2953' GROUP BY duty_id ), 0 ) AS PRINT_COUNT 
	FROM
		T_OA_DUTY_PRINT AS t1 
	WHERE
		1 = 1 
	ORDER BY
		SUBSTR ( t1.duty_date, 0, 7 ) DESC,
	duty_date ASC 
	) AS tmp
```

![image.png](http://qiniu-image.gotojava.cn/blog/2023-12-15-191131.png)

## 参考

- `<a href="https://blog.csdn.net/github_34013496/article/details/74938788">`Oracle数据库中分页排序 `</a>`
