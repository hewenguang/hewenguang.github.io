/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "../circle/module/wrench/server.js":
/*!*****************************************!*\
  !*** ../circle/module/wrench/server.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var circle_core_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! circle/core/utils */ "../circle/core/utils.js");
/* harmony import */ var circle_core_is__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! circle/core/is */ "../circle/core/is.js");
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



Bridge.register('wrench', 'database', function () {
  var app = this;
  var tables = Object.values(app.cache('table'));

  function filter(value, key, callback) {
    if ((0,circle_core_is__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(value)) {
      Object.keys(value).length > 0 && callback();
    } else {
      !(0,circle_core_is__WEBPACK_IMPORTED_MODULE_1__.isUndefined)(value) && callback();
    }
  }

  function get(table) {
    return new Promise(function (resolve, reject) {
      app.fire('db', {
        request: {
          table: table,
          execute: 'all'
        },
        callback: function callback(error, data) {
          if (error) {
            reject(error);
          } else {
            resolve(_defineProperty({}, table, data));
          }
        }
      });
    });
  } // 整体导出


  app.on('export', function (_ref) {
    var callback = _ref.callback;
    Promise.all(tables.map(get)).then(function (values) {
      var settings = {};
      (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_0__.each)(values, function (items) {
        (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_0__.each)(items, function (item, key) {
          filter(item, key, function () {
            settings[key] = item;
          });
        });
      });
      callback && callback(null, settings);
    })["catch"](function (error) {
      callback && callback(error.message);
    });
  }); // 单表导出

  app.on('export-table', function (_ref2) {
    var request = _ref2.request,
        callback = _ref2.callback;
    var table = request.table;

    if (!table) {
      callback && callback(app.i10n('required'));
      return;
    }

    get(table).then(function (value) {
      var settings = {};
      (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_0__.each)(value, function (item, key) {
        filter(item, key, function () {
          settings[key] = item;
        });
      });
      callback && callback(null, settings);
    })["catch"](function (error) {
      callback && callback(error.message);
    });
  });

  function add(name, value, table) {
    return new Promise(function (resolve, reject) {
      app.fire('db', {
        request: {
          name: name,
          value: value,
          table: table,
          execute: 'add'
        },
        callback: function callback(error) {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      });
    });
  } // 整体清空


  function cleanAll(callback) {
    var actions = [];
    (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_0__.each)(tables, function (table) {
      actions.push(new Promise(function (resolve, reject) {
        app.fire('db', {
          request: {
            table: table,
            execute: 'clear'
          },
          callback: function callback(error) {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        });
      }));
    });
    Promise.all(actions).then(function () {
      callback && callback();
    })["catch"](function (error) {
      callback && callback(error.message);
    });
  } // 整体导入


  app.on('import', function (_ref3) {
    var request = _ref3.request,
        callback = _ref3.callback;
    var result = request.data;

    if (!result) {
      callback && callback(app.i10n('required'));
      return;
    }

    var results = (0,circle_core_is__WEBPACK_IMPORTED_MODULE_1__.isString)(result) ? JSON.parse(result) : result;
    cleanAll(function (error) {
      if (error) {
        callback && callback(error);
        return;
      }

      var actions = [];
      (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_0__.each)(results, function (item, table) {
        var promises = [];
        tables.includes(table) && (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_0__.each)(item, function (value, name) {
          promises.push(add(name, value, table));
        });
        promises.length > 0 && actions.push(Promise.all(promises));
      });

      if (actions.length > 0) {
        Promise.all(actions).then(function () {
          callback && callback();
        })["catch"](function (error) {
          callback && callback(error.message);
        });
      } else {
        callback && callback(app.i10n('required'));
      }
    });
  }); // 单表导入

  app.on('import-table', function (_ref4) {
    var request = _ref4.request,
        _callback = _ref4.callback;
    var data = request.data,
        table = request.table;

    if (!table) {
      _callback && _callback(app.i10n('required'));
      return;
    }

    app.fire('db', {
      request: {
        table: table,
        execute: 'clear'
      },
      callback: function callback(error) {
        if (error) {
          _callback && _callback(error);
          return;
        }

        if (!data) {
          _callback && _callback();
          return;
        }

        var actions = [];
        (0,circle_core_utils__WEBPACK_IMPORTED_MODULE_0__.each)(data, function (value, name) {
          actions.push(add(name, value, table));
        });

        if (actions.length > 0) {
          Promise.all(actions).then(function () {
            _callback && _callback();
          })["catch"](function (error) {
            _callback && _callback(error.message);
          });
        } else {
          _callback && _callback(app.i10n('required'));
        }
      }
    });
  });
});

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
/******/ 			"module/wrench/server": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["controller/common"], () => (__webpack_require__("../circle/module/wrench/server.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;