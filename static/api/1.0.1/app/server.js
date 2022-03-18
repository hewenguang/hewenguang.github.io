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

/***/ "../circle/module/app/server.js":
/*!**************************************!*\
  !*** ../circle/module/app/server.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _server_server_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./server/server.class */ "../circle/module/app/server/server.class.js");
/* harmony import */ var includes_app_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! includes/app/server */ "./src/includes/app/server.js");
/* harmony import */ var includes_app_installed__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! includes/app/installed */ "./src/includes/app/installed.js");



Bridge.register('app', ['database', 'wrench', 'message'], function () {
  var app = this;
  var server = new _server_server_class__WEBPACK_IMPORTED_MODULE_0__["default"](app);
  var installed = new includes_app_installed__WEBPACK_IMPORTED_MODULE_2__["default"](app);
  installed.init(function () {
    server.contextmenu();
  });
  server.init(); // 控制器

  (0,includes_app_server__WEBPACK_IMPORTED_MODULE_1__["default"])(app); // 看门狗

  app.on('watchdog', function (_ref) {
    var callback = _ref.callback;
    callback && callback();
    app.fire('cron', function (error) {
      if (error) {
        return;
      } // 消息中心


      app.fire('message'); // 自动更新

      app.fire('autoupdate');
    });
  }); // 初始化右键菜单

  server.contextmenu(app); // 自动更新逻辑

  !app.cache('debug') && app && app.management && app.management.getSelf(function (self) {
    self.installType === 'development' && app.load('autoupdate');
  });
});

/***/ }),

/***/ "../circle/module/app/server/server.class.js":
/*!***************************************************!*\
  !*** ../circle/module/app/server/server.class.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Server)
/* harmony export */ });
/* harmony import */ var circle_config_field__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! circle/config/field */ "../circle/config/field.js");
/* harmony import */ var includes_app_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! includes/app/config */ "./src/includes/app/config.js");
/* harmony import */ var circle_core_is__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! circle/core/is */ "../circle/core/is.js");
/* harmony import */ var circle_core_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! circle/core/utils */ "../circle/core/utils.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }






