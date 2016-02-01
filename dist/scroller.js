(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["scroller"] = factory();
	else
		root["scroller"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { throw err; };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.generateEventHandlerForElement = generateEventHandlerForElement;
	exports.applyOptionsToScollBarElement = applyOptionsToScollBarElement;
	function generateEventHandlerForElement(aAttribute, aPropertyFactor, aParentWriteCallback) {
	    var _this = this;

	    return {
	        mousedown: function mousedown(aEvent) {
	            aEvent.preventDefault();
	            var tmpMover = aEvent[aAttribute];
	            var scrollPositionFloat = _this._scrollerParent[aParentWriteCallback]();

	            var tmpMovePointer = function tmpMovePointer(e) {
	                scrollPositionFloat += (e[aAttribute] - tmpMover) * _this[aPropertyFactor];
	                tmpMover = e[aAttribute];

	                _this._scrollerParent[aParentWriteCallback](Math.round(scrollPositionFloat));
	            };

	            var _tmpEndPointer = function tmpEndPointer(e) {
	                document.body.removeEventListener('mousemove', tmpMovePointer);
	                document.body.removeEventListener('mouseup', _tmpEndPointer);
	                document.body.removeEventListener('mouseleave', _tmpEndPointer);

	                tmpMovePointer = null;
	                _tmpEndPointer = null;
	            };

	            document.body.addEventListener('mousemove', tmpMovePointer);
	            document.body.addEventListener('mouseup', _tmpEndPointer);
	            document.body.addEventListener('mouseleave', _tmpEndPointer);
	        },
	        touchstart: function touchstart(aEvent) {
	            aEvent.preventDefault();
	            var touchToTrack = aEvent.which || 0;
	            var tmpMover = aEvent.touches[touchToTrack][aAttribute];
	            var scrollPositionFloat = _this._scrollerParent[aParentWriteCallback]();

	            var tmpMovePointer = function tmpMovePointer(e) {
	                if (e.which !== touchToTrack) {
	                    return;
	                }

	                scrollPositionFloat += (e.touches[touchToTrack][aAttribute] - tmpMover) * _this[aPropertyFactor];
	                tmpMover = e.touches[touchToTrack][aAttribute];

	                _this._scrollerParent[aParentWriteCallback](Math.round(scrollPositionFloat));
	            };

	            var _tmpEndPointer2 = function tmpEndPointer(e) {
	                if (e.which !== touchToTrack) {
	                    return;
	                }

	                document.body.removeEventListener('touchmove', tmpMovePointer);
	                document.body.removeEventListener('touchend', _tmpEndPointer2);
	                document.body.removeEventListener('touchleave', _tmpEndPointer2);

	                tmpMovePointer = null;
	                _tmpEndPointer2 = null;
	            };

	            document.body.addEventListener('touchmove', tmpMovePointer);
	            document.body.addEventListener('touchend', _tmpEndPointer2);
	            document.body.addEventListener('touchleave', _tmpEndPointer2);
	        }
	    };
	}

	function applyOptionsToScollBarElement(aElement, aElementName, aOptions) {
	    var stylesKey = aElementName + 'Styles';
	    var classKey = aElementName + 'Class';

	    if (aOptions && aOptions[stylesKey] && typeof aOptions[stylesKey] === 'string' && !Array.isArray(aOptions[stylesKey])) {
	        Object.keys(aOptions[stylesKey]).forEach(function (aKey) {
	            aElement.style[aKey] = aOptions[stylesKey][aKey];
	        });
	    }

	    if (aOptions && aOptions[classKey] && aOptions[classKey] === 'string') {
	        aElement.classList.add(aOptions[classKey]);
	    } else if (aOptions && Array.isArray(aOptions[classKey])) {
	        aOptions[classKey].forEach(function (aClass) {
	            aElement.classList.add(aClass);
	        });
	    }
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.ScrollView = undefined;

	var _scrollviewhelper = __webpack_require__(0);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ScrollView = exports.ScrollView = function () {
	    function ScrollView(aParentInstance, aOptions) {
	        var _this = this;

	        _classCallCheck(this, ScrollView);

	        this._parent = aParentInstance._container;
	        this._scrollerParent = aParentInstance;

	        this._scrollHeightFactor = this._parent.scrollHeight / this._parent.clientHeight;
	        this._scrollWidthFactor = this._parent.scrollWidth / this._parent.clientWidth;

	        // setup scroller elements
	        this._xElement = document.createElement('div');
	        this._yElement = document.createElement('div');

	        // create the event handler for the scroller elements
	        this._xEventListener = _scrollviewhelper.generateEventHandlerForElement.call(this, 'pageX', '_scrollWidthFactor', 'scrollLeft');
	        this._yEventListener = _scrollviewhelper.generateEventHandlerForElement.call(this, 'pageY', '_scrollHeightFactor', 'scrollTop');

	        // style some x specific things
	        this._xElement.style.height = '6px';
	        this._xElement.style.left = '0px';

	        // style some y specific things
	        this._yElement.style.width = '6px';
	        this._yElement.style.top = '0px';

	        // style some styles that should apply to x and y
	        this._xElement.style.position = this._yElement.style.position = 'absolute';
	        this._xElement.style.backgroundColor = this._yElement.style.backgroundColor = 'rgba(0,0,0,0.6)';
	        this._xElement.style.borderRadius = this._yElement.style.borderRadius = '3px';

	        // and apply the options to the scrollbar elements
	        (0, _scrollviewhelper.applyOptionsToScollBarElement)(this._xElement, 'xElement', aOptions);
	        (0, _scrollviewhelper.applyOptionsToScollBarElement)(this._yElement, 'yElement', aOptions);

	        // and append the elements to the DOM tree
	        if (!aOptions.disableXScrolling) {
	            this._parent.appendChild(this._xElement);
	        }
	        if (!aOptions.disableYScrolling) {
	            this._parent.appendChild(this._yElement);
	        }

	        // then append the event listeners to x
	        Object.keys(this._xEventListener).forEach(function (aKey) {
	            _this._xElement.addEventListener(aKey, _this._xEventListener[aKey]);
	        });

	        // and y
	        Object.keys(this._yEventListener).forEach(function (aKey) {
	            _this._yElement.addEventListener(aKey, _this._yEventListener[aKey]);
	        });

	        // and call all update functions initially
	        this.parentUpdated();
	    }

	    _createClass(ScrollView, [{
	        key: 'scrollTopUpdated',
	        value: function scrollTopUpdated(aScrollTop) {
	            if (this._parentScrollHeight > this._parentHeight) {
	                var partSize = aScrollTop / (this._parentScrollHeight - this._parentHeight);
	                partSize = partSize * (this._parentHeight - this._elementHeight);
	                this._yElement.style.top = aScrollTop + partSize + 'px';
	            }

	            this._xElement.style.top = aScrollTop + this._parentHeight - 6 + 'px';
	        }
	    }, {
	        key: 'scrollLeftUpdated',
	        value: function scrollLeftUpdated(aScrollLeft) {
	            if (this._parentScrollWidth > this._parentWidth) {
	                var partSize = aScrollLeft / (this._parentScrollWidth - this._parentWidth);
	                partSize = partSize * (this._parentWidth - this._elementWidth);
	                this._xElement.style.left = aScrollLeft + partSize + 'px';
	            }

	            this._yElement.style.left = aScrollLeft + this._parentWidth - 6 + 'px';
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
	            this._scrollHeightFactor = this._parent.scrollHeight / this._parent.clientHeight;
	            this._scrollWidthFactor = this._parent.scrollWidth / this._parent.clientWidth;

	            // determine visibility of x element
	            if (this._parentWidth < this._parentScrollWidth) {
	                this.scrollTopUpdated(this._parent.scrollTop);
	                this._xElement.style.display = 'block';
	                this._xElement.style.width = this._elementWidth + 'px';
	            } else {
	                this._xElement.style.display = 'none';
	            }

	            // determine visibility of y element
	            if (this._parentHeight < this._parentScrollHeight) {
	                this.scrollLeftUpdated(this._parent.scrollLeft);
	                this._yElement.style.display = 'block';
	                this._yElement.style.height = this._elementHeight + 'px';
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
	            this._scrollerParent = null;
	            this._xElement = null;
	            this._yElement = null;
	        }
	    }]);

	    return ScrollView;
	}();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*global PKG_VERSION*/
	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.VERSION = exports.ScrollContainer = undefined;

	var _scrollview = __webpack_require__(1);

	var _scrollviewhelper = __webpack_require__(0);

	var scrollViewHelper = _interopRequireWildcard(_scrollviewhelper);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ScrollContainer = exports.ScrollContainer = function () {
	    function ScrollContainer(aElement) {
	        var _this = this;

	        var aOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	        _classCallCheck(this, ScrollContainer);

	        this._container = aElement;
	        this._scrollView = new ScrollContainer.ScrollView(this, aOptions);
	        this._options = aOptions;

	        this._eventListener = {
	            wheel: function wheel(aEvent) {
	                _this.scrollTop(_this._container.scrollTop + aEvent.deltaY);
	                _this.scrollLeft(_this._container.scrollLeft + aEvent.deltaX);
	            },
	            touchstart: function touchstart(aEvent) {
	                if (aEvent.defaultPrevented || aOptions.disableTouchScrollingOnContainer) {
	                    return;
	                }

	                var touchToTrack = aEvent.which || 0;
	                var tmpMoverX = aEvent.touches[touchToTrack].pageX;
	                var tmpMoverY = aEvent.touches[touchToTrack].pageY;

	                var tmpMovePointer = function tmpMovePointer(e) {
	                    if (e.which !== touchToTrack) {
	                        return;
	                    }

	                    var distanceX = tmpMoverX - e.touches[touchToTrack].pageX;
	                    var distanceY = tmpMoverY - e.touches[touchToTrack].pageY;

	                    tmpMoverX = e.touches[touchToTrack].pageX;
	                    tmpMoverY = e.touches[touchToTrack].pageY;

	                    _this.scrollTop(_this._container.scrollTop + distanceY);
	                    _this.scrollLeft(_this._container.scrollLeft + distanceX);
	                };

	                var _tmpEndPointer = function tmpEndPointer(e) {
	                    if (e.which !== touchToTrack) {
	                        return;
	                    }

	                    document.body.removeEventListener('touchmove', tmpMovePointer);
	                    document.body.removeEventListener('touchend', _tmpEndPointer);
	                    document.body.removeEventListener('touchleave', _tmpEndPointer);

	                    tmpMovePointer = null;
	                    _tmpEndPointer = null;
	                };

	                document.body.addEventListener('touchmove', tmpMovePointer);
	                document.body.addEventListener('touchend', _tmpEndPointer);
	                document.body.addEventListener('touchleave', _tmpEndPointer);
	            }
	        };

	        var containerHeight = this._container.clientHeight;
	        var containerWidth = this._container.clientWidth;
	        var scrollHeight = this._container.scrollHeight;
	        var scrollWidth = this._container.scrollWidth;

	        this._intervalPointer = window.setInterval(function () {
	            var potentialRootElement = _this._container.parentElement;

	            while (potentialRootElement != undefined && potentialRootElement !== document.body) {
	                potentialRootElement = potentialRootElement.parentElement;
	            }

	            if (potentialRootElement == undefined) {
	                _this.destroy();
	            } else if (containerHeight !== _this._container.clientHeight || containerWidth !== _this._container.clientWidth || scrollHeight !== _this._container.scrollHeight || scrollWidth !== _this._container.scrollWidth) {
	                containerHeight = _this._container.clientHeight;
	                containerWidth = _this._container.clientWidth;
	                scrollHeight = _this._container.scrollHeight;
	                scrollWidth = _this._container.scrollWidth;

	                _this._scrollView.parentUpdated();
	            }
	        }, aOptions.checkInterval || 300);

	        var currentPositionStyle = window.getComputedStyle(this._container, null).getPropertyValue('position');

	        if (currentPositionStyle !== 'absolute' && currentPositionStyle !== 'relative') {
	            this._container.style.position = 'relative';
	        }
	        this._container.style.overflow = 'hidden';

	        Object.keys(this._eventListener).forEach(function (aKey) {
	            _this._container.addEventListener(aKey, _this._eventListener[aKey]);
	        });

	        this._scrollView.parentUpdated();
	    }

	    _createClass(ScrollContainer, [{
	        key: 'scrollTop',
	        value: function scrollTop(aScrollTop) {
	            if (arguments.length === 0) {
	                return this._container.scrollTop;
	            }

	            if (this._options.disableYScrolling) {
	                return;
	            }

	            if (aScrollTop < 0) {
	                aScrollTop = 0;
	            } else if (aScrollTop > this._container.scrollHeight - this._container.clientHeight) {
	                aScrollTop = this._container.scrollHeight - this._container.clientHeight;
	            }

	            this._scrollView.scrollTopUpdated(aScrollTop);
	            this._container.scrollTop = aScrollTop;
	        }
	    }, {
	        key: 'scrollLeft',
	        value: function scrollLeft(aScrollLeft) {
	            if (arguments.length === 0) {
	                return this._container.scrollLeft;
	            }

	            if (this._options.disableXScrolling) {
	                return;
	            }

	            if (aScrollLeft < 0) {
	                aScrollLeft = 0;
	            } else if (aScrollLeft > this._container.scrollWidth - this._container.clientWidth) {
	                aScrollLeft = this._container.scrollWidth - this._container.clientWidth;
	            }

	            this._scrollView.scrollLeftUpdated(aScrollLeft);
	            this._container.scrollLeft = aScrollLeft;
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

	    return ScrollContainer;
	}();

	ScrollContainer.ScrollView = _scrollview.ScrollView;
	ScrollContainer.scrollViewHelper = scrollViewHelper;

	var VERSION = exports.VERSION = "0.0.0-proofOfConcept";

/***/ }
/******/ ])
});
;