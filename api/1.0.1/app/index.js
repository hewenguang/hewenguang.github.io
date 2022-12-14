/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../circle/config/field.js":
/*!*********************************!*\
  !*** ../circle/config/field.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "sc": () => (/* binding */ sc),
/* harmony export */   "cx": () => (/* binding */ cx)
/* harmony export */ });
var sc = {
  map: 'shortcut',
  field: 'shortcut-enabled'
};
var cx = {
  field: 'contextmenu-enabled'
};

/***/ }),

/***/ "../circle/core/articleParser.js":
/*!***************************************!*\
  !*** ../circle/core/articleParser.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "../circle/core/is.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../circle/core/utils.js");


var MINI_TEXTNODE_LENGTH = 10;
var MINI_ARTICLE_AREA = 172000;
var NODE_NOT_PARENT = /span|p/i;
var MAYBE_LIKE_ELEMENTS = /body|hentry|main/i; //section https://mp.weixin.qq.com/s/zbcMXoJLG2ied3Ei82noaA
//td -> https://www.kanunu8.com/files/yuanchuang/201103/1792/43852.html

var NODE_MAYBE_PARENT = /div|article|body|main|td/i; // body https://www.cnblogs.com/Wayou/p/js_audio_recorder.html

var LIKE_ELEMENTS = /article|body|post|content|entry/i;
var TEXTNODE_PUNCTUATIONS = /：|。|；|，|,|\.|\?|、|“|“/;
var NOISE_ELEMENTS = /comment|meta|replies|reply|footer|footnote|noise/;
var BASIC_FEATURES_ELEMENTS = ['table']; // body 会导致失败 https://www.marxists.org/chinese/linbiao/mia-chinese-linbiao-193711.htm

var TEXTNODE_TAG_TO_IGNORE = ['a', 'style', 'script', 'button'];
var ENHANCED_FEATURES_ELEMENTS = ['h2', 'h3', 'h4', 'h5', 'h6', 'td', 'pre', 'em', 'strong'];
var UNLIKE_ROLES = ['feed', 'menu', 'menubar', 'dialog', 'alert', 'alertdialog', 'navigation', 'complementary'];

function parents(node) {
  var maxAncestor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var condition = arguments.length > 2 ? arguments[2] : undefined;
  var i = 0;
  var tempNode = node.parentElement;
  var ancestors = [];

  while (tempNode && !(0,_is__WEBPACK_IMPORTED_MODULE_0__.isTag)(tempNode, 'html')) {
    if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isFunction)(condition) && condition(tempNode, i)) {
      ancestors.push(tempNode);

      if (++i >= maxAncestor) {
        break;
      }
    }

    tempNode = tempNode.parentElement;
  }

  return ancestors;
}

function highestScore(node, score, callback) {
  // 只对第一层做判断 https://www.guancha.cn/Edward-Luce/2017_09_16_427358.shtml
  (0,_utils__WEBPACK_IMPORTED_MODULE_1__.each)(parents(node, 4, function (item, itemIndex) {
    if (itemIndex <= 0) {
      // LIKE_ELEMENTS.test(`${item.className} ${item.id}`) https://page.om.qq.com/page/OLK3MWsrtVhiV3fPVfxqSGDQ0
      return NODE_MAYBE_PARENT.test(item.nodeName) || LIKE_ELEMENTS.test("".concat(item.className, " ").concat(item.id));
    } else {
      return !NODE_NOT_PARENT.test(item.nodeName);
    }
  }), function (parent, level) {
    // console.log('--->', parent);
    if (UNLIKE_ROLES.includes((0,_utils__WEBPACK_IMPORTED_MODULE_1__.getAttr)(parent, 'role'))) {
      return;
    }

    var matchString = "".concat(parent.className, " ").concat(parent.id);

    if (NOISE_ELEMENTS.test(matchString)) {
      return;
    } // console.log('---- node --> ', node, parent, level);


    var matchStringWidthNodeName = "".concat(parent.tagName, " ").concat(matchString);

    if (LIKE_ELEMENTS.test(matchStringWidthNodeName)) {
      score += level <= 0 ? 10 : 2;
    }

    if (MAYBE_LIKE_ELEMENTS.test(matchStringWidthNodeName)) {
      score += level <= 0 ? 5 : 1;
    }

    !(0,_is__WEBPACK_IMPORTED_MODULE_0__.isNumber)(parent.score) && (parent.score = 0);
    parent.score += score / (level < 2 ? level + 2 : level * 3); // parent.setAttribute('p-score', parent.score);

    callback && callback(parent);
  });
}

function calculateImgScore(node) {
  var score = 0;

  if (!(0,_utils__WEBPACK_IMPORTED_MODULE_1__.visible)(node)) {
    return score;
  }

  var width = node.width;
  var height = node.height;
  var naturalWidth = node.naturalWidth;
  var naturalHeight = node.naturalHeight;

  if (width > 500 && height > 300 && naturalWidth > 800 && naturalHeight > 500) {
    score += (naturalWidth > naturalHeight ? naturalWidth : naturalHeight) / 500;
  } // node.setAttribute('p-score', score);


  return score;
}

function calculateNodeScore(node) {
  var score = 1;
  var text = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.nodeText)(node);
  score += text.split(TEXTNODE_PUNCTUATIONS).length;
  score += Math.min(Math.floor((0,_utils__WEBPACK_IMPORTED_MODULE_1__.length)(text) / 100), 3); // 加强文本特征

  var elementName = ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isTextNode)(node) ? node.parentElement : node).nodeName.toLowerCase();

  if (BASIC_FEATURES_ELEMENTS.includes(elementName)) {
    score += 1;
  }

  if (ENHANCED_FEATURES_ELEMENTS.includes(elementName)) {
    score += 2;
  }

  node.score = score;
  return node.score;
}

function empty(children) {
  var counter = 0;
  (0,_utils__WEBPACK_IMPORTED_MODULE_1__.each)(children, function (node) {
    node.childNodes.length > 0 && counter++;
  });
  return counter === 1;
}

function filterNode(node) {
  var current = node;

  while (current) {
    var _parent = current.parentElement;

    if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isTag)(_parent, 'span') || _parent.childElementCount <= 0 || empty(_parent.children)) {
      current = _parent;
    } else {
      break;
    }
  }

  return current;
}

function getSelector(node) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var id = node.id;

  if (id) {
    return "#".concat(id);
  }

  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isTag)(node, 'body')) {
    return 'body';
  }

  var value = "> ".concat((0,_utils__WEBPACK_IMPORTED_MODULE_1__.toLower)(node.tagName));
  index <= 1 && node.classList.length > 0 && (value += ".".concat(Array.prototype.slice.call(node.classList).join('.')));
  var parentElement = node.parentElement;

  if (parentElement) {
    return getSelector(parentElement, index + 1) + ' ' + value;
  } else {
    return value;
  }
}

function parent(node, target) {
  for (; node; node = node.parentElement) {
    if (node.contains(target)) {
      return node;
    }
  }
}

function sibling(node, context) {
  // console.log('node --->', node);
  if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(node)) {
    return node;
  }

  var value = getSelector(node); // console.log('selecotr --->', value);

  if (!value || !/\.|#/.test(value)) {
    return node;
  } // https://www.lzgzw.com/lzgread/43712_37012635.html


  var path = value.split('>');

  if (path.length > 0 && !/\.|#/.test(path.pop())) {
    return node;
  }

  var list = [];

  try {
    list = context.querySelectorAll(value);
  } catch (e) {// console.log('catch -->', e);
  } // console.log(list);
  // 2 --> https://godbasin.github.io/2019/11/09/wxapp-global-data-behavior/#


  if (list.length <= 2) {
    return node;
  }

  var parents = parent(list[0], list[1]);

  if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(parents)) {
    return node;
  }

  parents.mirrorParent = true;
  return parents;
}

var selector;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(context) {
  var maybeNode;

  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isString)(selector)) {
    maybeNode = context.querySelector(selector);

    if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(maybeNode)) {
      return maybeNode;
    }

    selector = null;
  }

  var maybeScore = 0;
  var textCounter = 0; // 图片加权

  context.body && (0,_utils__WEBPACK_IMPORTED_MODULE_1__.each)(context.body.querySelectorAll('img'), function (node) {
    var score = calculateImgScore(node);

    if (score <= 0) {
      return;
    }

    textCounter++;
    highestScore(node, score);
  }); // 文本加权

  var paragraph = [];
  context.body && (0,_utils__WEBPACK_IMPORTED_MODULE_1__.eachText)(context.body, function (node) {
    var element = node.parentElement;

    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_1__.visible)(element)) {
      return;
    }

    var elementName = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.toLower)(element.nodeName);

    if (TEXTNODE_TAG_TO_IGNORE.includes(elementName)) {
      return;
    }

    var text = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.nodeText)(node);

    if (text.split(TEXTNODE_PUNCTUATIONS).length <= 2) {
      return;
    }

    var size = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.length)(text);

    if (ENHANCED_FEATURES_ELEMENTS.includes(elementName) && size > 4) {
      return true;
    }

    if (size < MINI_TEXTNODE_LENGTH) {
      return;
    }

    return true;
  }, function (node) {
    paragraph.push(filterNode(node));
  });
  paragraph.length <= 2 && (0,_utils__WEBPACK_IMPORTED_MODULE_1__.each)(context.body.querySelectorAll('p'), function (node) {
    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_1__.visible)(node)) {
      return;
    }

    var elementName = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.toLower)(node.nodeName);

    if (TEXTNODE_TAG_TO_IGNORE.includes(elementName)) {
      return;
    }

    var text = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.nodeText)(node);

    if (text.split(TEXTNODE_PUNCTUATIONS).length <= 2) {
      return;
    }

    var size = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.length)(text);

    if (size < MINI_TEXTNODE_LENGTH) {
      return;
    }

    paragraph.push(node);
  });

  if (paragraph.length <= 0) {
    return;
  }

  var maybeNodes = [];
  (0,_utils__WEBPACK_IMPORTED_MODULE_1__.each)(paragraph, function (node) {
    var score = calculateNodeScore(node);

    if (score <= 0) {
      return;
    }

    textCounter++;
    highestScore(node, score, function (item) {
      !maybeNodes.includes(item) && maybeNodes.push(item);
    });
  });
  var sortNodes = maybeNodes.sort(function (prev, next) {
    return prev.score - next.score;
  });
  maybeNode = sortNodes.pop();
  var secondNode = sortNodes.pop();

  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(secondNode)) {
    // https://walnut.hedwig.pub/i/wo-de-gong-ju-guan-2021
    !LIKE_ELEMENTS.test("".concat(maybeNode.tagName, " ").concat(maybeNode.className)) && LIKE_ELEMENTS.test("".concat(secondNode.tagName, " ").concat(secondNode.className)) && (maybeNode = secondNode);
  }

  if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(maybeNode)) {
    return;
  }

  maybeScore = maybeNode.score;
  var size = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.length)((0,_utils__WEBPACK_IMPORTED_MODULE_1__.nodeText)(maybeNode)); // 文本多的情况下降低限制

  var limitCounter = size > 200 ? 1 : 3;

  if (!maybeNode || maybeScore < 30 || textCounter < limitCounter || size < 100) {
    // console.log('--article-', textCounter, maybeScore, maybeNode, size);
    return;
  } // markdown https://www.kancloud.cn/digest/pieces-algorithm/163624


  if (maybeNode.querySelectorAll('*').length <= 0 && size > 5000) {
    maybeNode.classList.add('noise');
    return;
  }

  var rect = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.position)(maybeNode); // 宽高比例会导致大屏失败

  if (rect.width * rect.height < MINI_ARTICLE_AREA) {
    // console.log('-rect--', rect, maybeNode);
    maybeNode.classList.add('noise');
    return;
  }

  var parentElement = maybeNode.parentElement;

  if (!parentElement) {
    maybeNode.classList.add('noise');
    return;
  }

  var parentRect = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.position)(parentElement); // 溢出判断 https://www.youtube.com/watch?v=Rviv0IUxYD4(需要判断父级和祖父级)
  // console.log('-overflow--', parentRect, rect, parentRect.width * parentRect.height);
  // if(parentRect.width * parentRect.height < articleArea){
  //   // 继续浮动判断
  //   console.log('-overflow--', parentRect, maybeNode, parentElement);
  //   if(!['left', 'right'].includes(getComputedStyle(maybeNode).float)){
  //     // console.log('-overflow--', parentRect, maybeNode, parentElement);
  //     maybeNode.classList.add('noise');
  //     return;
  //   }
  // }
  // 300 需要判断小屏幕

  if (context.documentElement.offsetWidth > 800 && (rect.width < 300 || parentRect.width < 300)) {
    // console.log('-lt 300--', rect, parentRect);
    maybeNode.classList.add('noise');
    return;
  }

  var divs = maybeNode.getElementsByTagName('div'); // div 少不做链接判断

  if (divs.length < 2) {
    var _article = sibling(maybeNode, context);

    selector = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getCSSSelector)(_article);
    return _article;
  } // 对链接密度做限制


  var links = maybeNode.getElementsByTagName('a'); // 维基百科 0.31 左右

  if (links.length > 16 && (0,_utils__WEBPACK_IMPORTED_MODULE_1__.linkDensity)(maybeNode) > 0.35) {
    // console.log('linkDensity --->', links.length, linkDensity(maybeNode));
    return;
  }

  var article = sibling(maybeNode, context);
  selector = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getCSSSelector)(article);
  return article;
}

/***/ }),

