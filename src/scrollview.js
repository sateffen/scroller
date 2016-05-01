'use strict';

import {generateEventHandlerForElement, applyOptionsToScollBarElement} from './scrollviewhelper';

/**
 * The scrollView is the visual representation of the current scroll state. While the scroll
 * container knows about the scroll state itself, it doesn't indicate it to the user. The
 * scrollView visualizes the current scroll state for the user, in this case by showing scrollbars.
 */
export class ScrollView {
    /**
     * This constructor sets up all elements and handlers needed to visualize normal scrollbars
     *
     * @param {ScrollContainer} aParentInstance The parent ScrollContainer instance
     * @param {Object} aOptions The options of the parent instance for styling the scollbars
     */
    constructor(aParentInstance, aOptions) {
        // first save the details about the parent instance and it's container element
        this._parent = aParentInstance._container;
        this._scrollerParent = aParentInstance;
        this._options = aOptions;

        // then calculate a scroll factor, that is used for scrolling with the scrollbars itself.
        // The problem is, that if the user grabs the vertical scrollbar, and drags it 10px down
        // the scrollTop changed not only by ten, but 10*scrollheight/height. This is because of
        // the absolute positioning relative to the parent
        this._scrollHeightFactor = this._parent.scrollHeight / this._parent.clientHeight;
        this._scrollWidthFactor = this._parent.scrollWidth / this._parent.clientWidth;

        // setup scroll elements
        this._xElement = document.createElement('div');
        this._yElement = document.createElement('div');

        // create the event handler for the scroll elements if it's not disabled
        if (!aOptions.disableMouseInteractionWithScrollbars) {
            this._xEventListener = generateEventHandlerForElement.call(this, 'pageX', '_scrollWidthFactor', 'scrollLeft');
            this._yEventListener = generateEventHandlerForElement.call(this, 'pageY', '_scrollHeightFactor', 'scrollTop');
        }
        else {
            this._xEventListener = {};
            this._yEventListener = {};
        }

        // style some x specific things
        this._xElement.style.height = '0px';
        this._xElement.style.left = '0px';
        this._xElement.style.position = 'absolute';

        // style some y specific things
        this._yElement.style.width = '0px';
        this._yElement.style.top = '0px';
        this._yElement.style.position = 'absolute';

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
    }

    /**
     * This method handles updating the scrollTop property to the scrollbars. Every time
     * the parent scrollTop changes, this recalculates the style
     *
     * @param {number} aScrollTop
     */
    scrollTopUpdated(aScrollTop) {
        if (this._parentScrollHeight > this._parentHeight) {
            let partSize = aScrollTop / (this._parentScrollHeight - this._parentHeight);
            partSize = partSize * (this._parentHeight - this._elementHeight);
            this._yElement.style.top = (aScrollTop + partSize) + 'px';
        }

        this._xElement.style.top = Math.floor(aScrollTop + this._parentHeight) + 'px';
    }

    /**
     * This method handles updating the scrollLeft property to the scrollbars. Every time
     * the parent scrollLeft changes, this recalculates the style
     *
     * @param {number} aScrollLeft
     */
    scrollLeftUpdated(aScrollLeft) {
        if (this._parentScrollWidth > this._parentWidth) {
            let partSize = aScrollLeft / (this._parentScrollWidth - this._parentWidth);
            partSize = partSize * (this._parentWidth - this._elementWidth);
            this._xElement.style.left = (aScrollLeft + partSize) + 'px';
        }

        this._yElement.style.left = Math.floor(aScrollLeft + this._parentWidth) + 'px';
    }

    /**
     * This method handles the case, that the parent has updates. All data gets updated
     * and recalculated here.
     */
    parentUpdated() {
        // read and recalculate all needed data
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
            // check if the xMinSize option is available and if the element is too small
            if (typeof this._options.xMinSize === 'number' && this._elementWidth < this._options.xMinSize) {
                this._elementWidth = this._options.xMinSize;
            }

            this.scrollTopUpdated(this._parent.scrollTop);
            this._xElement.style.display = 'block';
            this._xElement.style.width = this._elementWidth + 'px';
        }
        else {
            this._xElement.style.display = 'none';
        }

        // determine visibility of y element
        if (this._parentHeight < this._parentScrollHeight) {
            // check if the yMinSize option is available and if the element is too small
            if (typeof this._options.yMinSize === 'number' && this._elementHeight < this._options.yMinSize) {
                this._elementHeight = this._options.yMinSize;
            }

            this.scrollLeftUpdated(this._parent.scrollLeft);
            this._yElement.style.display = 'block';
            this._yElement.style.height = this._elementHeight + 'px';
        }
        else {
            this._yElement.style.display = 'none';
        }
    }

    /**
     * This method is like the destructor of casual classes. When this is called,
     * the instance of this class is practically useless. This frees all resources
     * for the GC.
     */
    destroy() {
        // first remove all event listeners for x
        Object.keys(this._xEventListener).forEach((aKey) => {
            this._xElement.removeEventListener(aKey, this._xEventListener[aKey]);
        });
        // and y
        Object.keys(this._yEventListener).forEach((aKey) => {
            this._yElement.removeEventListener(aKey, this._yEventListener[aKey]);
        });

        // then remove the elements from DOM if they are appended
        if (!this._options.disableXScrolling) {
            this._parent.removeChild(this._xElement);
        }
        if (!this._options.disableYScrolling) {
            this._parent.removeChild(this._yElement);
        }

        // and finally null all data, so the GC can clean it up        
        this._parent = null;
        this._scrollerParent = null;
        this._xElement = null;
        this._yElement = null;
    }
}