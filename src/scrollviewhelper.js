'use strict';

export function generateEventHandlerForElement(aAttribute, aParentWriteCallback) {
    return {
        mousedown: (aEvent) => {
            aEvent.preventDefault();
            let tmpMover = aEvent[aAttribute];

            let tmpMovePointer = (e) => {
                e.preventDefault();
                let distance = e[aAttribute] - tmpMover;
                tmpMover = e[aAttribute];

                this._scrollerParent[aParentWriteCallback](distance, 'add');
            }

            let tmpEndPointer = (e) => {
                e.preventDefault();
                document.body.removeEventListener('mousemove', tmpMovePointer);
                document.body.removeEventListener('mouseup', tmpEndPointer);
                document.body.removeEventListener('mouseleave', tmpEndPointer);

                let tmpMovePointer = null;
                let tmpEndPointer = null;
            }

            document.body.addEventListener('mousemove', tmpMovePointer);
            document.body.addEventListener('mouseup', tmpEndPointer);
            document.body.addEventListener('mouseleave', tmpEndPointer);
        },
        touchstart: (aEvent) => {
            aEvent.preventDefault();
            let touchToTrack = aEvent.which || 0;
            let tmpMover = aEvent.touches[touchToTrack][aAttribute];

            let tmpMovePointer = (e) => {
                if (e.which !== touchToTrack) {
                    return;
                }

                e.preventDefault();
                let distance = e.touches[touchToTrack][aAttribute] - tmpMover;
                tmpMover = e.touches[touchToTrack][aAttribute];

                this._scrollerParent[aParentWriteCallback](distance, 'add');
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
    }
}

export function applyOptionsToScollBarElement(aElement, aElementName, aOptions) {
    let stylesKey = aElementName + 'Styles';
    let classKey = aElement + 'Class';

    if (aOptions[stylesKey] && toString.call(aOptions[stylesKey]) === '[object Object]') {
        Object.keys(aOptions[stylesKey]).forEach((aKey) => {
            aElement.style[aKey] = aOptions[stylesKey][aKey];
        });
    }


    if (aOptions[classKey] && toString.call(aOptions[classKey]) === '[object String]') {
        aElement.classList.add(aOptions[classKey]);
    }
    else if (Array.isArray(aOptions[classKey])) {
        aOptions[classKey].forEach((aClass) => {
            aElement.classList.add(aClass);
        });
    }
}