var Server = /*#__PURE__*/function () {
  function Server(app) {
    _classCallCheck(this, Server);

    this.app = app;
  }

  _createClass(Server, [{
    key: "init",
    value: function init() {
      this.init_hook();
      this.init_Api();
      this.init_pjax();
      this.init_event();
      !this.app.cache('debug') && this.init_analytics();
    }
  }, {
    key: "roster",
    value: function roster(table, host, url) {
      var self = this;
      var app = self.app;
      self.checkCtxItem("ctx-".concat(table), function () {
        app.fire('db', {
          request: {
            table: table,
            name: host,
            execute: 'get'
          },
          callback: function callback(error, data) {
            if (error) {
              return;
            }

            if (!(0,circle_core_is__WEBPACK_IMPORTED_MODULE_2__.isArray)(data)) {
              app.fire('ctx', {
                request: {
                  action: 'update',
                  id: "ctx-".concat(table),
                  title: app.i10n("add_".concat(table))
                }
              });
              return;
            }

            var exist;
            (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_3__.each)(data, function (item) {
              var match = item.url;

              if (match === url || url.split(match).length > 1) {
                exist = match;
                return true;
              }
            });
            var match = "add_".concat(table);

            if (exist) {
              var existLocation = (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_3__.getLocation)(exist);
              var singlePage = existLocation.pathname != '/';
              match = singlePage ? "remove_".concat(table) : "remove_site".concat(table);
            }

            app.fire('ctx', {
              request: {
                action: 'update',
                id: "ctx-".concat(table),
                title: app.i10n(match)
              }
            });
          }
        });
      });
    }
  }, {
    key: "updateRoster",
    value: function updateRoster(table) {
      var self = this;
      var app = self.app;
      self.checkCtxItem("ctx-".concat(table), function () {
        app.fire('ctx', {
          request: {
            action: 'update',
            id: "ctx-".concat(table),
            title: app.i10n("add_".concat(table))
          }
        });
      });
    }
  }, {
    key: "init_hook",
    value: function init_hook() {
      var _this = this;

      var app = this.app; // 黑/白名单

      app.on('roster', function () {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            request = _ref.request,
            _callback = _ref.callback;

        var id = request.id;
        var same = !request.diff;
        var table = request.table;
        var title = request.title;
        var url = request.url.replace(/#.*$/, '');
        var location = (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_3__.getLocation)(url);
        var host = location.host;
        app.fire('db', {
          request: {
            table: table,
            name: host,
            execute: 'get'
          },
          callback: function callback(error) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

            if (error) {
              _callback && _callback(error);
              return;
            }

            if (id) {
              app.fire('db', {
                request: {
                  table: table,
                  name: host,
                  execute: 'add',
                  value: data.map(function (item) {
                    if (item.url === id) {
                      return {
                        url: url,
                        title: title,
                        create: +new Date()
                      };
                    }

                    return item;
                  })
                },
                callback: function callback(error) {
                  _callback && _callback(error, 'update');
                  same && app.fire('update-roster', {
                    sender: {
                      url: url
                    }
                  });
                }
              });
            } else {
              var exist;
              (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_3__.each)(data, function (item) {
                var match = item.url;

                if (match === url || url.split(match).length > 1) {
                  exist = match;
                  return true;
                }
              }); // 删除操作

              if (exist) {
                if (data.length === 1) {
                  app.fire('db', {
                    request: {
                      table: table,
                      name: host,
                      execute: 'remove'
                    },
                    callback: function callback(error) {
                      _callback && _callback(error, 'remove');
                      same && app.fire('update-roster', {
                        sender: {
                          url: url
                        }
                      });
                    }
                  });
                } else {
                  app.fire('db', {
                    request: {
                      table: table,
                      name: host,
                      execute: 'add',
                      value: (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_3__.filter)(data, function (item) {
                        return item.url !== exist;
                      })
                    },
                    callback: function callback(error) {
                      _callback && _callback(error, 'remove');
                      same && app.fire('update-roster', {
                        sender: {
                          url: url
                        }
                      });
                    }
                  });
                }
              } else {
                // 新增操作
                data.push({
                  url: url,
                  title: title,
                  create: Date.now()
                });
                app.fire('db', {
                  request: {
                    table: table,
                    name: host,
                    value: data,
                    execute: 'add'
                  },
                  callback: function callback(error) {
                    _callback && _callback(error, 'add');
                    same && app.fire('update-roster', {
                      sender: {
                        url: url
                      }
                    });
                  }
                });
              }
            }
          }
        });
      });
      app.on('update-roster', function () {
        var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            sender = _ref2.sender,
            callback = _ref2.callback;

        callback && callback();

        _this.checkCtxStatus(function () {
          var originUrl = sender.url;

          if (!originUrl) {
            _this.updateRoster('whitelist');

            _this.updateRoster('blacklist');

            return;
          }

          var url = originUrl.replace(/#.*$/, '');
          var location = (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_3__.getLocation)(url);
          var host = location.host; // 更新白名单

          _this.roster('whitelist', host, url); // 更新黑名单


          _this.roster('blacklist', host, url);
        });
      }); // 内建页面

      ['open-option', 'open-message'].forEach(function (hook) {
        app.on(hook, function () {
          var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
              sender = _ref3.sender,
              callback = _ref3.callback;

          app.fire('tab', {
            sender: sender,
            callback: callback,
            request: {
              action: 'create',
              value: {
                url: app.runtime.getURL("view/".concat(hook.split('-').pop(), ".html"))
              }
            }
          });
        });
      }); // 右键菜单

      app.on('ctx-click', function (info, tab) {
        var url = info.pageUrl;
        var table = info.menuItemId.split('-').pop();

        switch (info.menuItemId) {
          case 'ctx-whitelist':
          case 'ctx-blacklist':
            app.fire('roster', {
              request: {
                table: table,
                title: tab.title,
                url: tab.url.replace(/#.*$/, '')
              },
              callback: function callback(error, action) {
                if (error) {
                  app.fire('error', error);
                } else {
                  // 通知前端
                  app.fire('send', "roster-".concat(table), {
                    tab: tab,
                    action: action
                  });
                }
              }
            });
            break;

          case 'ctx-focus':
            app.fire('send', 'srt-focus', {
              tab: tab
            });
            break;

          case 'ctx-option':
            if ((0,circle_core_is__WEBPACK_IMPORTED_MODULE_2__.isString)(url) && url.startsWith('chrome')) {
              app.fire('open-option');
            } else {
              app.fire('send', 'srt-option', {
                tab: tab
              });
            }

            break;

          case 'ctx-message':
            if ((0,circle_core_is__WEBPACK_IMPORTED_MODULE_2__.isString)(url) && url.startsWith('chrome')) {
              app.fire('open-message');
            } else {
              app.fire('send', 'srt-message', {
                tab: tab
              });
            }

            break;

          case 'ctx-enter-or-exit':
            if ((0,circle_core_is__WEBPACK_IMPORTED_MODULE_2__.isString)(url) && url.startsWith('chrome')) {//
            } else {
              app.fire('send', 'srt-enter-or-exit', {
                tab: tab
              });
            }

            break;
        }
      }); // 默认一天更新一次

      app.on('cron', function (_callback2) {
        var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12;
        var now = +new Date();
        var name = "corn_".concat(duration);
        var timer = duration * 60 * 60 * 1000;
        app.fire('storage', {
          request: {
            name: name,
            execute: 'get'
          },
          callback: function callback(error) {
            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : now;

            if (error) {
              _callback2 && _callback2(error);
            } else {
              if (data > now) {
                _callback2 && _callback2('wait to run');
                return;
              }

              app.fire('storage', {
                callback: _callback2,
                request: {
                  name: name,
                  execute: 'add',
                  value: now + timer
                }
              });
            }
          }
        });
      });
    }
  }, {
    key: "init_Api",
    value: function init_Api() {
      var app = this.app; // 修改状态

      app.on('status', function () {
        var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            action = _ref4.request.action,
            sender = _ref4.sender,
            callback = _ref4.callback;

        callback && callback();
        var tabId = sender.tab.id;

        switch (action) {
          case 'wait':
            app.browserAction.enable(tabId);
            app.browserAction.setIcon({
              tabId: tabId,
              path: {
                16: 'icons/16-wait.png',
                32: 'icons/32-wait.png'
              }
            });
            break;

          case 'done':
            app.browserAction.setIcon({
              tabId: tabId,
              path: {
                16: 'icons/16-done.png',
                32: 'icons/32-done.png'
              }
            });
            break;

          case 'disable':
            // 黑名单实现，可移除
            app.browserAction.enable(tabId);
            app.browserAction.setIcon({
              tabId: tabId,
              path: {
                16: 'icons/16-disable.png',
                32: 'icons/32-disable.png'
              }
            });
            break;

          default:
            app.browserAction.disable(tabId);
            app.browserAction.setIcon({
              tabId: tabId,
              path: {
                16: 'icons/16-default.png',
                32: 'icons/32-default.png'
              }
            });
            break;
        }
      }); // tab 操作相关

      app.on('tab', function (_ref5) {
        var request = _ref5.request,
            sender = _ref5.sender,
            callback = _ref5.callback;
        var tabId = sender && sender.tab ? sender.tab.id : 0;
        var property = request.value || {};

        switch (request.action) {
          case 'create':
            app.tabs.create(property, function (tab) {
              callback && callback(null, tab);
            });
            break;

          case 'update':
            app.tabs.update(tabId, property, function (tab) {
              callback && callback(null, tab);
            });
            break;

          case 'remove':
            app.tabs.remove(tabId, callback);
            break;

          case 'captureVisibleTab':
            app.tabs.captureVisibleTab(property, function (dataUrl) {
              callback && callback(null, dataUrl);
            });
            break;

          case 'query':
            app.tabs.query(property, function (tabs) {
              callback && callback(null, tabs);
            });
            break;
        }
      }); // windows 操作

      app.on('windows', function (_ref6) {
        var request = _ref6.request,
            callback = _ref6.callback;

        switch (request.action) {
          case 'current':
            app.windows.getCurrent(function (instance) {
              callback && callback(null, instance);
            });
            break;

          case 'create':
            app.windows.create({
              url: request.url
            }, function (instance) {
              callback && callback(null, instance);
            });
            break;

          case 'get':
            app.windows.get(app.windows.WINDOW_ID_CURRENT, function (instance) {
              callback && callback(null, instance);
            });
            break;

          case 'update':
            // "normal", "minimized", "maximized", "fullscreen", or "locked-fullscreen"
            app.windows.update(app.windows.WINDOW_ID_CURRENT, {
              state: request.state
            }, function (instance) {
              callback && callback(null, instance);
            });
            break;
        }
      }); // 右键菜单

      app.on('ctx', function (_ref7) {
        var _ref7$request = _ref7.request,
            id = _ref7$request.id,
            title = _ref7$request.title,
            enabled = _ref7$request.enabled,
            action = _ref7$request.action,
            _callback3 = _ref7.callback;

        switch (action) {
          case 'create':
            app.contextMenus.create({
              id: id,
              title: title,
              onclick: function onclick(info, tab) {
                return app.fire('ctx-click', info, tab);
              }
            }, function () {
              var installed = app.cache('ctx_installed');
              !(0,circle_core_is__WEBPACK_IMPORTED_MODULE_2__.isArray)(installed) && (installed = []);
              !installed.includes(id) && installed.push(id);
              app.cache('ctx_installed', installed);
              console.log(app.runtime.lastError);
              _callback3 && _callback3();
            });
            break;

          case 'update':
            try {
              var installed = app.cache('ctx_installed');
              !(0,circle_core_is__WEBPACK_IMPORTED_MODULE_2__.isArray)(installed) && (installed = []);

              if (installed.includes(id)) {
                app.contextMenus.update(id, {
                  title: title,
                  enabled: enabled
                }, _callback3);
              } else {
                _callback3 && _callback3('not install');
              }
            } catch (e) {
              _callback3 && _callback3(e);
            }

            break;

          case 'remove':
            try {
              app.contextMenus.remove(id, function () {
                var installed = app.cache('ctx_installed');
                !(0,circle_core_is__WEBPACK_IMPORTED_MODULE_2__.isArray)(installed) && (installed = []);
                app.cache('ctx_installed', installed.filter(function (item) {
                  return item !== id;
                }));
                _callback3 && _callback3();
              });
            } catch (e) {
              _callback3 && _callback3(e);
            }

            break;

          case 'removeall':
            app.contextMenus.removeAll(_callback3);
            break;

          case 'init':
            app.fire('db', {
              request: {
                execute: 'all',
                table: app.cache('table').cx
              },
              callback: function callback(error) {
                var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

                if (error) {
                  _callback3 && _callback3(error);
                  return;
                }

                _callback3 && _callback3();
                var ctxs = [];
                (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_3__.each)(data, function (item, key) {
                  if (!item.checked) {
                    return;
                  }

                  ctxs.push(Object.assign({
                    id: key
                  }, item));
                });
                var counter = ctxs.length;

                if (counter <= 0) {
                  return;
                }

                app.contextMenus.removeAll(function () {
                  var installed = app.cache('ctx_installed');
                  !(0,circle_core_is__WEBPACK_IMPORTED_MODULE_2__.isArray)(installed) && (installed = []);
                  (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_3__.each)(ctxs.sort(function (prev, next) {
                    return prev.create - next.create;
                  }), function (item) {
                    item.checked && app.contextMenus.create({
                      id: item.id,
                      title: item.label,
                      onclick: function onclick(info, tab) {
                        return app.fire('ctx-click', info, tab);
                      }
                    }, function () {
                      !installed.includes(item.id) && installed.push(item.id);
                      installed.length >= counter && app.cache('ctx_installed', installed);
                    });
                  });
                });
              }
            });
            break;
        }
      });
    }
  }, {
    key: "init_pjax",
    value: function init_pjax() {
      var app = this.app;
      app.on('pjax-start', function (_ref8) {
        var request = _ref8.request,
            callback = _ref8.callback;
        callback && callback();
        var hostname = request.hostname;
        hostname && app.cache('pjax-hostname', hostname);
      });
      app.on('tab-created', function () {
        app.cache('pjax-hostname', null);
      });
      app.on('tab-updated', function (tabId, changeInfo, tab) {
        var url = changeInfo.url;
        url && app.cache('pjax-changeurl', url);

        if (changeInfo.status !== 'complete' || !app.cache('pjax-changeurl') || !app.cache('pjax-hostname')) {
          return;
        }

        var location = (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_3__.getLocation)(app.cache('pjax-changeurl'));

        if (location.hostname !== app.cache('pjax-hostname')) {
          return;
        }

        app.fire('send', 'pjax-change', {
          tab: tab,
          url: app.cache('pjax-changeurl')
        });
        app.cache('pjax-changeurl', null);
      });
    }
  }, {
    key: "init_event",
    value: function init_event() {
      var app = this.app;
      app.tabs.onCreated.addListener(function (tab) {
        // console.log('onCreated');
        app.fire('tab-created', tab);
      });
      app.tabs.onActivated.addListener(function (activeInfo) {
        // console.log('onActivated');
        app.fire('tab-activated', activeInfo);
        app.fire('tab', {
          request: {
            action: 'query',
            value: {
              active: true,
              currentWindow: true
            }
          },
          callback: function callback(error, tabs) {
            if (error || !(0,circle_core_is__WEBPACK_IMPORTED_MODULE_2__.isArray)(tabs) || tabs.length !== 1) {
              return;
            }

            app.fire('update-roster', {
              sender: {
                url: tabs[0].url
              }
            });
          }
        });
      }); // app.tabs.onReplaced.addListener(function(addedTabId, removedTabId){
      //   app.fire('tab-replaced', addedTabId, removedTabId);
      // });

      app.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        app.fire('tab-updated', tabId, changeInfo, tab);

        if (changeInfo && changeInfo.status === 'complete') {
          // console.log('onUpdated');
          app.fire('update-roster', {
            sender: {
              url: tab.url
            }
          });
        }
      });
      app.browserAction.onClicked.addListener(function (tab) {
        app.fire('send', 'action-browser', {
          tab: tab
        });
      });
    }
  }, {
    key: "init_analytics",
    value: function init_analytics() {
      if (navigator.userAgent.indexOf('Firefox') >= 0) {
        window.ga = function (action, type, value, event) {
          try {
            var request = new XMLHttpRequest();
            var message = "v=1&tid=".concat(includes_app_config__WEBPACK_IMPORTED_MODULE_1__.UA, "&cid=891391123.1617281018&aip=1&ds=add-on&t=event&ec=").concat(value, "&ea=").concat(event);
            request.open('POST', 'https://www.google-analytics.com/collect', true);
            request.send(message);
          } catch (e) {// console.log('Error sending report to Google Analytics.\n' + e);
          }
        };
      } else {
        (function (i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r;
          i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
          }, i[r].l = 1 * new Date();
          a = s.createElement(o), m = s.getElementsByTagName(o)[0];
          a.async = 1;
          a.src = g;
          m.parentNode.insertBefore(a, m);
        })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

        ga('create', includes_app_config__WEBPACK_IMPORTED_MODULE_1__.UA, 'auto');
        ga('set', 'checkProtocolTask', function () {});
        ga('send', 'pageview', '/circle.html');
      }

      this.app.on('analytics', function (_ref9) {
        var _ref9$request = _ref9.request,
            event = _ref9$request.event,
            _ref9$request$type = _ref9$request.type,
            type = _ref9$request$type === void 0 ? 'click' : _ref9$request$type,
            callback = _ref9.callback;
        (0,circle_core_is__WEBPACK_IMPORTED_MODULE_2__.isString)(event) && ga('send', 'event', event, type);
        callback && callback();
      });
    }
  }, {
    key: "checkCtxStatus",
    value: function checkCtxStatus(_callback4) {
      var app = this.app;
      app.fire('db', {
        request: {
          execute: 'get',
          name: circle_config_field__WEBPACK_IMPORTED_MODULE_0__.cx.field,
          table: app.cache('table').wc
        },
        callback: function callback(error, data) {
          if (error || !data) {
            error && app.fire('error', error);
            return;
          }

          _callback4 && _callback4();
        }
      });
    }
  }, {
    key: "checkCtxItem",
    value: function checkCtxItem(name, _callback5) {
      var app = this.app;
      app.fire('db', {
        request: {
          name: name,
          execute: 'get',
          table: app.cache('table').cx
        },
        callback: function callback(error) {
          var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          if (error || !data.checked) {
            return;
          }

          _callback5 && _callback5();
        }
      });
    }
  }, {
    key: "contextmenu",
    value: function contextmenu() {
      var app = this.app;
      this.checkCtxStatus(function () {
        app.fire('ctx', {
          request: {
            action: 'init'
          },
          callback: function callback(error) {
            error && app.fire('error', error);
          }
        });
      });
    }
  }]);

  return Server;
}();



