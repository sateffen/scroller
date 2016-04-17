'use strict';

/**
 * This function generates event handlers for a scrollbar element, based on given data.
 * Warning: You need to set the this context of this function to the scrollView instance you're working with!
 *
 * @param {string} aAttribute The attribute to use from the event for calculation
 * @param {string} aPropertyFactor The factor for scroll top and left to compensate for normal distances
 * @param {string} aParentWriteCallback The name for the callback where to write to
 * @returns {Object} An object containing event handlers for the scrollbar
 */
export function generateEventHandlerForElement(aAttribute, aPropertyFactor, aParentWriteCallback) {
    return {
        // of cause this should handle mouse down events
        mousedown: (aEvent) => {
            // first of all we need to prevent the default behaviour, because otherwise the mouse
            // event might get handled as drag along
            aEvent.preventDefault();
            // then setup some cache variables, that contain the last page value and the current
            // scroll value we want to modify
            let tmpMover = aEvent[aAttribute];
            let scrollPositionFloat = this._scrollerParent[aParentWriteCallback]();

            // then setup a pointer to the move function for registering and unregistering            
            let tmpMovePointer = (e) => {
                // here we calculate the new scrollPosition
                scrollPositionFloat += (e[aAttribute] - tmpMover) * this[aPropertyFactor];
                // save to the cache
                tmpMover = e[aAttribute];
                // and set the new scroll positioning. The callback will tell us, what it did with the value
                scrollPositionFloat = this._scrollerParent[aParentWriteCallback](Math.round(scrollPositionFloat));
            }

            // then we setup a function for the end function, which cleans up everything            
            let tmpEndPointer = (e) => {
                // for cleanup simply remove all event listeners
                document.body.removeEventListener('mousemove', tmpMovePointer);
                document.body.removeEventListener('mouseup', tmpEndPointer);
                document.body.removeEventListener('mouseleave', tmpEndPointer);

                // and null the pointers, just to make sure the GC can clean up everything                
                tmpMovePointer = null;
                tmpEndPointer = null;
            }

            // and add the created event listeners, so we can actually track the movement            
            document.body.addEventListener('mousemove', tmpMovePointer);
            document.body.addEventListener('mouseup', tmpEndPointer);
            document.body.addEventListener('mouseleave', tmpEndPointer);
        },
        // we want to track touch events as well
        touchstart: (aEvent) => {
            // first of all prevent the default, so the browser does nothing strange
            aEvent.preventDefault();
            // then we save the touch we want to track, so we provide multitouch support
            const touchToTrack = aEvent.which || 0;
            // and init the cache variables
            let tmpMover = aEvent.touches[touchToTrack][aAttribute];
            let scrollPositionFloat = this._scrollerParent[aParentWriteCallback]();

            // setup a move function, that we can register and unregister
            let tmpMovePointer = (e) => {
                // if it's not the correct touch to track, just do nothing
                if (e.which !== touchToTrack) {
                    return;
                }
                // first calculate the scroll new scroll position
                scrollPositionFloat += (e.touches[touchToTrack][aAttribute] - tmpMover) * this[aPropertyFactor];
                // then update the cache
                tmpMover = e.touches[touchToTrack][aAttribute];

                // and write the new scroll value
                scrollPositionFloat = this._scrollerParent[aParentWriteCallback](Math.round(scrollPositionFloat));
            }

            // and setup a clean up function, if the touch ends
            let tmpEndPointer = (e) => {
                // if the touch is the wrong one, we don't want to clean up, so do nothing
                if (e.which !== touchToTrack) {
                    return;
                }

                // cleanup the event listeners
                document.body.removeEventListener('touchmove', tmpMovePointer);
                document.body.removeEventListener('touchend', tmpEndPointer);
                document.body.removeEventListener('touchleave', tmpEndPointer);

                // and null some pointers for the GC
                tmpMovePointer = null;
                tmpEndPointer = null;
            }

            // finally add the event listners for the gesture
            document.body.addEventListener('touchmove', tmpMovePointer);
            document.body.addEventListener('touchend', tmpEndPointer);
            document.body.addEventListener('touchleave', tmpEndPointer);
        }
    }
}

/**
 * This applies the given options to the scrollbar elements
 *
 * @param {HTMLElement} aElement The scrollbar element to apply the options to
 * @param {string} aElementName The element name (xElement and yElement) to create the options read propertys from
 * @param {Object} aOptions The options to read from
 */
export function applyOptionsToScollBarElement(aElement, aElementName, aOptions) {
    // frist create the option keys, that should get read
    const stylesKey = aElementName + 'Styles';
    const classKey = aElementName + 'Class';

// then go for the style key and apply it to the element
    if (aOptions && aOptions[stylesKey] && typeof aOptions[stylesKey] === 'object' && !Array.isArray(aOptions[stylesKey])) {
        Object.keys(aOptions[stylesKey]).forEach((aKey) => {
            aElement.style[aKey] = aOptions[stylesKey][aKey];
        });
    }

    // then apply the classes to the elements
    if (aOptions && aOptions[classKey] && typeof aOptions[classKey] === 'string') {
        aElement.classList.add(aOptions[classKey]);
    }
    else if (aOptions && Array.isArray(aOptions[classKey])) {
        aOptions[classKey].forEach((aClass) => {
            aElement.classList.add(aClass);
        });
    }
}