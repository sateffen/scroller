'use strict';

export class YScrollBar {
    constructor(aParent) {
        this._element = document.createElement('div');
        this._parent = aParent;

        this._eventListener = {

        };

        this._parent.appendChild(this._element);
        this._element.style.position = 'absolute';
        this._element.style.width = '6px';
        this._element.style.backgroundColor = 'rgba(0,0,0,0.6)';
        this._element.style.borderRadius = '3px';
        this._element.style.top = '0px';
        this._element.style.right = '0px';

        Object.keys(this._eventListener).forEach((aKey) => {
            this._container.addEventListener(aKey, this._eventListener[aKey]);
        });

        this.parentUpdated();
        this.scrollTopUpdated(aParent.scrollTop);

        this._parent.appendChild(this._element);
    }

    scrollTopUpdated(aY) {
        if (this._parentScrollHeight > this._parentHeight) {
            let partSize = this._parent.scrollTop / (this._parentScrollHeight - this._parentHeight);
            partSize = partSize * (this._parentHeight - this._elementHeight);
            this._element.style.top = (this._parent.scrollTop + partSize) + 'px';
        }
    }

    parentUpdated() {
        this._parentHeight = this._parent.clientHeight;
        this._parentScrollHeight = this._parent.scrollHeight;
        this._elementHeight = this._parentHeight * this._parentHeight / this._parentScrollHeight;

        if (this._parentHeight < this._parentScrollHeight) {
            this._element.style.display = 'block';

            this._element.style.height = this._elementHeight + 'px';

            this.scrollTopUpdated(this._parent.scrollTop);
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