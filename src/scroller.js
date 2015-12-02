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
            let potentialRootElement = this._container.parentElement;

            while (potentialRootElement != undefined && potentialRootElement !== document.body) {
                potentialRootElement = potentialRootElement.parentElement;
            }

            if (potentialRootElement == undefined) {
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
        }, aOptions.checkInterval || 300);

        this._container.style.overflow = 'hidden';
        this._container.style.position = 'relative';

        Object.keys(this._eventListener).forEach((aKey) => {
            this._container.addEventListener(aKey, this._eventListener[aKey]);
        });

        this._scrollView.parentUpdated();
    }

    setScrollTop(aScrollTop, aOperation) {
        switch (aOperation) {
            case 'add':
                this._container.scrollTop += aScrollTop;
                break;
            case 'substract':
                this._container.scrollTop -= aScrollTop;
                break;
            default:
                this._container.scrollTop = aScrollTop;
                break;
        }

        this._scrollView.scrollTopUpdated(this._container.scrollTop);
    }

    setScrollLeft(aScrollLeft, aOperation) {
        switch (aOperation) {
            case 'add':
                this._container.scrollLeft += aScrollLeft;
                break;
            case 'substract':
                this._container.scrollLeft -= aScrollLeft;
                break;
            default:
                this._container.scrollLeft = aScrollLeft;
                break;
        }

        this._scrollView.scrollLeftUpdated(this._container.scrollLeft);
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