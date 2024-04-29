---
title: Easy Excel 的基本使用
categories:
  - 开发者手册
tags:
  - Easy Excel
abbrlink: c0347fb7
date: 2024-04-30 04:43:46
---

<meta name="referrer" content="no-referrer" />

[Easy Excel](https://easyexcel.opensource.alibaba.com/) 是一个基于 Java 的、快速、简洁、解决大文件内存溢出的 Excel 处理工具。它能让你在不用考虑性能、内存的因素情况下，快速完成 Excel 的读、写等功能。

<!--more-->

**优点：**

快速：快速的读取 Excel 中的数据。

简洁：映射 Excel 和实体类，让代码变的更加简洁。

大文件：在读写大文件的时候使用磁盘做缓存，更加的节约内存。

**特点：**

- Java解析、生成Excel比较有名的框架有Apache poi、jxl。但他们都存在一个严重的问题就是非常的耗内存，poi有一套SAX模式的API可以一定程度的解决一些内存溢出的问题，但POI还是有一些缺陷，比如07版Excel解压缩以及解压后存储都是在内存中完成的，内存消耗依然很大。
- easyexcel重写了poi对07版Excel的解析，一个3M的excel用POI sax解析依然需要100M左右内存，改用easyexcel可以降低到几M，并且再大的excel也不会出现内存溢出；03版依赖POI的sax模式，在上层做了模型转换的封装，让使用者更加简单方便。

## 基本使用

- Maven 引入

```
<!-- Easy Excel -->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>2.1.7</version>
</dependency>

<!-- 日志打印 -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
    <version>1.7.5</version>
</dependency>
<!-- 简化setter/getter方法 -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.10</version>
</dependency>
<!-- 单元测试 -->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
</dependency>
```

### 读操作

- 映射实体

```java
/**
 * 读取Excel
 */
@Setter
@Getter
@ToString
@EqualsAndHashCode
public class ReadExcel implements Serializable {

    private Integer product_id;
    private String name;
    private Integer categories;
    private Integer sku;
    private Integer location;
    private Integer quantity;
    private String model;
    private String manufacturer;
    private String image_name;
    private String requires_shipping;
    private Double price;
    @DateTimeFormat(value = "yyyy-MM-dd HH:mm:ss")
    private String date_added;
    @DateTimeFormat(value = "yyyy-MM-dd HH:mm:ss")
    private String date_modified;
    @DateTimeFormat(value = "yyyy-MM-dd")
    private String date_available;
    private Double weight;
    private String unit;
    private Integer length;
    private Integer width;
    private Integer height;
    private String length_unit;
    private Boolean status_enabled;
    private Integer tax_class_id;
    private Integer viewed;
    private Integer language_id;
    private String seo_keyword;
    private String description;
    private String meta_description;
    private String meta_keywords;
    private String additional_image_names;
    private Integer stock_status_id;
    private Integer store_ids;
    private String related_ids;
    private String tags;
    private Integer sort_order;
    private Boolean subtract;
    private Integer minimum;
    private Double cost;

}
```

- 核心代码

```java
/**
 * Excel读取
 */
@Test
public void testReadExcel(){
    long startTime = System.currentTimeMillis();
    URL resource = this.getClass().getClassLoader().getResource("test.xls");
    EasyExcel.read(resource.getPath(), ReadExcel.class, new ExcelDataListener()).sheet("Products").doRead();
    long endTime = System.currentTimeMillis();
    log.info("耗时：{}ms", endTime - startTime);
}
```

- 监听器

```java
/**
 * Excel读取对象的监听器
 */
@Slf4j
public class ExcelDataListener extends AnalysisEventListener<ReadExcel> {

    /**
     * 每隔 500 条存储数据库，然后清理list，方便内存回收
     */
    private static final int BATCH_COUNT = 500;
    private List<ReadExcel> cacheDataList = new ArrayList<>(BATCH_COUNT);

    /**
     * 这个每一条数据解析都会来调用
     * @param readExcel
     * @param analysisContext
     */
    @Override
    public void invoke(ReadExcel readExcel, AnalysisContext analysisContext) {
        log.info("解析到一条数据：{}", readExcel);
        cacheDataList.add(readExcel);
        if (cacheDataList.size() >= BATCH_COUNT){
            // saveData();
            cacheDataList = new ArrayList<>(BATCH_COUNT);
        }
    }

    /**
     * 所有数据解析完成了 都会来调用
     * @param analysisContext
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext analysisContext) {
        this.saveData();
        log.info("所有数据解析完成!");
    }

    private void saveData() {
        log.info("{}条数据，开始存储数据库!", cacheDataList.size());
        log.info("存储数据库成功");
    }
}
```

- 单元测试结果

![Easy Excel 读取测试](https://qiniu-image.gotojava.cn/blog/image-20240430043257016.png)

### 写操作

- 实体对象

```java
/**
 * 写Excel
 */
@Setter
@Getter
@EqualsAndHashCode
@ToString
public class WriteExcel implements Serializable {

    @ExcelProperty("编号")
    private Long no;    // 编号
    @ExcelProperty("姓名")
    private String name;    // 姓名
    @ExcelProperty("性别")
    private String sex; // 性别
    @ExcelProperty("地址")
    private String address; // 地址
    @ExcelProperty("手机号")
    private String tel; // 手机号

}
```

- 核心代码

```
/**
 * 写入Excel
 */
@Test
public void testWriteExcel(){
    long startTime = System.currentTimeMillis();
    // 指定写入到哪个Excel文件
    String fileName = String.format("/Users/yangzhao/Desktop/write-excel-%s%s", startTime, FILE_SUFFIX_XLSX);
    EasyExcel.write(fileName, WriteExcel.class).sheet("模板").doWrite(generateData());
    long endTime = System.currentTimeMillis();
    log.info("耗时：{}ms", endTime - startTime);
}

/**
 * 模拟数据库
 * @return
 */
private List<WriteExcel> generateData() {
    int writeNubmer = 65535;
    List<WriteExcel> dataList = new ArrayList<>(writeNubmer);
    for (int i = 0; i <= writeNubmer; i++) {
        WriteExcel data = new WriteExcel();
        data.setNo((long) i + 1);
        data.setName(GenerateInfoUtils.generateRandomName());
        data.setSex(GenerateInfoUtils.generateRandomGender());
        data.setAddress(GenerateInfoUtils.generateRandomAddress());
        data.setTel(GenerateInfoUtils.generateRandomTel());
        dataList.add(data);
    }
    return dataList;
}
```

- 随机信息生成工具类

```java
/**
 * 信息生成工具，用于随机生成姓名、地址、性别、手机号
 */
public class GenerateInfoUtils {

    /**
     * 预定义的姓
     */
    private static final List<String> SURNAMES = Arrays.asList("王", "李", "张", "刘", "陈", "杨", "黄", "吴", "赵", "周", "庄", "诸葛");
    /**
     * 预定义的名
     */
    private static final List<String> FIRST_NAMES = Arrays.asList("伟", "勇", "芳", "娜", "敏", "磊", "静", "丽", "强", "鹏", "钊", "能");
    /**
     * 预定义的性别常量
     */
    private static final String[] GENDERS = {"男", "女"};

    /**
     * 预定义的城市、街道和房号
     */
    private static final List<String> CITIES = Arrays.asList("北京", "上海", "广州", "深圳", "成都", "重庆", "杭州", "南京");
    private static final List<String> STREETS = Arrays.asList("长安街", "南京路", "解放大道", "人民路", "复兴路", "中山路");
    private static final int MIN_HOUSE_NUMBER = 1;
    private static final int MAX_HOUSE_NUMBER = 1000;

    /**
     * 定义国内常见的手机号前缀
     */
    private static final String[] PHONE_PREFIXES = {"139", "138", "137", "136", "135", "134", "159", "158", "157", "150", "151", "152", "188", "187", "186", "183", "182", "181", "180", "178"};

    /**
     * 随机数生成器
     */
    private static final Random RANDOM = new Random();

    /**
     * 随机生成手机号
     * @return
     */
    public static String generateRandomTel() {
        // 随机生成前缀
        String phonePrefix = PHONE_PREFIXES[RANDOM.nextInt(PHONE_PREFIXES.length)];
        // 随机生成后8位数字
        StringBuilder phoneNumber = new StringBuilder(phonePrefix);
        for (int i = 0; i < 8; i++) {
            phoneNumber.append(RANDOM.nextInt(10));
        }
        return phoneNumber.toString();
    }

    /**
     * 生成随机地址
     * @return
     */
    public static String generateRandomAddress() {
        String city = CITIES.get(RANDOM.nextInt(CITIES.size()));    // 城市
        String street = STREETS.get(RANDOM.nextInt(STREETS.size()));    // 街道
        int houseNumber = MIN_HOUSE_NUMBER + RANDOM.nextInt(MAX_HOUSE_NUMBER);  // 房号
        return String.format("%s%s%d号", city, street, houseNumber);
    }

    /**
     * 随机生成性别
     * @return
     */
    public static String generateRandomGender() {
        int index = RANDOM.nextInt(GENDERS.length);
        return GENDERS[index];
    }

    /**
     * 生成随机姓名
     */
    public static String generateRandomName() {
        // 从姓氏和名字列表中随机选择
        String surname = SURNAMES.get(RANDOM.nextInt(SURNAMES.size()));
        String firstName = FIRST_NAMES.get(RANDOM.nextInt(FIRST_NAMES.size()));
        return surname + firstName;
    }
}
```

- 单元测试结果

![Easy Excel 写数据](https://qiniu-image.gotojava.cn/blog/image-20240430044041091.png)

![image-20240430044122868](https://qiniu-image.gotojava.cn/blog/image-20240430044122868.png)

## 参考

- [Easy Excel 的使用](https://juejin.cn/post/6955344459076730887)
- [Easy Excel 官方文档](https://easyexcel.opensource.alibaba.com/docs/current/)``