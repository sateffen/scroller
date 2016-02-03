'use strict';

export function generateEventHandlerForElement(aAttribute, aPropertyFactor, aParentWriteCallback) {
    return {
        mousedown: (aEvent) => {
            aEvent.preventDefault();
            let tmpMover = aEvent[aAttribute];
            let scrollPositionFloat = this._scrollerParent[aParentWriteCallback]();

            let tmpMovePointer = (e) => {
                scrollPositionFloat += (e[aAttribute] - tmpMover) * this[aPropertyFactor];
                tmpMover = e[aAttribute];

                this._scrollerParent[aParentWriteCallback](Math.round(scrollPositionFloat));
            }

            let tmpEndPointer = (e) => {
                document.body.removeEventListener('mousemove', tmpMovePointer);
                document.body.removeEventListener('mouseup', tmpEndPointer);
                document.body.removeEventListener('mouseleave', tmpEndPointer);

                tmpMovePointer = null;
                tmpEndPointer = null;
            }

            document.body.addEventListener('mousemove', tmpMovePointer);
            document.body.addEventListener('mouseup', tmpEndPointer);
            document.body.addEventListener('mouseleave', tmpEndPointer);
        },
        touchstart: (aEvent) => {
            aEvent.preventDefault();
            let touchToTrack = aEvent.which || 0;
            let tmpMover = aEvent.touches[touchToTrack][aAttribute];
            let scrollPositionFloat = this._scrollerParent[aParentWriteCallback]();

            let tmpMovePointer = (e) => {
                if (e.which !== touchToTrack) {
                    return;
                }

                scrollPositionFloat += (e.touches[touchToTrack][aAttribute] - tmpMover) * this[aPropertyFactor];
                tmpMover = e.touches[touchToTrack][aAttribute];

                this._scrollerParent[aParentWriteCallback](Math.round(scrollPositionFloat));
            }

            let tmpEndPointer = (e) => {
                if (e.which !== touchToTrack) {
                    return;
                }

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
    }
}

export function applyOptionsToScollBarElement(aElement, aElementName, aOptions) {
    const stylesKey = aElementName + 'Styles';
    const classKey = aElementName + 'Class';

    if (aOptions && aOptions[stylesKey] && typeof aOptions[stylesKey] === 'object' && !Array.isArray(aOptions[stylesKey])) {
        Object.keys(aOptions[stylesKey]).forEach((aKey) => {
            aElement.style[aKey] = aOptions[stylesKey][aKey];
        });
    }


    if (aOptions && aOptions[classKey] && typeof aOptions[classKey] === 'string') {
        aElement.classList.add(aOptions[classKey]);
    }
    else if (aOptions && Array.isArray(aOptions[classKey])) {
        aOptions[classKey].forEach((aClass) => {
            aElement.classList.add(aClass);
        });
    }
}