/***/ "../circle/core/coverParser.js":
/*!*************************************!*\
  !*** ../circle/core/coverParser.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "../circle/core/is.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../circle/core/utils.js");


var selector;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(context, article) {
  var maybeNode;

  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isString)(selector)) {
    maybeNode = context.querySelector(selector);

    if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(maybeNode)) {
      return maybeNode;
    }

    selector = null;
  }

  var nodes = context.body.getElementsByTagName('img');

  if (nodes.length <= 0) {
    return;
  }

  var articleRect = article.getBoundingClientRect();
  var articleRectTop = articleRect.top;
  var maybeCovers = [];
  (0,_utils__WEBPACK_IMPORTED_MODULE_1__.each)(nodes, function (node) {
    if (!(0,_utils__WEBPACK_IMPORTED_MODULE_1__.visible)(node)) {
      return;
    }

    var rect = node.getBoundingClientRect();

    if (rect.top >= articleRectTop) {
      return;
    } // https://www.infoq.cn/article/m30vgkxw9alvzo9czoay


    rect.width / rect.height < 5 && rect.width > articleRect.width * 0.8 && maybeCovers.push(node);
  });

  if (maybeCovers.length <= 0) {
    return;
  }

  maybeNode = maybeCovers.pop();
  selector = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getCSSSelector)(maybeNode);
  return maybeNode;
}

/***/ }),

