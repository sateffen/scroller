'use strict';

import {generateEventHandlerForElement, applyOptionsToScollBarElement} from './scrollviewhelper'

export class ScrollView {
    constructor(aParentInstance, aOptions) {
        this._parent = aParentInstance._container;
        this._scrollerParent = aParentInstance;
        // setup scroller elements
        this._xElement = document.createElement('div');
        this._yElement = document.createElement('div');

        // create the event handler for the scroller elements
        this._xEventListener = generateEventHandlerForElement.call(this, 'pageX', 'setScrollLeft');
        this._yEventListener = generateEventHandlerForElement.call(this, 'pageY', 'setScrollTop');

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
        applyOptionsToScollBarElement(this._xElement, 'xElement', aOptions);
        applyOptionsToScollBarElement(this._yElement, 'yElement', aOptions);

        // and append the elements to the DOM tree
        if (!aOptions.disableXScrolling) {
            this._parent.appendChild(this._xElement);
        }
        if (!aOptions.disableYScrolling) {
            this._parent.appendChild(this._yElement);
        }
        
        // then append the event listeners to x
        Object.keys(this._xEventListener).forEach((aKey) => {
            this._xElement.addEventListener(aKey, this._xEventListener[aKey]);
        });
        
        // and y
        Object.keys(this._yEventListener).forEach((aKey) => {
            this._yElement.addEventListener(aKey, this._yEventListener[aKey]);
        });

        // and call all update functions initially
        this.parentUpdated();
        this.scrollTopUpdated(this._parent.scrollTop);
        this.scrollLeftUpdated(this._parent.scrollLeft);
    }

    scrollTopUpdated(aScrollTop) {
        if (this._parentScrollHeight > this._parentHeight) {
            let partSize = aScrollTop / (this._parentScrollHeight - this._parentHeight);
            partSize = partSize * (this._parentHeight - this._elementHeight);
            this._yElement.style.top = (aScrollTop + partSize) + 'px';
        }

        this._xElement.style.top = (aScrollTop + this._parentHeight - 6) + 'px';
    }

    scrollLeftUpdated(aScrollLeft) {
        if (this._parentScrollWidth > this._parentWidth) {
            let partSize = aScrollLeft / (this._parentScrollWidth - this._parentWidth);
            partSize = partSize * (this._parentWidth - this._elementWidth);
            this._xElement.style.left = (aScrollLeft + partSize) + 'px';
        }

        this._yElement.style.left = (aScrollLeft + this._parentWidth - 6) + 'px';
    }

    parentUpdated() {
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
        }
        else {
            this._xElement.style.display = 'none';
        }

        if (this._parentHeight < this._parentScrollHeight) {
            this._yElement.style.display = 'block';
            this._yElement.style.height = this._elementHeight + 'px';

            this.scrollTopUpdated(this._parent.scrollTop);
        }
        else {
            this._yElement.style.display = 'none';
        }
    }

    destroy() {
        Object.keys(this._xEventListener).forEach((aKey) => {
            this._xElement.removeEventListener(aKey, this._xEventListener[aKey]);
        });

        Object.keys(this._yEventListener).forEach((aKey) => {
            this._yElement.removeEventListener(aKey, this._yEventListener[aKey]);
        });

        this._parent = null;
        this._scrollerParent = null;
        this._xElement = null;
        this._yElement = null;
    }
}