/***/ }),

/***/ "./src/includes/app/config.js":
/*!************************************!*\
  !*** ./src/includes/app/config.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UA": () => (/* binding */ UA)
/* harmony export */ });
var UA = 'UA-156433061-8';

/***/ }),

/***/ "./src/includes/app/installed.js":
/*!***************************************!*\
  !*** ./src/includes/app/installed.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Server)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Server = /*#__PURE__*/function () {
  function Server(app) {
    _classCallCheck(this, Server);

    this.app = app;
    this.INITIAL_VALUES = {
      "wrench": {
        "skin": "light",
        "dark": "gray",
        "light": "green",
        "paper": true,
        "outline": true,
        "backtop": true,
        "nextpage": true,
        "zoom-toolbar": true,
        "highlight-toolbar": true,
        "shortcut-enabled": true,
        "contextmenu-enabled": true,
        "toolbar": [{
          "group": 0,
          "priority": 0,
          "name": "close",
          "field": "srt-exit",
          "label": app.i10n('exit')
        }, {
          "group": 0,
          "priority": 1,
          "name": "fullscreen",
          "field": "srt-fullscreen",
          "label": app.i10n('fullscreen')
        }, {
          "group": 0,
          "priority": 3,
          "name": "print",
          "field": "srt-print",
          "label": app.i10n('print')
        }, {
          "group": 0,
          "priority": 7,
          "name": "setting",
          "field": "srt-setting",
          "label": app.i10n('adjust')
        }, {
          "group": 0,
          "priority": 8,
          "name": "tool",
          "field": "srt-wrench",
          "label": app.i10n('setting')
        }, {
          "group": 0,
          "priority": 9,
          "name": "whitelist",
          "field": "srt-whitelist",
          "label": app.i10n('add_whitelist')
        }, {
          "group": 0,
          "priority": 10,
          "name": "blacklist",
          "field": "srt-blacklist",
          "label": app.i10n('add_blacklist')
        }, {
          "group": 3,
          "priority": 22.5,
          "name": 'message',
          "field": 'srt-message',
          "label": app.i10n('message_center')
        }, {
          "group": 3,
          "priority": 22.6,
          "name": "feedback",
          "field": "srt-feedback",
          "label": app.i10n('feedback')
        }]
      },
      "setting": {
        "dark": {
          "color": "#b0b0b0",
          "link": "#5ac8fa",
          "hover": "#3ea4d2",
          "visited": "#3ea4d2",
          "select": "#fffefe",
          "selectbg": "#43b0e2",
          "bg": "#4a4a4d",
          "track": "#4e4e50",
          "thumb": "#83838c",
          "radius": "4px"
        },
        "light": {
          "color": "#282d2b",
          "link": "#507964",
          "hover": "#3e6b54",
          "visited": "#3e6b54",
          "select": "#000",
          "selectbg": "#addab4",
          "bg": "#c7edcc",
          "track": "#8fbd95",
          "thumb": "#638c6d",
          "radius": "4px"
        },
        "skin": {
          "color": "#1b1b1b",
          "link": "#416ed2",
          "hover": "#305ab7",
          "visited": "#305ab7",
          "select": "#1b1b1b",
          "selectbg": "#bbd6fc",
          "bg": "#fff",
          "track": "#e2e2e2",
          "thumb": "#9e9e9e",
          "radius": "4px"
        }
      },
      "shortcut": {
        "srt-enter-or-exit": {
          "value": "a a",
          "checked": true
        },
        "srt-exit": {
          "value": "escape",
          "checked": true
        },
        "srt-exitclose": {
          "value": "x x",
          "checked": true
        },
        "srt-fullscreen": {
          "value": "f u",
          "checked": true
        },
        "srt-print": {
          "value": "p p",
          "checked": true
        },
        "srt-setting": {
          "value": "s t",
          "checked": true
        },
        "srt-option": {
          "value": "o p",
          "checked": true
        },
        "srt-imagehide": {
          "value": "h p",
          "checked": true
        },
        "srt-paper": {
          "value": "p r",
          "checked": true
        },
        "srt-whitelist": {
          "value": "w l",
          "checked": true
        },
        "srt-whitelist-site": {
          "value": "w s",
          "checked": true
        },
        "srt-blacklist": {
          "value": "b l",
          "checked": true
        },
        "srt-blacklist-site": {
          "value": "b s",
          "checked": true
        },
        "srt-message": {
          "value": "m c",
          "checked": true
        },
        "srt-focus": {
          "value": "a s",
          "checked": true
        },
        "srt-exitimg": {
          "value": "x p",
          "checked": true
        },
        "srt-exitcode": {
          "value": "x c",
          "checked": true
        },
        "srt-feedback": {
          "value": "f d",
          "checked": true
        }
      },
      "contextmenu": {
        "ctx-option": {
          "label": app.i10n('setting'),
          "checked": true,
          "create": 1627958972271
        },
        "ctx-blacklist": {
          "label": app.i10n('add_blacklist'),
          "checked": true,
          "create": 1627958972272
        },
        "ctx-whitelist": {
          "label": app.i10n('add_whitelist'),
          "checked": true,
          "create": 1627958972273
        },
        "ctx-message": {
          "label": app.i10n('message_center'),
          "checked": true,
          "create": 1627958972274
        },
        "ctx-enter-or-exit": {
          "label": app.i10n('enter_or_exit'),
          "checked": true,
          "create": 1627958972275
        },
        "ctx-focus": {
          "label": app.i10n('focus'),
          "checked": true,
          "create": 1627958972276
        }
      }
    };
  }

  _createClass(Server, [{
    key: "init",
    value: function init(_callback) {
      var _this = this;

      var app = this.app; // 安装时写入初始配置

      app.on('install', function () {
        app.fire('import', {
          request: {
            data: _this.INITIAL_VALUES
          },
          callback: function callback() {
            _callback && _callback();

            if (app.cache('debug')) {
              return;
            }

            app.runtime.setUninstallURL(app.to('circle-uninstall'));
            app.tabs.create({
              url: app.to('circle-usage')
            });
          }
        });
      }); // 更新时写入数据

      app.on('update', function () {
        if (app.cache('debug')) {
          return;
        }

        app.runtime.setUninstallURL(app.to('circle-uninstall'));
        app.tabs.create({
          url: app.to('circle_v1.0.1')
        });
      });
    }
  }]);

  return Server;
}();



/***/ }),

/***/ "./src/includes/app/server.js":
/*!************************************!*\
  !*** ./src/includes/app/server.js ***!
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
/******/ 			"module/app/server": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["controller/common"], () => (__webpack_require__("../circle/module/app/server.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;