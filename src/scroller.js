/*global PKG_VERSION*/
'use strict';

import {ScrollView} from './scrollview';

export class ScrollContainer {
    constructor(aElement, aOptions = {}) {
        this._container = aElement;
        this._scrollView = new ScrollContainer.ScrollView(this, aOptions);
        this._options = aOptions;

        this._eventListener = {
            wheel: (aEvent) => {
                this.setScrollTop(this._container.scrollTop + aEvent.deltaY);
                this.setScrollLeft(this._container.scrollLeft + aEvent.deltaX);
            },
            touchstart: (aEvent) => {
                if (aEvent.defaultPrevented || aOptions.disableTouchScrollingOnContainer) {
                    return;
                }
                
                aEvent.preventDefault();
                let touchToTrack = aEvent.which || 0;
                let tmpMoverX = aEvent.touches[touchToTrack].pageX;
                let tmpMoverY = aEvent.touches[touchToTrack].pageY;

                let tmpMovePointer = (e) => {
                    if (e.which !== touchToTrack) {
                        return;
                    }

                    e.preventDefault();
                    let distanceX = tmpMoverX - e.touches[touchToTrack].pageX;
                    let distanceY = tmpMoverY - e.touches[touchToTrack].pageY;

                    tmpMoverX = e.touches[touchToTrack].pageX;
                    tmpMoverY = e.touches[touchToTrack].pageY;

                    this.setScrollTop(distanceY, 'add');
                    this.setScrollLeft(distanceX, 'add');
                }

                let tmpEndPointer = (e) => {
                    if (e.which !== touchToTrack) {
                        return;
                    }

                    e.preventDefault();
                    document.body.removeEventListener('touchmove', tmpMovePointer);
                    document.body.removeEventListener('touchend', tmpEndPointer);
                    document.body.removeEventListener('touchleave', tmpEndPointer);

                    tmpMovePointer = null;
                    tmpEndPointer = null;
                }

                document.body.addEventListener('touchmove', tmpMovePointer);
                document.body.addEventListener('touchend', tmpEndPointer);
                document.body.addEventListener('touchleave', tmpEndPointer);
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

    scrollTop(aScrollTop) {
        if (arguments.length === 0) {
            return this._container.scrollTop;
        }
        
        if (this._options.disableYScrolling) {
            return;
        }
        
        if (aScrollTop < 0) {
            aScrollTop = 0;
        }
        else if (aScrollTop > this._container.scrollHeight - this._container.clientHeight) {
            aScrollTop = this._container.scrollHeight - this._container.clientHeight;
        }

        this._scrollView.scrollTopUpdated(aScrollTop);
        this._container.scrollTop = aScrollTop;
    }

    scrollLeft(aScrollLeft) {
        if (arguments.length === 0) {
            return this._container.scrollLeft;
        }
        
        if (this._options.disableXScrolling) {
            return;
        }

        if (aScrollLeft < 0) {
            aScrollLeft = 0;
        }
        else if (aScrollLeft > this._container.scrollWidth - this._container.clientWidth) {
            aScrollLeft = this._container.scrollWidth - this._container.clientWidth;
        }

        this._scrollView.scrollLeftUpdated(aScrollLeft);
        this._container.scrollLeft = aScrollLeft;
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

ScrollContainer.ScrollView = ScrollView;

export const VERSION = PKG_VERSION;