/***/ "../circle/core/parser.js":
/*!********************************!*\
  !*** ../circle/core/parser.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "parser": () => (/* binding */ parser),
/* harmony export */   "timeParser": () => (/* reexport safe */ _timeParser__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "titleParser": () => (/* reexport safe */ _titleParser__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "coverParser": () => (/* reexport safe */ _coverParser__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "articleParser": () => (/* reexport safe */ _articleParser__WEBPACK_IMPORTED_MODULE_3__["default"])
/* harmony export */ });
/* harmony import */ var _timeParser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./timeParser */ "../circle/core/timeParser.js");
/* harmony import */ var _titleParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./titleParser */ "../circle/core/titleParser.js");
/* harmony import */ var _coverParser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./coverParser */ "../circle/core/coverParser.js");
/* harmony import */ var _articleParser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./articleParser */ "../circle/core/articleParser.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils */ "../circle/core/utils.js");
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./is */ "../circle/core/is.js");






var MAX_DISTANCE_FROM_TOP = 1800;
var MINI_DISTANCE_ARTICLE_AND_TITLE = 600;

function adjust(title, article) {
  if (!(0,_is__WEBPACK_IMPORTED_MODULE_5__.isElement)(article)) {
    return true;
  } // 导读导致距离太远 https://www.guancha.cn/wuxu2/2021_04_12_587052.shtml


  if (/article|post|content/i.test("".concat(article.className, " ").concat(article.id))) {
    return true;
  }

  if (article.contains(title)) {
    return true;
  }

  var titleRect = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.position)(title);
  var articleRect = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.position)(article);

  if (Math.abs(articleRect.top - (titleRect.top + titleRect.height / 2)) < MINI_DISTANCE_ARTICLE_AND_TITLE) {
    return true;
  }
}

