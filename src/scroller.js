'use strict';

import {ScrollView} from './scrollview';

class Scroller {
    constructor(aElement, aOptions) {
        this._container = aElement;
        this._scrollView = new Scroller.ScrollView(this, aOptions);

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

                this._scrollView.parentUpdated();
            }
        }, 300);

        this._container.style.overflow = 'hidden';
        this._container.style.position = 'relative';

        Object.keys(this._eventListener).forEach((aKey) => {
            this._container.addEventListener(aKey, this._eventListener[aKey]);
        });

        this._scrollView.parentUpdated();
    }

    setScrollTop(aScrollTop) {
        this._container.scrollTop = aScrollTop;
        this._scrollView.scrollTopUpdated(aScrollTop);
    }

    setScrollLeft(aScrollLeft) {
        this._container.scrollLeft = aScrollLeft;
        this._scrollView.scrollLeftUpdated(aScrollLeft);
    }

    destroy() {
        window.clearInterval(this._intervalPointer);

        Object.keys(this._eventListener).forEach((aKey) => {
            this._container.removeEventListener(aKey, this._eventListener[aKey]);
        });

        this._scrollView.destroy();

        this._scrollView = null;
        this._container = null;
    }
}

Scroller.ScrollView = ScrollView;

let target = document.querySelector('#container');

let instance = new Scroller(target, {});