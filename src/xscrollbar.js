'use strict';

export class XScrollBar {
    constructor(aParent) {
        this._element = document.createElement('div');
        this._parent = aParent;

        this._eventListener = {

        };

        this._parent.appendChild(this._element);
        this._element.style.position = 'absolute';
        this._element.style.height = '6px';
        this._element.style.backgroundColor = 'rgba(0,0,0,0.6)';
        this._element.style.borderRadius = '3px';
        this._element.style.bottom = '0px';
        this._element.style.left = '0px';

        Object.keys(this._eventListener).forEach((aKey) => {
            this._container.addEventListener(aKey, this._eventListener[aKey]);
        });

        this.parentUpdated();
        this.scrollLeftUpdated(aParent.scrollLeft);

        this._parent.appendChild(this._element);
    }

    scrollLeftUpdated(aY) {
        if (this._parentScrollWidth > this._parentWidth) {
            let partSize = this._parent.scrollLeft / (this._parentScrollWidth - this._parentWidth);
            partSize = partSize * (this._parentWidth - this._elementWidth);
            this._element.style.left = (this._parent.scrollLeft + partSize) + 'px';
        }
    }

    parentUpdated() {
        this._parentWidth = this._parent.clientWidth;
        this._parentScrollWidth = this._parent.scrollWidth;
        this._elementWidth = this._parentWidth * this._parentWidth / this._parentScrollWidth;

        if (this._parentWidth < this._parentScrollWidth) {
            this._element.style.display = 'block';

            this._element.style.width = this._elementWidth + 'px';

            this.scrollLeftUpdated(this._parent.scrollLeft);
        }
        else {
            this._element.style.display = 'none';
        }
    }

    destroy() {
        Object.keys(this._eventListener).forEach((aKey) => {
            this._container.removeEventListener(aKey, this._eventListener[aKey]);
        });
    }
}