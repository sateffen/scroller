/*global PKG_VERSION*/
'use strict';

/**
 * If you're looking in this code, you usually want to know, how this works. It might look
 * some kind of messy, but the code itself is logically structured. If you don't get some
 * struct, just ask.
 */

import {ScrollView} from './scrollview';
import * as scrollViewHelper from './scrollviewhelper';

/**
 * The scroll container represents the main element, which contains too long
 * content. It'll detect everything by itself and acts based on your configuration.
 * The visualization is not done here, it's done in the ScrollView
 */
export class ScrollContainer {
    /**
     * Here is the main starting point. The constructor will set up all events and the
     * scrollView.
     * Warning: The container elements needs to serve as container for absolute elements.
     * To garantee this, the style is changed to position=relative if it's not already
     * relative or absolute.
     *
     * @param {HTMLElement} aElement The element that should be scrollable
     * @param {Object} [aOptions = {}] The provided options. For details see README.md
     */
    constructor(aElement, aOptions = {}) {
        // first save the given values
        this._container = aElement;
        this._options = aOptions;
        // then create a new scrollView, based on the ScrollContainers static property
        this._scrollView = new ScrollContainer.ScrollView(this, aOptions);

        // Then setup the event listeners, that help scrolling in the container. This is
        // done in a saved object, not as methods, so we can easily add and remove the
        // eventlisteners        
        this._eventListener = {
            // on scroll just add the scroll delta to behave naturally
            wheel: (aEvent) => {
                this.scrollTop(this._container.scrollTop + aEvent.deltaY);
                this.scrollLeft(this._container.scrollLeft + aEvent.deltaX);
            },
            // on touch see, if there is touch disabled, and if not, handle scroll like
            // most people know it
            touchstart: (aEvent) => {
                if (aEvent.defaultPrevented || aOptions.disableTouchScrollingOnContainer) {
                    return;
                }

                // save a pointer to the touch to track. This should help to support multitouch                
                const touchToTrack = aEvent.which || 0;
                // and save temporary variables for the move calculation
                let tmpMoverX = aEvent.touches[touchToTrack].pageX;
                let tmpMoverY = aEvent.touches[touchToTrack].pageY;

                // then setup a move function pointer                
                let tmpMovePointer = (e) => {
                    // which only tracks the correct touch
                    if (e.which !== touchToTrack) {
                        return;
                    }

                    // calculates the distance
                    const distanceX = tmpMoverX - e.touches[touchToTrack].pageX;
                    const distanceY = tmpMoverY - e.touches[touchToTrack].pageY;

                    tmpMoverX = e.touches[touchToTrack].pageX;
                    tmpMoverY = e.touches[touchToTrack].pageY;

                    // and triggers an update for scrollTop and scrollLeft
                    this.scrollTop(this._container.scrollTop + distanceY);
                    this.scrollLeft(this._container.scrollLeft + distanceX);
                }

                // finally setup a pointer to a touchend function handler                
                let tmpEndPointer = (e) => {
                    // which only reacts to the correct touch
                    if (e.which !== touchToTrack) {
                        return;
                    }
                    // deregisters the event handlers
                    document.body.removeEventListener('touchmove', tmpMovePointer);
                    document.body.removeEventListener('touchend', tmpEndPointer);
                    document.body.removeEventListener('touchleave', tmpEndPointer);

                    // and nulls the pointer for freeing memory                    
                    tmpMovePointer = null;
                    tmpEndPointer = null;
                }

                // and finally add the event handlers, so this will actually work correctly                
                document.body.addEventListener('touchmove', tmpMovePointer);
                document.body.addEventListener('touchend', tmpEndPointer);
                document.body.addEventListener('touchleave', tmpEndPointer);
            }
        };

        // then setup an interval, that executes the interval handler and checks the container
        // for changes        
        this._intervalPointer = window.setInterval(this.createIntervalHandler(), aOptions.checkInterval || 300);

        // then go and set the style for the container element. It's important to disable overflow
        // and set the container to some style, that acts as container for absolute elements        
        this._container.style.overflow = 'hidden';
        const currentPositionStyle = window.getComputedStyle(this._container, null).getPropertyValue('position');
        if (currentPositionStyle !== 'absolute' && currentPositionStyle !== 'relative') {
            this._container.style.position = 'relative';
        }

        // then attach all event handlers to the container        
        Object.keys(this._eventListener).forEach((aKey) => {
            this._container.addEventListener(aKey, this._eventListener[aKey]);
        });

        this._scrollTop = 0;        
        this._scrollLeft = 0;        
        // and tell the scrollView to execute a parentUpdated       
        this._scrollView.parentUpdated();
    }