function start(context, article) {
  var title = (0,_titleParser__WEBPACK_IMPORTED_MODULE_1__["default"])(context, article);
  var cover = (0,_coverParser__WEBPACK_IMPORTED_MODULE_2__["default"])(context, article);
  var url = context.URL.startsWith('http') ? context.URL : location.href; // console.log('---parser', article, title, url);

  if (!(0,_is__WEBPACK_IMPORTED_MODULE_5__.isElement)(title)) {
    return {
      url: url,
      cover: cover,
      article: article,
      time: (0,_timeParser__WEBPACK_IMPORTED_MODULE_0__["default"])(context, article),
      title: context.title ? context.title.replace(/(.*)[|\-\\/>»] .*/gi, '$1') : ''
    };
  } // 水平距离判断 https://huajiakeji.com/accessibility/2019-08/1001.html


  var titleRect = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.position)(title);
  var articleRect = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.position)(article);

  if (Math.abs(articleRect.left - titleRect.left) >= articleRect.width) {
    return {
      url: url,
      cover: cover,
      article: article,
      time: (0,_timeParser__WEBPACK_IMPORTED_MODULE_0__["default"])(context, article),
      title: context.title ? context.title.replace(/(.*)[|\-\\/>»] .*/gi, '$1') : ''
    };
  }

  var maybeArticle = article;

  while (!adjust(title, maybeArticle)) {
    if ((0,_is__WEBPACK_IMPORTED_MODULE_5__.isTag)(maybeArticle, 'body')) {
      break;
    }

    maybeArticle = maybeArticle.parentElement;
  }

  return {
    url: url,
    title: title,
    cover: cover,
    article: maybeArticle,
    time: (0,_timeParser__WEBPACK_IMPORTED_MODULE_0__["default"])(context, article, title)
  };
}

function bootstrap(context, action) {
  var article = (0,_articleParser__WEBPACK_IMPORTED_MODULE_3__["default"])(context);

  if (!(0,_is__WEBPACK_IMPORTED_MODULE_5__.isElement)(article)) {
    return;
  }

  var articleRect = (0,_utils__WEBPACK_IMPORTED_MODULE_4__.position)(article);

  if (action !== 'nextpage' && articleRect.top > MAX_DISTANCE_FROM_TOP) {
    // console.log('--fail--', maybeNode, rect.top, MAX_DISTANCE_FROM_TOP, rect);
    article.classList.add('noise');
  } else {
    return article;
  }
}

function openFolder(context) {
  if (!context || !context.body) {
    return;
  }

  (0,_utils__WEBPACK_IMPORTED_MODULE_4__.each)(context.body.querySelectorAll(['[id*="more"]', '[class*="more"]'].join(',')), function (node) {
    var target = node;

    if (!(0,_is__WEBPACK_IMPORTED_MODULE_5__.isTag)(node, 'a')) {
      target = node.querySelector('a');
    }

    if (!(0,_is__WEBPACK_IMPORTED_MODULE_5__.isTag)(target, 'a') || !/阅读全文|readmore/.test(target.innerText)) {
      return;
    }

    var href = target.href;

    if (!href || href.startsWith('javascript')) {
      target && target.click && target.click();
    }
  });
}

var retry = 0;

function parser(context, callback, action) {
  openFolder(context); // 展开可能存在的更多文章

  var article = bootstrap(context, action);

  if ((0,_is__WEBPACK_IMPORTED_MODULE_5__.isElement)(article)) {
    retry = 0;
    callback(start(context, article));
  } else {
    setTimeout(function () {
      if (retry < 5) {
        retry++;
        parser(context, callback, action);
      } else {
        retry = 0;
        callback();
      }
    }, 500);
  }
}



/***/ }),

