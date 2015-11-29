'use strict';

export class ScrollView {
    constructor(aParentInstance, aOptions) {
        this._parent = aParentInstance._container;
        this._scrollerParent = aParentInstance;
        this._xElement = document.createElement('div');
        this._yElement = document.createElement('div');

        let tmpMover = null;
        let tmpMovePointer = null;
        let tmpEndPointer = null;

        this._xEventListener = {
            mousedown: (aEvent) => {
                aEvent.preventDefault();
                tmpMover = aEvent.pageX;

                tmpMovePointer = (e) => {
                    e.preventDefault();
                    let distance = e.pageX - tmpMover;
                    tmpMover = e.pageX;

                    aParentInstance.setScrollLeft(this._parent.scrollLeft + distance);
                }

                tmpEndPointer = (e) => {
                    e.preventDefault();
                    document.body.removeEventListener('mousemove', tmpMovePointer);
                    document.body.removeEventListener('mouseup', tmpEndPointer);
                }

                document.body.addEventListener('mousemove', tmpMovePointer);
                document.body.addEventListener('mouseup', tmpEndPointer);
            }
        };

        this._yEventListener = {
            mousedown: (aEvent) => {
                aEvent.preventDefault();
                tmpMover = aEvent.pageY;

                tmpMovePointer = (e) => {
                    e.preventDefault();
                    let distance = e.pageY - tmpMover;
                    tmpMover = e.pageY;

                    aParentInstance.setScrollTop(this._parent.scrollTop + distance);
                }

                tmpEndPointer = (e) => {
                    e.preventDefault();
                    document.body.removeEventListener('mousemove', tmpMovePointer);
                    document.body.removeEventListener('mouseup', tmpEndPointer);
                    
                    tmpMovePointer = null;
                    tmpEndPointer = null;
                }

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

        Object.keys(this._xEventListener).forEach((aKey) => {
            this._xElement.addEventListener(aKey, this._xEventListener[aKey]);
        });

        Object.keys(this._yEventListener).forEach((aKey) => {
            this._yElement.addEventListener(aKey, this._yEventListener[aKey]);
        });

        this.parentUpdated();
        this.scrollTopUpdated();
        this.scrollLeftUpdated();
    }

    scrollTopUpdated() {
        if (this._parentScrollHeight > this._parentHeight) {
            let partSize = this._parent.scrollTop / (this._parentScrollHeight - this._parentHeight);
            partSize = partSize * (this._parentHeight - this._elementHeight);
            this._yElement.style.top = (this._parent.scrollTop + partSize) + 'px';
        }

        this._xElement.style.top = (this._parent.scrollTop + this._parentHeight - 6) + 'px';
    }

    scrollLeftUpdated() {
        if (this._parentScrollWidth > this._parentWidth) {
            let partSize = this._parent.scrollLeft / (this._parentScrollWidth - this._parentWidth);
            partSize = partSize * (this._parentWidth - this._elementWidth);
            this._xElement.style.left = (this._parent.scrollLeft + partSize) + 'px';
        }

        this._yElement.style.left = (this._parent.scrollLeft + this._parentWidth - 6) + 'px';
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
    }
}