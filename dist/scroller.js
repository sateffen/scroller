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

	var _scrollview = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Scroller = (function () {
	    function Scroller(aElement, aOptions) {
	        var _this = this;

	        _classCallCheck(this, Scroller);

	        this._container = aElement;
	        this._scrollView = new Scroller.ScrollView(this._container, this);

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

	                _this._scrollView.parentUpdated();
	            }
	        }, 300);

	        this._container.style.overflow = 'hidden';
	        this._container.style.position = 'relative';

	        Object.keys(this._eventListener).forEach(function (aKey) {
	            _this._container.addEventListener(aKey, _this._eventListener[aKey]);
	        });

	        this._scrollView.parentUpdated();
	    }

	    _createClass(Scroller, [{
	        key: 'setScrollTop',
	        value: function setScrollTop(aScrollTop) {
	            this._container.scrollTop = aScrollTop;
	            this._scrollView.scrollTopUpdated(aScrollTop);
	        }
	    }, {
	        key: 'setScrollLeft',
	        value: function setScrollLeft(aScrollLeft) {
	            this._container.scrollLeft = aScrollLeft;
	            this._scrollView.scrollLeftUpdated(aScrollLeft);
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            var _this2 = this;

	            window.clearInterval(this._intervalPointer);

	            Object.keys(this._eventListener).forEach(function (aKey) {
	                _this2._container.removeEventListener(aKey, _this2._eventListener[aKey]);
	            });

	            this._scrollView.destroy();

	            this._scrollView = null;
	            this._container = null;
	        }
	    }]);

	    return Scroller;
	})();

	Scroller.ScrollView = _scrollview.ScrollView;

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

	var ScrollView = exports.ScrollView = (function () {
	    function ScrollView(aParentElement, aParentInstance) {
	        var _this = this;

	        _classCallCheck(this, ScrollView);

	        this._xElement = document.createElement('div');
	        this._yElement = document.createElement('div');
	        this._parent = aParentElement;

	        var tmpMover = null;
	        var tmpMovePointer = null;
	        var tmpEndPointer = null;

	        this._xEventListener = {
	            mousedown: function mousedown(aEvent) {
	                aEvent.preventDefault();
	                tmpMover = aEvent.pageX;

	                tmpMovePointer = function (e) {
	                    e.preventDefault();
	                    var distance = e.pageX - tmpMover;
	                    tmpMover = e.pageX;

	                    aParentInstance.setScrollLeft(_this._parent.scrollLeft + distance);
	                };

	                tmpEndPointer = function (e) {
	                    e.preventDefault();
	                    document.body.removeEventListener('mousemove', tmpMovePointer);
	                    document.body.removeEventListener('mouseup', tmpEndPointer);
	                };

	                document.body.addEventListener('mousemove', tmpMovePointer);
	                document.body.addEventListener('mouseup', tmpEndPointer);
	            }
	        };

	        this._yEventListener = {
	            mousedown: function mousedown(aEvent) {
	                aEvent.preventDefault();
	                tmpMover = aEvent.pageY;

	                tmpMovePointer = function (e) {
	                    e.preventDefault();
	                    var distance = e.pageY - tmpMover;
	                    tmpMover = e.pageY;

	                    aParentInstance.setScrollTop(_this._parent.scrollTop + distance);
	                };

	                tmpEndPointer = function (e) {
	                    e.preventDefault();
	                    document.body.removeEventListener('mousemove', tmpMovePointer);
	                    document.body.removeEventListener('mouseup', tmpEndPointer);

	                    tmpMovePointer = null;
	                    tmpEndPointer = null;
	                };

	                document.body.addEventListener('mousemove', tmpMovePointer);
	                document.body.addEventListener('mouseup', tmpEndPointer);
	            }
	        };

	        this._parent.appendChild(this._xElement);
	        this._xElement.style.position = 'absolute';
	        this._xElement.style.height = '6px';
	        this._xElement.style.backgroundColor = 'rgba(0,0,0,0.6)';
	        this._xElement.style.borderRadius = '3px';
	        this._xElement.style.left = '0px';

	        this._parent.appendChild(this._yElement);
	        this._yElement.style.position = 'absolute';
	        this._yElement.style.width = '6px';
	        this._yElement.style.backgroundColor = 'rgba(0,0,0,0.6)';
	        this._yElement.style.borderRadius = '3px';
	        this._yElement.style.top = '0px';

	        Object.keys(this._xEventListener).forEach(function (aKey) {
	            _this._xElement.addEventListener(aKey, _this._xEventListener[aKey]);
	        });

	        Object.keys(this._yEventListener).forEach(function (aKey) {
	            _this._yElement.addEventListener(aKey, _this._yEventListener[aKey]);
	        });

	        this.parentUpdated();
	        this.scrollTopUpdated();
	        this.scrollLeftUpdated();
	    }

	    _createClass(ScrollView, [{
	        key: 'scrollTopUpdated',
	        value: function scrollTopUpdated() {
	            if (this._parentScrollHeight > this._parentHeight) {
	                var partSize = this._parent.scrollTop / (this._parentScrollHeight - this._parentHeight);
	                partSize = partSize * (this._parentHeight - this._elementHeight);
	                this._yElement.style.top = this._parent.scrollTop + partSize + 'px';
	            }

	            this._xElement.style.top = this._parent.scrollTop + this._parentHeight - 6 + 'px';
	        }
	    }, {
	        key: 'scrollLeftUpdated',
	        value: function scrollLeftUpdated() {
	            if (this._parentScrollWidth > this._parentWidth) {
	                var partSize = this._parent.scrollLeft / (this._parentScrollWidth - this._parentWidth);
	                partSize = partSize * (this._parentWidth - this._elementWidth);
	                this._xElement.style.left = this._parent.scrollLeft + partSize + 'px';
	            }

	            this._yElement.style.left = this._parent.scrollLeft + this._parentWidth - 6 + 'px';
	        }
	    }, {
	        key: 'parentUpdated',
	        value: function parentUpdated() {
	            this._parentWidth = this._parent.clientWidth;
	            this._parentScrollWidth = this._parent.scrollWidth;
	            this._elementWidth = this._parentWidth * this._parentWidth / this._parentScrollWidth;
	            this._parentHeight = this._parent.clientHeight;
	            this._parentScrollHeight = this._parent.scrollHeight;
	            this._elementHeight = this._parentHeight * this._parentHeight / this._parentScrollHeight;

	            if (this._parentWidth < this._parentScrollWidth) {
	                this._xElement.style.display = 'block';
	                this._xElement.style.width = this._elementWidth + 'px';

	                this.scrollLeftUpdated(this._parent.scrollLeft);
	            } else {
	                this._xElement.style.display = 'none';
	            }

	            if (this._parentHeight < this._parentScrollHeight) {
	                this._yElement.style.display = 'block';
	                this._yElement.style.height = this._elementHeight + 'px';

	                this.scrollTopUpdated(this._parent.scrollTop);
	            } else {
	                this._yElement.style.display = 'none';
	            }
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            var _this2 = this;

	            Object.keys(this._xEventListener).forEach(function (aKey) {
	                _this2._xElement.removeEventListener(aKey, _this2._xEventListener[aKey]);
	            });

	            Object.keys(this._yEventListener).forEach(function (aKey) {
	                _this2._yElement.removeEventListener(aKey, _this2._yEventListener[aKey]);
	            });

	            this._parent = null;
	        }
	    }]);

	    return ScrollView;
	})();

/***/ }
/******/ ]);