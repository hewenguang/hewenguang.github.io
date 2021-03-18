---
title: '网页正文提取算法研究学习'
date: 2021-03-17 14:23:03
tags: [正文提取,前端开发,阅读模式,浏览器]
published: true
hideInList: false
feature: 
isTop: false
---
![网页正文提取算法研究](https://ranhe.xyz/post-images/1615962620318.jpeg)

## 引言

网站数据的抓取分析是当今众多互联网业务中非常重要的组成部分，舆情分析、网络搜索、定向广告等都涉及到大量的数据采集分析。面对采集下来的各种各样的网页，分析并识别正文则是一个更加具有挑战性的工作

本文档分为如下部分：
- 业界存在的识别算法简介和对比
- 针对普遍使用的 [Readability](https://github.com/mozilla/readability) 进行具体介绍
- 怎样实现一套更优的算法？

## 背景

​互联网上海量网页数据，分析和挖掘其中价值的第一步就是识别出真正的正文，剔除页面无关的噪音，从而更好的分析。然而面对千奇百怪的页面布局和展示，分别为每个页面制作一个页面解析模板不仅耗时耗力，当页面改版以后之前的工作都将失去意义

## 业界已有算法

针对这种情况，业界为了提高效率，通过不同的算法实现了自动的正文提取。下面我们分别简单说明相关的实现

### 正文密度

**介绍**

基于正文密度的算法是遍历页面所有只包含文本节点的 dom 节点。遍历当前 dom 节点，当节点内的文本数量占比整个页面所有的文本数量大于 0.4 则认为是正文区域，否则继续遍及父级节点

**缺点**

基于正文密度的算法针对英文页面有很好的效果，对于中文类含有噪音较多的网页会存在识别区域大于正文区域的情况，且针对图片内容等类型网页则无能为力

**代表**

Chrome 扩展  [just-read](https://chrome.google.com/webstore/detail/just-read/dgmanlpmmkibanfdgjocnabmcaclkmod) 使用该算法，通过 css 解决了 识别区域大于正文区域的情况，具体做法是通过 css 隐藏掉 footer 、header、comment、ad 等类名和标签名。虽然可以达到较高的准确率但是会存在误伤正文的情况

### 文本特征

**介绍**

基于文本特征的算法是识别页面所有的文本区域，根据正文的特征来识别正文。特征如：标签符号的数量，文本长度的峰值变化等特征来识别正文

**缺点**

对于图片类内容仍然是无能为力

**代表**

Chrome 自带的阅读模式（开启方法： 在 chrome://flags 页面搜索 read mode 启动）

### 权值计算

**介绍**

对于正文特征进行权值计算，使用特征为： 标点符号数量、正文长度、正文链接密度。通过对以上特征的加权计算，对于得分加权到父级节点，并赋予祖父节点一半的权值。最后找出权值最高的 dom 节点就是正文节点

**缺点**

该算法需要解析DOM树，因此执行效率稍微慢一些。因为是加权对 dom 赋值计算，针对常规 div 包裹 p 标签类型的网页可以达到 100% 识别率，但是对于不按套路出牌的网页则会存在丢失正文的情况。如:正文使用多个 div 包裹，最后使用一个 div 把这些 div 包起来，这样权值计算之后会识别其中一个 div 导致其他正文丢失

**代表**

Safari 的阅读模式。该算法在 safari 进行了更多的优化，识别率更高。原始代码基于大名鼎鼎的 arc90 实验室的 Readability 。该算法已经商业化实现了 firefox ，chrome 插件及 flipboard 。目前火狐浏览器使用的源代码开源了，地址 ： [Readability](https://github.com/mozilla/readability) 

### Readability 深究

通过一个超简化版本来深入浅出研究 Readability，你可以直接在文字多的网页控制台运行查看识别效果

``` js
let maybeNode = {
  score:0,
};
const nodes = document.body.getElementsByTagName('p');
for(var i = 0, len = nodes.length; i < len; i++){
  const node = nodes[i];
  let score = 1;
  const text = node.innerText;
  score += text.split(/：|。|；|，|,|\.|\?|”/).length;
  score += Math.min(Math.floor(text.length / 100), 3);
  typeof node.score !== 'number' && (node.score = 0);
  node.score += score;
  node.setAttribute('score', node.score);
  node.score > maybeNode.score && (maybeNode = node);
  let index = 0;
  let tempNode = node.parentElement;
  while (tempNode && tempNode.tagName !== 'BODY'){
    if(/div|article|section/i.test(tempNode.tagName)){
      typeof tempNode.score !== 'number' && (tempNode.score = 0);
      tempNode.score += score / (index < 2 ? index + 2 : index * 3);
      tempNode.setAttribute('score', tempNode.score);
      tempNode.score > maybeNode.score && (maybeNode = tempNode);
      if (++index >= 3) {
        break;
      }
    }
    tempNode = tempNode.parentElement;
  }
}
maybeNode && (maybeNode.style.border = '1px solid red');
```

### 如何实现一套更优的算法

正如上面所说，不同的算法都含有一定的缺点。我们如何实现一套更好的算法呢 ？

目前只有 Readability 的表现可圈可点，因此我们基于 Readability 来做思考

单页应用？图片类网页？iframe 类网页？