/***/ "../circle/core/ready.js":
/*!*******************************!*\
  !*** ../circle/core/ready.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(callback) {
  if (document.readyState === 'complete') {
    callback();
    return;
  }

  var timer;

  function done(event) {
    if (event && event.type && event.type == 'readystatechange' && document.readyState != 'complete') {
      return;
    }

    timer && clearTimeout(timer);
    document.removeEventListener('DOMContentLoaded', done, false);
    document.removeEventListener('readystatechange', done, false);
    callback();
  }

  function wait() {
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      if (!document.body) {
        wait();
      } else {
        done();
      }
    }, 4000);
  }

  document.addEventListener('DOMContentLoaded', done, false);
  document.addEventListener('readystatechange', done, false);
  wait();
}

/***/ }),

/***/ "../circle/core/timeParser.js":
/*!************************************!*\
  !*** ../circle/core/timeParser.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "../circle/core/is.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../circle/core/utils.js");


var MAYBE_TIME_KEY = /pubdate|publish|dateline/i;
var MAYBE_TIME_VALUE = /(20\d{2}([.\-/|年月\s]{1,3}\d{1,2}){2}日?(\s?\d{2}:\d{2}(:\d{2})?)?)|(\d{1,5}\s?(分钟|小时|天)前)/gi;

function findNode(node, callback) {
  var current = node;
  var sibling = callback(current);

  while (!sibling && current) {
    current = current.parentElement;
    sibling = callback(current);
  }

  return sibling;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(context, article, title) {
  var time;
  context.head && (0,_utils__WEBPACK_IMPORTED_MODULE_1__.each)(context.head.getElementsByTagName('meta'), function (node) {
    var content = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getAttr)(node, 'content'); // 不存在或者没有数字

    if (!content || !/\d+/.test(content)) {
      return;
    }

    var name = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getAttr)(node, 'name');
    var property = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getAttr)(node, 'property');
    MAYBE_TIME_KEY.test(name) && MAYBE_TIME_KEY.test(property) && (time = content);
  });

  if (time) {
    return time;
  }

  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(title)) {
    var node = findNode(title, function (item) {
      return item.nextElementSibling;
    });

    if (node === article) {
      return;
    }

    var text = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.nodeText)(node);
    var timeArray = text.match(MAYBE_TIME_VALUE);

    if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isArray)(timeArray)) {
      return timeArray[0];
    }
  } else {
    var _node = findNode(article, function (item) {
      return item.previousElementSibling;
    });

    var _text = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.nodeText)(_node);

    var _timeArray = _text.match(MAYBE_TIME_VALUE);

    if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isArray)(_timeArray)) {
      return _timeArray[0];
    }
  }
}

/***/ }),