    /**
     * This function creates a closure, that handles update checks.
     */
    createIntervalHandler() {
        // setup some variables, that serve as cache for the closure
        let containerHeight = this._container.clientHeight;
        let containerWidth = this._container.clientWidth;
        let scrollHeight = this._container.scrollHeight;
        let scrollWidth = this._container.scrollWidth;

        // then return the closure function
        return () => {
            // search for the root element of this element
            let potentialRootElement = this._container.parentElement;
            while (potentialRootElement != undefined && potentialRootElement !== document.body) {
                potentialRootElement = potentialRootElement.parentElement;
            }

            // if there is no root element            
            if (potentialRootElement == undefined) {
                // simply destroy everything, because we are detached from DOM
                this.destroy();
            }
            // else check if something has changed
            else if (
                containerHeight !== this._container.clientHeight ||
                containerWidth !== this._container.clientWidth ||
                scrollHeight !== this._container.scrollHeight ||
                scrollWidth !== this._container.scrollWidth
            ) {
                // and if something has changed, refresh the cache
                containerHeight = this._container.clientHeight;
                containerWidth = this._container.clientWidth;
                scrollHeight = this._container.scrollHeight;
                scrollWidth = this._container.scrollWidth;

                // and tell the scrollView about the parent update                
                this._scrollView.parentUpdated();
            }

            if (this._scrollTop !== this._container.scrollTop) {
                this.scrollTop(this._container.scrollTop);
                console.log('SCROLL TOP UPDATED')
            }
            
            if (this._scrollLeft !== this._container.scrollLeft) {
                this.scrollLeft(this._container.scrollLeft);
            }
        };
    }

    /**
     * This function serves as getter and setter for the scrollTop value
     *
     * @returns {number} The new scrollTop value
     */
    scrollTop(aScrollTop) {
        // If this method was called with something else than a number, or scrolling is
        // completly disabled, just return the scroll top and do nothing else
        if (typeof aScrollTop !== 'number' || this._options.disableYScrolling) {
            return this._container.scrollTop;
        }

        // then validate the scrollTop value
        if (aScrollTop < 0) {
            aScrollTop = 0;
        }
        else if (aScrollTop > this._container.scrollHeight - this._container.clientHeight) {
            aScrollTop = this._container.scrollHeight - this._container.clientHeight;
        }

        // if the scroll top has changed
        if (this._scrollTop !== aScrollTop) {
            // call the update trigger and save the scroll top value
            this._scrollView.scrollTopUpdated(aScrollTop);
            this._container.scrollTop = aScrollTop;
            this._scrollTop = aScrollTop;
        }

        // finally simply return the scrollTop value        
        return aScrollTop;
    }

    /**
     * This function serves as getter and setter for the scrollLeft value
     *
     * @returns {number} The new scrollLeft value
     */
    scrollLeft(aScrollLeft) {
        // If this method was called with something else than a number, or scrolling is
        // completly disabled, just return the scroll top and do nothing else
        if (arguments.length === 0 || this._options.disableXScrolling) {
            return this._container.scrollLeft;
        }

        // now validate the scrollLeft value        
        if (aScrollLeft < 0) {
            aScrollLeft = 0;
        }
        else if (aScrollLeft > this._container.scrollWidth - this._container.clientWidth) {
            aScrollLeft = this._container.scrollWidth - this._container.clientWidth;
        }

        // if scrollLeft has changed
        if (this._scrollLeft !== aScrollLeft) {
            // call the update trigger and save set the scrollLeft value
            this._scrollView.scrollLeftUpdated(aScrollLeft);
            this._container.scrollLeft = aScrollLeft;
            this._scrollLeft = aScrollLeft;
        }

        // finally return the scrollLeft value
        return aScrollLeft;
    }

    /**
     * This method is like the destructor. If you destroy this object, all footprints like
     * event listeners and so on get removed and destroyed.
     */
    destroy() {
        // first clear the interval
        window.clearInterval(this._intervalPointer);

        // then clean up the event listeners
        Object.keys(this._eventListener).forEach((aKey) => {
            this._container.removeEventListener(aKey, this._eventListener[aKey]);
        });

        // destroy the scrollView
        this._scrollView.destroy();

        // and null the pointers to the GC can clean up, even if this object isn't cleaned up        
        this._scrollView = null;
        this._container = null;
    }
}

// finally append the Scrollview and scrollViewHelper as static items to the ScrollContainer,
// so they could get overwritten or used by other tools.
ScrollContainer.ScrollView = ScrollView;
ScrollContainer.scrollViewHelper = scrollViewHelper;

export const VERSION = PKG_VERSION;