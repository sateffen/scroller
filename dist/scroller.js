/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _xscrollbar = __webpack_require__(1);

	var _yscrollbar = __webpack_require__(2);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Scroller = (function () {
	    function Scroller(aElement, aOptions) {
	        var _this = this;

	        _classCallCheck(this, Scroller);

	        this._container = aElement;
	        this._xScrollElement = new Scroller.XScrollBar(this._container);
	        this._yScrollElement = new Scroller.YScrollBar(this._container);

	        this._eventListener = {
	            wheel: function wheel(aEvent) {
	                _this.setScrollTop(_this._container.scrollTop + aEvent.deltaY);
	                _this.setScrollLeft(_this._container.scrollLeft + aEvent.deltaX);
	            }
	        };

	        var containerHeight = this._container.clientHeight;
	        var containerWidth = this._container.clientWidth;
	        var scrollHeight = this._container.scrollHeight;
	        var scrollWidth = this._container.scrollWidth;

	        this._intervalPointer = window.setInterval(function () {
	            var p = _this._container.parentElement;

	            while (p != undefined && p !== document.body) {
	                p = p.parentElement;
	            }

	            if (p == undefined) {
	                _this.destroy();
	            } else if (containerHeight !== _this._container.clientHeight || containerWidth !== _this._container.clientWidth || scrollHeight !== _this._container.scrollHeight || scrollWidth !== _this._container.scrollWidth) {
	                containerHeight = _this._container.clientHeight;
	                containerWidth = _this._container.clientWidth;
	                scrollHeight = _this._container.scrollHeight;
	                scrollWidth = _this._container.scrollWidth;

	                _this._xScrollElement.parentUpdated();
	                _this._yScrollElement.parentUpdated();
	            }
	        }, 300);

	        this._container.style.overflow = 'hidden';
	        this._container.style.position = 'relative';

	        Object.keys(this._eventListener).forEach(function (aKey) {
	            _this._container.addEventListener(aKey, _this._eventListener[aKey]);
	        });

	        this._xScrollElement.parentUpdated();
	        this._yScrollElement.parentUpdated();
	    }

	    _createClass(Scroller, [{
	        key: 'setScrollTop',
	        value: function setScrollTop(aScrollTop) {
	            this._container.scrollTop = aScrollTop;
	            this._yScrollElement.scrollTopUpdated(aScrollTop);
	        }
	    }, {
	        key: 'setScrollLeft',
	        value: function setScrollLeft(aScrollLeft) {
	            this._container.scrollLeft = aScrollLeft;
	            this._xScrollElement.scrollLeftUpdated(aScrollLeft);
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            var _this2 = this;

	            window.clearInterval(this._intervalPointer);

	            Object.keys(this._eventListener).forEach(function (aKey) {
	                _this2._container.removeEventListener(aKey, _this2._eventListener[aKey]);
	            });

	            this._xScrollElement.destroy();
	            this._yScrollElement.destroy();

	            this._xScrollElement = null;
	            this._yScrollElement = null;
	            this._container = null;
	        }
	    }]);

	    return Scroller;
	})();

	Scroller.YScrollBar = _yscrollbar.YScrollBar;
	Scroller.XScrollBar = _xscrollbar.XScrollBar;

	var target = document.querySelector('#container');

	var instance = new Scroller(target, {});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var XScrollBar = exports.XScrollBar = (function () {
	    function XScrollBar(aParent) {
	        var _this = this;

	        _classCallCheck(this, XScrollBar);

	        this._element = document.createElement('div');
	        this._parent = aParent;

	        this._eventListener = {};

	        this._parent.appendChild(this._element);
	        this._element.style.position = 'absolute';
	        this._element.style.height = '10px';
	        this._element.style.backgroundColor = 'rgba(0,0,0,0.6)';
	        this._element.style.borderRadius = '5px';
	        this._element.style.bottom = '0px';
	        this._element.style.left = '0px';

	        Object.keys(this._eventListener).forEach(function (aKey) {
	            _this._container.addEventListener(aKey, _this._eventListener[aKey]);
	        });

	        this.parentUpdated();
	        this.scrollLeftUpdated(aParent.scrollLeft);

	        this._parent.appendChild(this._element);
	    }

	    _createClass(XScrollBar, [{
	        key: 'scrollLeftUpdated',
	        value: function scrollLeftUpdated(aY) {
	            if (this._parentScrollWidth > this._parentWidth) {
	                var partSize = this._parent.scrollLeft / (this._parentScrollWidth - this._parentWidth);
	                partSize = partSize * (this._parentWidth - this._elementWidth);
	                this._element.style.left = this._parent.scrollLeft + partSize + 'px';
	            }
	        }
	    }, {
	        key: 'parentUpdated',
	        value: function parentUpdated() {
	            this._parentWidth = this._parent.clientWidth;
	            this._parentScrollWidth = this._parent.scrollWidth;
	            this._elementWidth = this._parentWidth * this._parentWidth / this._parentScrollWidth;

	            if (this._parentWidth < this._parentScrollWidth) {
	                this._element.style.display = 'block';

	                this._element.style.width = this._elementWidth + 'px';

	                this.scrollLeftUpdated(this._parent.scrollLeft);
	            } else {
	                this._element.style.display = 'none';
	            }
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            var _this2 = this;

	            Object.keys(this._eventListener).forEach(function (aKey) {
	                _this2._container.removeEventListener(aKey, _this2._eventListener[aKey]);
	            });
	        }
	    }]);

	    return XScrollBar;
	})();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var YScrollBar = exports.YScrollBar = (function () {
	    function YScrollBar(aParent) {
	        var _this = this;

	        _classCallCheck(this, YScrollBar);

	        this._element = document.createElement('div');
	        this._parent = aParent;

	        this._eventListener = {};

	        this._parent.appendChild(this._element);
	        this._element.style.position = 'absolute';
	        this._element.style.width = '10px';
	        this._element.style.backgroundColor = 'rgba(0,0,0,0.6)';
	        this._element.style.borderRadius = '5px';
	        this._element.style.top = '0px';
	        this._element.style.right = '0px';

	        Object.keys(this._eventListener).forEach(function (aKey) {
	            _this._container.addEventListener(aKey, _this._eventListener[aKey]);
	        });

	        this.parentUpdated();
	        this.scrollTopUpdated(aParent.scrollTop);

	        this._parent.appendChild(this._element);
	    }

	    _createClass(YScrollBar, [{
	        key: 'scrollTopUpdated',
	        value: function scrollTopUpdated(aY) {
	            if (this._parentScrollHeight > this._parentHeight) {
	                var partSize = this._parent.scrollTop / (this._parentScrollHeight - this._parentHeight);
	                partSize = partSize * (this._parentHeight - this._elementHeight);
	                this._element.style.top = this._parent.scrollTop + partSize + 'px';
	            }
	        }
	    }, {
	        key: 'parentUpdated',
	        value: function parentUpdated() {
	            this._parentHeight = this._parent.clientHeight;
	            this._parentScrollHeight = this._parent.scrollHeight;
	            this._elementHeight = this._parentHeight * this._parentHeight / this._parentScrollHeight;

	            if (this._parentHeight < this._parentScrollHeight) {
	                this._element.style.display = 'block';

	                this._element.style.height = this._elementHeight + 'px';

	                this.scrollTopUpdated(this._parent.scrollTop);
	            } else {
	                this._element.style.display = 'none';
	            }
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            var _this2 = this;

	            Object.keys(this._eventListener).forEach(function (aKey) {
	                _this2._container.removeEventListener(aKey, _this2._eventListener[aKey]);
	            });
	        }
	    }]);

	    return YScrollBar;
	})();

/***/ }
/******/ ]);