/***/ "../circle/core/titleParser.js":
/*!*************************************!*\
  !*** ../circle/core/titleParser.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ "../circle/core/is.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../circle/core/utils.js");


var MINI_FONT_SIZE = 12;
var MINI_COMMON_TEXT_LENGTH = 3;
var TITLE_SELECTOR = ['h1', 'h2'];
var MAYBE_TITLE_SELECTOR = ['h1', 'h2', 'h3', '[id*="title"]', '[id*="Title"]', '[class*="title"]', '[class*="Title"]', '[id*="headline"]', '[class*="headline"]'];

function filterNode(node, articleRect) {
  if (!(0,_utils__WEBPACK_IMPORTED_MODULE_1__.visible)(node)) {
    return true;
  }

  var nodeRect = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.position)(node);
  var distanceX = Math.abs(articleRect.left - nodeRect.left);
  var distanceY = articleRect.top - nodeRect.top; // console.log('title', distanceX, distanceY, node);
  // 标题在内容区域且存在补白，如：https://page.om.qq.com/page/OLK3MWsrtVhiV3fPVfxqSGDQ0
  // 600 -》 https://www.sobiquge.com/book/34954/114863.html

  if (distanceX > 100 || distanceY > 600 || distanceY < -60) {
    // -60 是标题在内容中
    return true;
  } // 标题需要在一个合理的长度才认为有效


  var text = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.nodeText)(node);

  if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.length)(text) > 100 || (0,_utils__WEBPACK_IMPORTED_MODULE_1__.length)(text) <= 4) {
    return true;
  } // console.log('text ----> ', text);


  var nodeStyle = window.getComputedStyle(node);
  var maybeFontSize = parseInt(nodeStyle.fontSize);
  var fontSize = (0,_is__WEBPACK_IMPORTED_MODULE_0__.isNumber)(maybeFontSize) ? maybeFontSize : MINI_FONT_SIZE;

  if (fontSize <= MINI_FONT_SIZE) {
    return true;
  }

  if (node.getElementsByTagName('a').length > 1) {
    return true;
  }

  return false;
}

function commonText(str1, str2) {
  if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isString)(str1) || !(0,_is__WEBPACK_IMPORTED_MODULE_0__.isString)(str2) || str1.length < 0 || str2.length < 0) {
    return '';
  }

  if (str1.length > str2.length) {
    var temp = str1;
    str1 = str2;
    str2 = temp;
  }

  var len1 = str1.length;

  for (var j = len1; j > 0; j--) {
    for (var i = 0; i < len1 - j; i++) {
      var current = str1.substr(i, j + 1);

      if (str2.indexOf(current) >= 0) {
        return current;
      }
    }
  }

  return '';
}

function getPrevious(node) {
  var index = 0;
  var elements = [];
  var current = node;

  while (index < 2 && current) {
    var previousElement = current.previousElementSibling;

    if (previousElement) {
      if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.visible)(previousElement)) {
        elements.push(previousElement);
        index++;
      }

      current = previousElement;
    } else {
      var parentElement = current.parentElement;

      if (parentElement) {
        var parentPreviousElement = parentElement.previousElementSibling;

        if (parentPreviousElement) {
          if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.visible)(parentPreviousElement)) {
            elements.push(parentPreviousElement);
            index++;
          }

          current = parentPreviousElement;
        } else {
          break;
        }
      } else {
        break;
      }
    }
  }

  if (elements.length <= 0) {
    return;
  }

  var items = [];
  (0,_utils__WEBPACK_IMPORTED_MODULE_1__.each)(elements, function (element) {
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.eachText)(element, function (item) {
      var parent = item.parentElement;

      if (!(0,_utils__WEBPACK_IMPORTED_MODULE_1__.visible)(parent)) {
        return;
      }

      return true;
    }, function (item) {
      var parent = item.parentElement;
      !items.includes(parent) && items.push(parent);
    });
  });
  return items;
}

var selector;
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(context, article) {
  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isString)(selector)) {
    var _maybeNode = context.querySelector(selector);

    if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(_maybeNode)) {
      return _maybeNode;
    }

    selector = null;
  }

  var maybeTitles = []; // 标题规则（直接找正文顶部，指定范围不存在再去执行之前的逻辑） 100 -200 h1 h2

  var articleRect = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.position)(article);
  (0,_utils__WEBPACK_IMPORTED_MODULE_1__.each)(context.body.querySelectorAll(TITLE_SELECTOR.join(',')), function (node) {
    if (filterNode(node, articleRect)) {
      return;
    }

    maybeTitles.push(node);
  });

  if (maybeTitles.length === 1 && (0,_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(maybeTitles[0])) {
    selector = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getCSSSelector)(maybeTitles[0]);
    return maybeTitles[0];
  }

  var title = context.title;

  if (!title) {
    // https://mp.weixin.qq.com/s/Q9YR9AAL6iFTNN0V6T_snQ
    // console.log('---titile empty');
    return;
  } // 常规查询


  var maybeNode;
  var maxSize = 0;
  maybeTitles = [];
  (0,_utils__WEBPACK_IMPORTED_MODULE_1__.each)(context.body.querySelectorAll(MAYBE_TITLE_SELECTOR.join(',')), function (node) {
    if (filterNode(node, articleRect)) {
      return;
    }

    maybeTitles.push(node); // 标题需要在一个合理的长度才认为有效

    var text = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.nodeText)(node);
    var size = commonText(title, text).length;

    if (size < MINI_COMMON_TEXT_LENGTH) {
      return;
    }

    if (maxSize < size) {
      maxSize = size;
      maybeNode = node;
    }
  });

  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(maybeNode)) {
    selector = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getCSSSelector)(maybeNode);
    return maybeNode;
  } //todo 计算位置信息 https://jelly.jd.com/article/6006b1045b6c6a01506c87f2  


  if (maybeTitles.length === 1) {
    selector = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getCSSSelector)(maybeTitles[0]);
    return maybeTitles[0];
  }

  maxSize = 0;
  (0,_utils__WEBPACK_IMPORTED_MODULE_1__.each)(maybeTitles, function (node) {
    var fontSize = Number.parseInt(document.defaultView.getComputedStyle(node, null).getPropertyValue('font-size'), 10);

    if (fontSize > maxSize) {
      maxSize = fontSize;
      maybeNode = node;
    }
  });

  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(maybeNode)) {
    selector = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getCSSSelector)(maybeNode);
    return maybeNode;
  }

  var elements = getPrevious();

  if (!(0,_is__WEBPACK_IMPORTED_MODULE_0__.isArray)(elements)) {
    return;
  }

  maxSize = 0;
  (0,_utils__WEBPACK_IMPORTED_MODULE_1__.each)(elements, function (node) {
    if (filterNode(node, articleRect)) {
      return;
    }

    var fontSize = Number.parseInt(document.defaultView.getComputedStyle(node, null).getPropertyValue('font-size'), 10);

    if (fontSize > maxSize) {
      maxSize = fontSize;
      maybeNode = node;
    }
  });

  if ((0,_is__WEBPACK_IMPORTED_MODULE_0__.isElement)(maybeNode)) {
    selector = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getCSSSelector)(maybeNode);
    return maybeNode;
  }
}

/***/ }),

/***/ "../circle/module/app/client/client.class.js":
/*!***************************************************!*\
  !*** ../circle/module/app/client/client.class.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Client)
/* harmony export */ });
/* harmony import */ var circle_config_field__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! circle/config/field */ "../circle/config/field.js");
/* harmony import */ var circle_core_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! circle/core/parser */ "../circle/core/parser.js");
/* harmony import */ var circle_core_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! circle/core/utils */ "../circle/core/utils.js");
/* harmony import */ var circle_core_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! circle/core/dom */ "../circle/core/dom.js");
/* harmony import */ var circle_core_is__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! circle/core/is */ "../circle/core/is.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }







var Client = /*#__PURE__*/function () {
  function Client(app) {
    _classCallCheck(this, Client);

    this.app = app;
  }

  _createClass(Client, [{
    key: "bootstrap",
    value: function bootstrap() {
      var app = this.app;
      app.fire('bootstrap-before'); // 数据量太大直接放弃 http://www.shtong.gov.cn/Newsite/node2/node2247/node4561/index.html

      if (document.body && document.body.querySelectorAll('*').length > 12000) {
        return;
      }

      var type = document.contentType;

      if (type.indexOf('text/html') >= 0) {
        app.load('parser');
      } else if (type.indexOf('text/plain') >= 0 || type.indexOf('text/markdown') >= 0) {
        app.load('plain');
      }

      app.fire('bootstrap-after');
    }
  }, {
    key: "render",
    value: function render(callback) {
      var app = this.app;
      var node = app.cache('node');

      if (!node || !node.article) {
        callback && callback();
        return;
      }

      app.fire('render');
      app.load('render');
    }
  }, {
    key: "init",
    value: function init() {
      var _this = this;

      var app = this.app;
      app.on('visiblechange', function (visible) {
        if (!visible) {
          return;
        } // 快捷键恢复


        _this.blacklist(); // 黑名单恢复


        _this.shortcuts();
      });
      app.on('render-ready', function () {
        app.cache('pjax-changeurl', location.href);
        app.fire('send', 'pjax-start', {
          hostname: location.hostname
        });
      });
      app.on('pjax-change', function () {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            request = _ref.request,
            callback = _ref.callback;

        callback && callback();

        if (!app.cache('pjax-changeurl') || app.cache('blacklisted')) {
          return;
        }

        if (!request || !request.url || request.url === app.cache('pjax-changeurl')) {
          return;
        }

        (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_2__.wait)(function () {
          app.fire('send', 'status', function () {
            (0,circle_core_parser__WEBPACK_IMPORTED_MODULE_1__.parser)(document, function (node) {
              if ((0,circle_core_is__WEBPACK_IMPORTED_MODULE_4__.isUndefined)(node)) {
                app.fire('loading', false);
                return;
              } // 清除记录


              app.cache('lastnodeurl', '');
              app.fire('send', 'status', {
                action: 'wait'
              });
              app.cache('node', node);
              app.fire('empty-anchor');
              app.fire('empty-page', function () {
                app.fire('render-page');
              });
            });
          });
        }, 1000);
      });
      app.on('srt-enter-or-exit', function () {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            callback = _ref2.callback;

        callback && callback();

        _this.render(function () {
          !!callback && app.fire('notice', {
            duration: 2,
            type: 'error',
            key: 'parser-error',
            message: app.i10n('parser_error')
          });
        });
      });
      app.on('action-browser', function () {
        var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            callback = _ref3.callback;

        callback && callback();
        var blacklisted = app.cache('blacklisted');

        if (blacklisted) {
          var self = _this;
          app.fire('notice', {
            duration: 0,
            key: 'remove-blacklist',
            btnText: app.i10n('remove'),
            message: app.i10n('remove_blacklist', location.href)
          }, function () {
            app.fire('send', 'roster', {
              table: 'blacklist',
              url: location.href,
              title: document.title
            }, function () {
              app.cache('blacklisted', false); // 默认启动

              if (app.cache('module_render')) {
                app.fire('render');
              } else {
                var _getHash = (0,circle_core_dom__WEBPACK_IMPORTED_MODULE_3__.getHash)('circle'),
                    hashs = _getHash.hashs;

                hashs.push('circle=on');
                (0,circle_core_dom__WEBPACK_IMPORTED_MODULE_3__.updateHash)(hashs);
                self.bootstrap();
              }
            });
          });
          return;
        }

        _this.render();
      }); // 黑/白名单

      (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_2__.each)(['whitelist', 'blacklist'], function (table) {
        app.on("roster-".concat(table), function () {
          var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              request = _ref4.request,
              callback = _ref4.callback;

          callback && callback();
          var site = request.site;
          var action = request.action;

          if (table === 'whitelist') {
            if (action === 'add') {
              var node = app.cache('node');

              if (node && node.article && !app.cache('running')) {
                app.fire('render-start');
                app.load('render');
              } else {
                app.fire('notice', {
                  key: table,
                  type: 'success',
                  message: app.i10n('success')
                });
              }

              app.fire('toolbar-keys', "whitelist".concat(site ? '-site' : ''), true); // 右键菜单触发初始化

              app.cache('toolbar-roster', "whitelist".concat(site ? '-site' : ''));
            } else {
              app.fire('notice', {
                key: table,
                type: 'success',
                message: app.i10n('success')
              });
              app.fire('toolbar-keys', "whitelist".concat(site ? '-site' : ''), false);
              app.cache('toolbar-roster', '');
            }
          } else {
            if (action === 'add') {
              if (app.cache('running')) {
                app.fire('render-destory');
              } else {
                app.fire('notice', {
                  key: table,
                  type: 'success',
                  message: app.i10n('success')
                });
              }

              app.cache('blacklisted', true);
              app.fire('send', 'status', {
                action: 'disable'
              });
            } else {
              app.cache('blacklisted', false);
              app.fire('send', 'status', {
                action: 'wait'
              });
              app.fire('notice', {
                key: table,
                type: 'success',
                message: app.i10n('refresh_to_active')
              });
            }
          }
        });
        app.on(table, function (url, title, id, callback) {
          var path = url || location.href;
          var value = title || document.title;
          var diff = location.host.length > 0 ? path.indexOf(location.host) < 0 : path !== location.href;
          app.fire('send', 'roster', {
            id: id,
            diff: diff,
            table: table,
            url: path,
            title: value
          }, function (_ref5) {
            var error = _ref5.error,
                data = _ref5.data;

            if (error) {
              callback && callback(error);
              return;
            }

            if (diff) {
              callback && callback();
            } else {
              app.fire("roster-".concat(table), {
                callback: callback,
                request: {
                  action: data,
                  site: path === value
                }
              });
            }
          });
        });
        app.on("srt-".concat(table), function () {
          app.fire(table);
        });
        app.on("srt-".concat(table, "-site"), function () {
          app.fire(table, location.hostname, app.i10n('entire_website'));
        });
      }); // 聚焦模式

      app.on('srt-focus', function () {
        var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            callback = _ref6.callback;

        callback && callback();
        app.fire('focus');
        app.load('focus');
      }); // 偏好设置

      ['srt-option', 'srt-message'].forEach(function (hook) {
        app.on(hook, function () {
          var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              callback = _ref7.callback;

          callback && callback();
          var url = location.href;
          var name = hook.split('-').pop();

          if ((0,circle_core_is__WEBPACK_IMPORTED_MODULE_4__.isString)(url) && url.startsWith('chrome')) {
            app.fire('send', "open-".concat(name));
          } else {
            var fireHook = name === 'option' ? 'wrench' : name;
            app.fire(fireHook);
            app.load(fireHook);
          }
        });
      });
    }
  }, {
    key: "blacklist",
    value: function blacklist(callback) {
      var app = this.app;
      app.fire('send', 'db', {
        execute: 'get',
        name: location.hostname,
        table: app.cache('table').bl
      }, function (_ref8) {
        var error = _ref8.error,
            _ref8$data = _ref8.data,
            data = _ref8$data === void 0 ? [] : _ref8$data;

        if (error) {
          app.fire('loading', false);
          app.fire('error', error);
          return;
        }

        var parser = true;
        var href = location.href.replace(/#.*$/, '');
        (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_2__.each)(data, function (item) {
          var url = item.url;

          if (url === href || href.split(url).length > 1) {
            parser = false;
            return true;
          }
        });

        if (parser) {
          callback && callback();
        } else {
          app.fire('loading', false);
          app.cache('blacklisted', true);
          app.fire('send', 'status', {
            action: 'disable'
          }); // 如果在黑名单直接退出

          app.fire('render-destory');
        }
      });
    }
  }, {
    key: "shortcuts",
    value: function shortcuts() {
      var _this2 = this;

      this.app.fire('send', 'db', {
        execute: 'get',
        name: circle_config_field__WEBPACK_IMPORTED_MODULE_0__.sc.field,
        table: this.app.cache('table').wc
      }, function (_ref9) {
        var error = _ref9.error,
            data = _ref9.data;

        if (error) {
          _this2.app.fire('error', error);
        } else {
          _this2.app.cache(circle_config_field__WEBPACK_IMPORTED_MODULE_0__.sc.field, !!data);
        }
      });
      this.app.fire('send', 'db', {
        execute: 'all',
        table: this.app.cache('table').sc
      }, function (_ref10) {
        var error = _ref10.error,
            data = _ref10.data;

        if (error) {
          _this2.app.fire('error', error);
        } else {
          if (!data) {
            return;
          }

          _this2.app.cache(circle_config_field__WEBPACK_IMPORTED_MODULE_0__.sc.map, data);
        }
      });
    }
  }]);

  return Client;
}();



/***/ }),

