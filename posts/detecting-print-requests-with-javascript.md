---
title: '使用JavaScript检测打印请求'
date: 2021-04-17 14:04:43
tags: []
published: true
hideInList: false
feature: 
isTop: false
---
CSS具有受良好支持的机制，仅在用户打印文档（即打印样式表）时才应用更改。它们允许您通过应用仅对打印解释的规则来更改打印机网页的显示方式。这非常适合执行常见任务，例如隐藏不必要的内容，使用对打印更为友好的版式以及调整布局以更好地适合纸张的尺寸和形状。

![使用JavaScript检测打印请求](https://ranhe.xyz/post-images/1618640222844.png)

打印样式表非常适合进行打印的演示更改，但是有时您需要JavaScript的全部功能。为了响应JavaScript中的打印请求，您需要浏览器通知您发生了打印请求。

## onbeforeprint and onafterprint

IE5+  触发  onbeforeprint 和 onafterprint 将要打印的活动用户请求页面之前和之后。

```
window.onbeforeprint = function() {
  console.log('This will be called before the user prints.');
};
window.onafterprint = function() {
  console.log('This will be called after the user prints');   
};
```

这些事件不是任何规范的一部分，但它们非常方便。因此，Firefox在版本6中增加了对这两个事件的支持。但是，WebKit和Opera不支持事件。因此，出于跨浏览器兼容性的考虑，这些事件不会减少。

## WebKit的解决方案

WebKit那里有一个bug（＃19937）可以实现这些事件，但是进展已经停止，因为另一个API的实现已经使此功能成为可能 - window.matchMedia。

## window.matchMedia

window.matchMedia API提供了确定当前是否手段document给定匹配的媒体的查询。例如：

```
if (window.matchMedia(' (min-width: 600px) ').matches) {  
    console.log('The viewport is at least 600 pixels wide');
} else { 
    console.log('The viewport is less than 600 pixels wide');
} 
```

您还可以使用此API添加监听器，只要媒体查询的结果发生更改，监听器便会触发。在上面的示例中，matches 只要视口至少为600px宽，就会满足标准。如果您希望每当视口超过 600 像素阈值时都收到通知，则可以使用以下内容。

```
var mediaQueryList = window.matchMedia(' (min-width: 600px) ');
mediaQueryList.addListener(function(mql) {
    if (mql.matches) {
        console.log('The viewport is at least 600 pixels wide');
    } else {
        console.log('The viewport is less than 600 pixels wide');
    }
});
```

有趣的是，当用户请求打印文档时，您也可以使用相同的技术来监听正在应用的媒体：

```
var mediaQueryList = window.matchMedia('print');
mediaQueryList.addListener(function(mql) {
    if (mql.matches) {
        console.log('onbeforeprint equivalent');
    } else {
        console.log('onafterprint equivalent');
    }
});
```

这在Chrome 9+和Safari 5.1中非常有效（除了侦听器在Chrome中触发两次的事实）。但是，即使它们都支持，也不能在Firefox或IE10中使用window.matchMedia。

## 更新（2012年7月16日）

我在Firefox的问题跟踪器上针对此缺陷创建了一个错误-https: //bugzilla.mozilla.org/show_bug.cgi?id=774398。收到回复后，我将更新此帖子。

## 结合方法

如果将这两种方法结合使用，则可以在IE 5 +，Firefox 6 +，Chrome 9+和Safari 5.1+中检测打印请求（不幸的是Opera不支持这两种方法）。

```
(function() {
    var beforePrint = function() {
        console.log('Functionality to run before printing.');
    };
    var afterPrint = function() {
        console.log('Functionality to run after printing');
    };

    if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                beforePrint();
            } else {
                afterPrint();
            }
        });
    }

    window.onbeforeprint = beforePrint;
    window.onafterprint = afterPrint;
}());
```

请注意，您的事件处理程序可能必须处理以下事实：在Chrome中，每个打印请求将调用它们两次。

## 检测打印的场景

在大多数情况下，只需准备打印样式表即可准备要打印的文档。但是我可以想到JavaScript事件的几个实际用法。

### 响应式打印图像

一种用途是代替高质量的图像进行打印。传统上，Web浏览器以72dpi的分辨率显示图像，大多数打印机可以处理300dpi +的图像。尽管某些较新的设备能够以更高的分辨率显示图像，但大多数用户仍在使用以比打印机可处理的分辨率低得多的分辨率显示Web图像的屏幕。

因此，在用户的屏幕上看起来很好的图像在打印出来时可能看起来模糊且有颗粒感。对于大多数图像来说，这是可以接受的，但是对于定期打印的文档（例如公司徽标）上的突出图像，这可能是一个问题。您可能希望在打印出来时看起来清晰。

解决此问题的技术包括加载两个图像，默认情况下仅显示较低质量的图像，然后在打印样式表中隐藏低质量图像并显示高质量图像。这种方法的主要缺点是，无论是否要打印页面，最终用户都必须下载两个图像。3G设备上无意或无能力打印文档的用户仍然必须下载您的高分辨率 logo。

借助在JavaScript中检测打印请求的功能，您可以在用户请求打印页面时即时替换更高质量的图像。

```
<img src="low-quality.jpg" id="company_logo" alt="My Company" />

<script>
    (function() {
        var upgradeImage = function() {
            document.getElementById('company_logo')
                .setAttribute('src', 'high-quality.png'); 
        };

        if (window.matchMedia) {
            var mediaQueryList = window.matchMedia('print');
            mediaQueryList.addListener(upgradeImage);
        }

        window.onbeforeprint = upgradeImage;
    });
</script>
```

这种方法的好处是，从未打印过的用户将不必下载高质量的图像。该技术还可以很好地降低性能。使用不支持打印事件的浏览器的用户将只打印质量较低的图像。

### 跟踪打印请求

打印事件还可以用来跟踪用户在站点或应用程序中打印页面的次数。由于缺乏全面的浏览器支持，您无法捕获每个打印请求，但这足以使人们大致了解打印频率。

```
(function() {
    var afterPrint = function() {
        // Here you would send an AJAX request to the server to track that a page
        // has been printed.  You could additionally pass the URL if you wanted to
        // track printing across an entire site or application.
    };

    if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            if (!mql.matches) {
                afterPrint();
            }
        });
    }

    window.onafterprint = afterPrint;
}());
```

## 我可以在“真实”应用程序中使用它吗？

当然，只要确定您的操作对使用不会触发该事件的浏览器的用户而言性能会下降。

您还能想到在JavaScript中检测打印请求的其他实际用途吗？如果是这样，请在评论中让我知道。

## 更新（2012年7月16日）

根据评论，我发现除了上述所有错误外，某些浏览器还会（onafterprint或使用window.matchMedia处理程序实现）及早触发after print事件。

```
<!DOCTYPE html>
<html>
    <head>
        <script>
            var beforePrint = function() {
                document.getElementById('printImage').src = 
                    'http://stackoverflow.com/favicon.ico';
            };
            var afterPrint = function() {
                document.getElementById('printImage').src = 
                    'http://google.com/favicon.ico';
            };

            if (window.matchMedia) {
                var mediaQueryList = window.matchMedia('print');
                mediaQueryList.addListener(function(mql) {
                    if (mql.matches) {
                        beforePrint();
                    } else {
                        afterPrint();
                    }
                });
            }

            window.onbeforeprint = beforePrint;
            window.onafterprint = afterPrint;
        </script>
    </head>
    <body>
        <img id="printImage" src="http://google.com/favicon.ico" />
    </body>
</html>
```

在打印上述文档时，您实际上希望打印出Stack Overflow的图标，而实际上是在打印Google的图标。这两个事件均会触发，但打印后事件会在实际发生打印之前触发，在这种情况下，这会还原在打印前事件中所做的更改。

我能够在Chrome和Firefox中重新创建此问题。

因此，请勿执行任何依赖于“打印后”事件来修复“打印前”事件所做的事情。对于响应式打印图像，这应该不是问题，因为将高质量的图像保留在原处不会有任何危害。用户已经下载了它。

## 针对现代浏览器触发两次提供更精确的版本

```
function print(){
  let printBeforeTimer;
  let printAfterTimer;
  function beforePrint() {
    printBeforeTimer && clearTimeout(printBeforeTimer);
    printBeforeTimer = setTimeout(function(){
      // your code here before print
    }, 150);
  }
  function afterPrint() {
    printAfterTimer && clearTimeout(printAfterTimer);
    printAfterTimer = setTimeout(function(){
      // your code here after print
    }, 150);
  }
  // IE or Firfox
  window.addEventListener('beforeprint', beforePrint);
  window.addEventListener('afterprint', afterPrint);
  if (!window.matchMedia){
    return;
  }
  // other
  const mediaQueryList = window.matchMedia('print');
  mediaQueryList.addEventListener('change', function(mql) {
    if(mql.matches){
      beforePrint();
    } else {
      afterPrint();
    }
  });
}
```


