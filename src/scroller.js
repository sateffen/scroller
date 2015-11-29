'use strict';

import {XScrollBar} from './xscrollbar';
import {YScrollBar} from './yscrollbar';

class Scroller {
    constructor(aElement, aOptions) {
        this._container = aElement;
        this._xScrollElement = new Scroller.XScrollBar(this._container);
        this._yScrollElement = new Scroller.YScrollBar(this._container);

        this._eventListener = {
            wheel: (aEvent) => {
                this.setScrollTop(this._container.scrollTop + aEvent.deltaY);
                this.setScrollLeft(this._container.scrollLeft + aEvent.deltaX);
            }
        };

        let containerHeight = this._container.clientHeight;
        let containerWidth = this._container.clientWidth;
        let scrollHeight = this._container.scrollHeight;
        let scrollWidth = this._container.scrollWidth;

        this._intervalPointer = window.setInterval(() => {
            let p = this._container.parentElement;

            while (p != undefined && p !== document.body) {
                p = p.parentElement;
            }

            if (p == undefined) {
                this.destroy();
            }
            else if (
                containerHeight !== this._container.clientHeight ||
                containerWidth !== this._container.clientWidth ||
                scrollHeight !== this._container.scrollHeight ||
                scrollWidth !== this._container.scrollWidth
                ) {
                containerHeight = this._container.clientHeight;
                containerWidth = this._container.clientWidth;
                scrollHeight = this._container.scrollHeight;
                scrollWidth = this._container.scrollWidth;

                this._xScrollElement.parentUpdated();
                this._yScrollElement.parentUpdated();
            }
        }, 300);

        this._container.style.overflow = 'hidden';
        this._container.style.position = 'relative';

        Object.keys(this._eventListener).forEach((aKey) => {
            this._container.addEventListener(aKey, this._eventListener[aKey]);
        });

        this._xScrollElement.parentUpdated();
        this._yScrollElement.parentUpdated();
    }

    setScrollTop(aScrollTop) {
        this._container.scrollTop = aScrollTop;
        this._yScrollElement.scrollTopUpdated(aScrollTop);
    }

    setScrollLeft(aScrollLeft) {
        this._container.scrollLeft = aScrollLeft;
        this._xScrollElement.scrollLeftUpdated(aScrollLeft);
    }

    destroy() {
        window.clearInterval(this._intervalPointer);

        Object.keys(this._eventListener).forEach((aKey) => {
            this._container.removeEventListener(aKey, this._eventListener[aKey]);
        });

        this._xScrollElement.destroy();
        this._yScrollElement.destroy();

        this._xScrollElement = null;
        this._yScrollElement = null;
        this._container = null;
    }
}

Scroller.YScrollBar = YScrollBar;
Scroller.XScrollBar = XScrollBar;

let target = document.querySelector('#container');

let instance = new Scroller(target, {});