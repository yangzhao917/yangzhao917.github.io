---
title: 【MySQL 实战 45 讲：第四、五章节（深入浅出索引）】学习小节
toc: true
abbrlink: c0cb477
date: 2025-03-27 18:14:27
tags: MySQL
---

<meta name="referrer" content="no-referrer" />

<!--more-->

索引的意义：索引的出现就是为了提高数据的查询效率，就像书的目录一样，通过目录能够快速的知道这本书讲了什么以及如何快速翻到对应的知识章节。

在计算机中为了实现索引数据的存储有三种比较常见的数据结构：Hash 表、有序数组、搜索树；

Hash 表是一种以键 - 值存储的数据结构，其核心思想是把键和值以指定的方式进行存储，在存储时把键通过 hash 函数进行计算来确定在数组上的某个位置，然后把对应的值放到这个位置上。查询时将指定的键通过 Hash 函数进行计算获取键在数组中的位置，以获取数据中存放的值。当多个 Hash 函数计算同一个键时容易产生 Hash 冲突。这样就会存在多个键出现在同一个位置的情况，所以 Hash 表只适合于等值查询的场景，不适合于区间查询的场景。

有序数组是一种按顺序排列的数据，其特点是按照从小到大或从大到小的顺序排列，这种排列方式的好处是找东西特别快，方便查找和处理。但缺点是更新数据比较麻烦，你往中间插入数据的时候就必须挪动该数组位置后面所有的数组记录，成本太高。

搜索树是一种数据结构，像一颗倒挂的树，用来快速查找、插入和删除数据。每个节点有一个值和最多两个子节点（左和右）。左边的子节点值比父节点小，右边的子节点值比父节点大。但特殊情况下该树可能会成为一个链表，比如新的节点一直比父节点大或一直比父节点小。此时为了保证树的层级不能太深，就需要保证这个树是平衡二叉树。
树既然可以有二叉，那就可以有多叉，多叉指得是在子节点上有多个儿子，儿子之间的大小保证从左到右递增。二叉树是搜索效率目前最高的，但是实际的数据库存储并不会去用二叉树，原因是数据不止需要存储在内存中，还需要最终持久化保存到磁盘上。其次是二叉树过高时会导致 IO 的次数过多，导致性能低下。

InnoDB 的索引存储使用的是 B+树。这个树和搜索树的结构很像。不同的是只有最底层的叶子节点才存储数据。非叶子节点存储是叶子节点的位置指针。
从类型上来说分为聚簇索引和非聚簇索引。所谓聚簇索引就是数据和索引保存在一起。
聚簇索引一般指的就是主键索引，叶子节点存放的是整条行记录，非叶子节点存储是叶子节点的指针。
非聚簇索引存放的是索引字段和索引的主键字段，当查询条件根据最左前缀原则匹配到索引树时，根据索引字段去搜索，当搜索到符合条件的节点时，得到该节点的ID 值，此时会拿到 ID 再去聚簇索引中根据ID 再搜索一遍，通过 ID 拿到整行的记录，这个过程称之为回表。因为回表多一次查询操作，所以能直接走聚簇索引时应尽可能走聚簇索引，避免一次查询的开销。
最左前缀原则指的按照索引字段的从左边其第 N 个字段，或者符合索引字段顺序的从左起 N 个字符。对于不符合最左前缀的部分，InnoDB 会使用索引下推的机制在索引遍历的过程中，对索引包含的字段先左判断，直接过滤掉不符合条件的记录，减少回表次数。

因为 B+树的存储特性，叶子节点时链表存储的，所以为了提高索引的插入效率，会建议主键使用自增主键进行插入，目的是利用索引的存储结构提高插入效率，如果使用 UUID 存储会产生两个问题，第一 UUID 是 128位长度，就算去除所谓的“-”字符也需要 32 位的存储空间，空间的问题对于现在的大容量存储来说已经不再是什么问题了，但 UUID 为了避免冲突会产生随机分布的问题，这就导致了插入时不是顺序插入的。这种情况下可能会产生为了保证顺序存储进而产生拆分原有的数据页以解决顺序存储的问题，一旦产生所谓的页分裂，性能就会下降很多。所以应该建议使用bigint unsigned AUTO_INCREMENT 的方式存储，占用 64 位。

当查询的条件刚好符合非聚簇索引的索引字段，那么非聚簇索引就可以直接返回符合条件的查询结果了，就不需要再去聚簇索引上查询了，这个过程称之为覆盖索引。


问题一：产生页分裂后，后面的数据会不会继续页分裂？
问题二：当查询条件符合非聚簇索引的索引字段，但 select 字段超出了非聚簇索引的索引字段，那么这个查询可以使用覆盖索引吗？
问题三：当索引的最多前缀顺序不一致时，会不会自动根据索引下推机制去做索引的查询优化？
