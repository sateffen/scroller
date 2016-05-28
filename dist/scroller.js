!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.scroller=t():e.scroller=t()}(this,function(){return function(e){function t(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(t.s=2)}([function(e,t){"use strict";function n(e,t,n){var i=this;return{mousedown:function(o){o.preventDefault();var r=o[e],l=i._scrollerParent[n](),s=function(o){l+=(o[e]-r)*i[t],r=o[e],l=i._scrollerParent[n](Math.round(l))},c=function(e){document.body.removeEventListener("mousemove",s),document.body.removeEventListener("mouseup",c),document.body.removeEventListener("mouseleave",c),s=null,c=null};document.body.addEventListener("mousemove",s),document.body.addEventListener("mouseup",c),document.body.addEventListener("mouseleave",c)},touchstart:function(o){o.preventDefault();var r=o.which||0,l=o.touches[r][e],s=i._scrollerParent[n](),c=function(o){o.which===r&&(s+=(o.touches[r][e]-l)*i[t],l=o.touches[r][e],s=i._scrollerParent[n](Math.round(s)))},h=function(e){e.which===r&&(document.body.removeEventListener("touchmove",c),document.body.removeEventListener("touchend",h),document.body.removeEventListener("touchleave",h),c=null,h=null)};document.body.addEventListener("touchmove",c),document.body.addEventListener("touchend",h),document.body.addEventListener("touchleave",h)}}}function i(e,t,n){var i=t+"Styles",r=t+"Class";n&&n[i]&&"object"===o(n[i])&&!Array.isArray(n[i])&&Object.keys(n[i]).forEach(function(t){e.style[t]=n[i][t]}),n&&n[r]&&"string"==typeof n[r]?e.classList.add(n[r]):n&&Array.isArray(n[r])&&n[r].forEach(function(t){e.classList.add(t)})}Object.defineProperty(t,"__esModule",{value:!0});var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e};t.generateEventHandlerForElement=n,t.applyOptionsToScollBarElement=i},function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.ScrollView=void 0;var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),r=n(0);t.ScrollView=function(){function e(t,n){var o=this;i(this,e),this._parent=t._container,this._scrollerParent=t,this._options=n,this._scrollHeightFactor=this._parent.scrollHeight/this._parent.clientHeight,this._scrollWidthFactor=this._parent.scrollWidth/this._parent.clientWidth,this._xElement=document.createElement("div"),this._yElement=document.createElement("div"),n.disableMouseInteractionWithScrollbars?(this._xEventListener={},this._yEventListener={}):(this._xEventListener=r.generateEventHandlerForElement.call(this,"pageX","_scrollWidthFactor","scrollLeft"),this._yEventListener=r.generateEventHandlerForElement.call(this,"pageY","_scrollHeightFactor","scrollTop")),this._xElement.style.height="0px",this._xElement.style.left="0px",this._xElement.style.position="absolute",this._yElement.style.width="0px",this._yElement.style.top="0px",this._yElement.style.position="absolute",(0,r.applyOptionsToScollBarElement)(this._xElement,"xElement",n),(0,r.applyOptionsToScollBarElement)(this._yElement,"yElement",n),n.disableXScrolling||this._parent.appendChild(this._xElement),n.disableYScrolling||this._parent.appendChild(this._yElement),Object.keys(this._xEventListener).forEach(function(e){o._xElement.addEventListener(e,o._xEventListener[e])}),Object.keys(this._yEventListener).forEach(function(e){o._yElement.addEventListener(e,o._yEventListener[e])}),this.parentUpdated()}return o(e,[{key:"scrollTopUpdated",value:function(e){if(this._parentScrollHeight>this._parentHeight){var t=e/(this._parentScrollHeight-this._parentHeight);t*=this._parentHeight-this._elementHeight,this._yElement.style.top=e+t+"px"}this._xElement.style.top=Math.floor(e+this._parentHeight)+"px"}},{key:"scrollLeftUpdated",value:function(e){if(this._parentScrollWidth>this._parentWidth){var t=e/(this._parentScrollWidth-this._parentWidth);t*=this._parentWidth-this._elementWidth,this._xElement.style.left=e+t+"px"}this._yElement.style.left=Math.floor(e+this._parentWidth)+"px"}},{key:"parentUpdated",value:function(){this._parentWidth=this._parent.clientWidth,this._parentScrollWidth=this._parent.scrollWidth,this._elementWidth=this._parentWidth*this._parentWidth/this._parentScrollWidth,this._parentHeight=this._parent.clientHeight,this._parentScrollHeight=this._parent.scrollHeight,this._elementHeight=this._parentHeight*this._parentHeight/this._parentScrollHeight,this._scrollHeightFactor=this._parent.scrollHeight/this._parent.clientHeight,this._scrollWidthFactor=this._parent.scrollWidth/this._parent.clientWidth,this._parentWidth<this._parentScrollWidth?("number"==typeof this._options.xMinSize&&this._elementWidth<this._options.xMinSize&&(this._elementWidth=this._options.xMinSize),this.scrollTopUpdated(this._parent.scrollTop),this._xElement.style.display="block",this._xElement.style.width=this._elementWidth+"px"):this._xElement.style.display="none",this._parentHeight<this._parentScrollHeight?("number"==typeof this._options.yMinSize&&this._elementHeight<this._options.yMinSize&&(this._elementHeight=this._options.yMinSize),this.scrollLeftUpdated(this._parent.scrollLeft),this._yElement.style.display="block",this._yElement.style.height=this._elementHeight+"px"):this._yElement.style.display="none"}},{key:"destroy",value:function(){var e=this;Object.keys(this._xEventListener).forEach(function(t){e._xElement.removeEventListener(t,e._xEventListener[t])}),Object.keys(this._yEventListener).forEach(function(t){e._yElement.removeEventListener(t,e._yEventListener[t])}),this._options.disableXScrolling||this._parent.removeChild(this._xElement),this._options.disableYScrolling||this._parent.removeChild(this._yElement),this._parent=null,this._scrollerParent=null,this._xElement=null,this._yElement=null}}]),e}()},function(e,t,n){"use strict";function i(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t["default"]=e,t}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0}),t.VERSION=t.ScrollContainer=void 0;var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),l=n(1),s=n(0),c=i(s),h=t.ScrollContainer=function(){function e(t){var n=this,i=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];o(this,e),this._container=t,this._options=i,this._scrollView=new e.ScrollView(this,i),this._eventListener={wheel:function(e){n.scrollTop(n._container.scrollTop+e.deltaY),n.scrollLeft(n._container.scrollLeft+e.deltaX)},touchstart:function(e){if(!e.defaultPrevented&&!i.disableTouchScrollingOnContainer){var t=e.which||0,o=e.touches[t].pageX,r=e.touches[t].pageY,l=function(e){if(e.which===t){var i=o-e.touches[t].pageX,l=r-e.touches[t].pageY;o=e.touches[t].pageX,r=e.touches[t].pageY,n.scrollTop(n._container.scrollTop+l),n.scrollLeft(n._container.scrollLeft+i)}},s=function(e){e.which===t&&(document.body.removeEventListener("touchmove",l),document.body.removeEventListener("touchend",s),document.body.removeEventListener("touchleave",s),l=null,s=null)};document.body.addEventListener("touchmove",l),document.body.addEventListener("touchend",s),document.body.addEventListener("touchleave",s)}}},this._intervalPointer=window.setInterval(this.createIntervalHandler(),i.checkInterval||300),this._container.style.overflow="hidden";var r=window.getComputedStyle(this._container,null).getPropertyValue("position");"absolute"!==r&&"relative"!==r&&(this._container.style.position="relative"),Object.keys(this._eventListener).forEach(function(e){n._container.addEventListener(e,n._eventListener[e])}),this._scrollTop=0,this._scrollLeft=0,this._scrollView.parentUpdated()}return r(e,[{key:"createIntervalHandler",value:function(){var e=this,t=this._container.clientHeight,n=this._container.clientWidth,i=this._container.scrollHeight,o=this._container.scrollWidth;return function(){for(var r=e._container.parentElement;void 0!=r&&r!==document.body;)r=r.parentElement;var l=e._scrollTop,s=e._scrollLeft;e._scrollView.scrollTopUpdated(0),e._scrollView.scrollLeftUpdated(0),void 0==r?e.destroy():t===e._container.clientHeight&&n===e._container.clientWidth&&i===e._container.scrollHeight&&o===e._container.scrollWidth||(t=e._container.clientHeight,n=e._container.clientWidth,i=e._container.scrollHeight,o=e._container.scrollWidth,e._scrollView.parentUpdated()),e._scrollTop!==e._container.scrollTop?e.scrollTop(e._container.scrollTop):i>l&&e._scrollView.scrollTopUpdated(l),e._scrollLeft!==e._container.scrollLeft?e.scrollLeft(e._container.scrollLeft):o>s&&e._scrollView.scrollLeftUpdated(s)}}},{key:"scrollTop",value:function(e){return"number"!=typeof e||this._options.disableYScrolling?this._container.scrollTop:(0>e?e=0:e>this._container.scrollHeight-this._container.clientHeight&&(e=this._container.scrollHeight-this._container.clientHeight),this._scrollTop!==e&&(this._scrollView.scrollTopUpdated(e),this._container.scrollTop=e,this._scrollTop=e),e)}},{key:"scrollLeft",value:function(e){return 0===arguments.length||this._options.disableXScrolling?this._container.scrollLeft:(0>e?e=0:e>this._container.scrollWidth-this._container.clientWidth&&(e=this._container.scrollWidth-this._container.clientWidth),this._scrollLeft!==e&&(this._scrollView.scrollLeftUpdated(e),this._container.scrollLeft=e,this._scrollLeft=e),e)}},{key:"destroy",value:function(){var e=this;window.clearInterval(this._intervalPointer),Object.keys(this._eventListener).forEach(function(t){e._container.removeEventListener(t,e._eventListener[t])}),this._scrollView.destroy(),this._scrollView=null,this._container=null}}]),e}();h.ScrollView=l.ScrollView,h.scrollViewHelper=c;t.VERSION="1.0.0"}])});