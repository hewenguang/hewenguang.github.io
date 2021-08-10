---
title: '分栏阅读'
date: 2021-08-10 10:12:10
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
分栏阅读给你杂志一般的阅读体验，大屏幕用户的福利。借助于 Circle 的分栏阅读功能，你可以在大屏幕上多栏阅读网页。小屏幕下由于图片的存在（尤其是长图），导致排版效果不佳，所以推荐大屏幕用户开启，看小说、听小说必备

![Circle 阅读助手 v2.1.0 加入分栏阅读](https://ranhe.xyz/post-images/releasev210.png)

## 如何开启 Circle 阅读助手的分栏阅读？

点击工具栏（页面右侧一排按钮）类似齿轮的按钮打开设置面板，展开“布局”设置。如下图：

![Circle阅读助手分栏目阅读](https://ranhe.xyz/post-images/1628561627990.png)

打开“分栏阅读“右侧的开关，此时下面的栏数和栏间距也变成可用状态。开启后刷新下即可进入多栏阅读，除了默认的两栏，你还可以自定义想要的栏目数。

## 我的屏幕很宽，Circle 的页面宽度有限？

分栏阅读适用于大屏幕的用户，屏幕越大，效果越好（图片的存在）。如果你的屏幕是带鱼屏等非常大的屏幕，而 Circle 的“页面宽度”范围受限，你可以使用自定义 css 修改 Circle的宽度，如下：

.root .container {
   max-width: 90%;
}

复制以上代码到自定义 css 的编辑框后刷新页面进入 Circle 即可。其中 max-width: 90%; 的 90% 你可以改成任何你想要的数值。如下：

![Circle阅读助手自定义 css](https://ranhe.xyz/post-images/1628561655131.png)