/***/ "../circle/module/app/index.js":
/*!*************************************!*\
  !*** ../circle/module/app/index.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var circle_core_ready__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! circle/core/ready */ "../circle/core/ready.js");
/* harmony import */ var _client_client_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./client/client.class */ "../circle/module/app/client/client.class.js");
/* harmony import */ var includes_app_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! includes/app/client */ "./src/includes/app/client.js");



Bridge.register('app', ['react', 'antd', 'notice'], function () {
  var app = this;
  var client = new _client_client_class__WEBPACK_IMPORTED_MODULE_1__["default"](app);
  client.init(); // 禁用当前页面

  app.fire('send', 'status'); // 启动应用

  client.blacklist(function () {
    (0,circle_core_ready__WEBPACK_IMPORTED_MODULE_0__["default"])(function () {
      client.bootstrap();
    });
  }); // 快捷键系统

  client.shortcuts(); // 控制器

  (0,includes_app_client__WEBPACK_IMPORTED_MODULE_2__["default"])(app); // 加载调试工具

  app.cache('debug') && app.load('debug');
});

/***/ }),

/***/ "./src/includes/app/client.js":
/*!************************************!*\
  !*** ./src/includes/app/client.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"module/app/index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkmini"] = self["webpackChunkmini"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["controller/common"], () => (__webpack_require__("../circle/module/app/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;