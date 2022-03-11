import { addPageViewListener, addBeforeUnloadListener, addIntersectionObserver, isBrowser } from 'utils/browser';
import { initDeviceId } from 'utils/tracking';
import { track } from 'utils/api';
import {
    EventFactory,
    PAGE_VIEW,
    VIEW_PDP,
    GLIMPSE_PLE,
    TAP_ADD_TO_CART,
    PURCHASE_VARIANT,
    CREATE_ORDER,
} from 'event-factory';

/** Instantiated on page load. Accessible on `window.SpressoSdk` */
class SpressoSdk {
    constructor() {
        this.eventsQueue = [];
        this.timerId = null;

        this.EXECUTE_DELAY = 3000;
    }

    init() {
        initDeviceId();

        // addPageViewListener(this.trackPageView);
        addBeforeUnloadListener(this.executeNow.bind(this));

        console.log('initialized', this);

        return this;
    }

    flushQueue() {
        const previousQueue = this.eventsQueue;
        this.eventsQueue = [];
        return previousQueue;
    }

    enqueue({ eventName, eventData = {} }) {
        let eventObj = EventFactory[eventName]?.createEvent?.(eventData);

        if (typeof eventObj === 'object') {
            this.eventsQueue.push(eventObj);
        }

        // schedule execution ONLY when queue is not empty
        if (!this.timerId && this.eventsQueue.length) {
            this.executeLater();
        }
    }

    // fires API call
    execute() {
        const queuedEvents = this.flushQueue();
        track(queuedEvents);
    }

    executeLater() {
        // console.log('execute later');
        this.timerId =
            isBrowser() &&
            window?.setTimeout?.(() => {
                this.execute();
                this.timerId = null;
                // console.log('after timeout');
            }, this.EXECUTE_DELAY);
    }

    executeNow() {
        // clear any timed execution
        isBrowser() && window?.clearTimeout?.(this.timerId);
        this.timerId = null;

        if (this.eventsQueue.length) {
            this.execute();
        }
    };

    /**
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     */
    trackPageView(eventData = {}) {
        this.enqueue({ eventName: PAGE_VIEW, eventData });
    }

    /**
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     * @param {string} eventData.variantId - Variant ID.
     * @param {string} eventData.variantPrice - Variant price.
     * @param {string} eventData.variantReport - Variant report.
     */
    trackViewPDP(eventData = {}) {
        this.enqueue({ eventName: VIEW_PDP, eventData });
    }

    /**
     * @param {object} eventData
	 * @param {HTMLElement} [eventData.root=null] - The parent container of the PLE elements, whose bounding rectangle will be considered the viewport. Defaults to browser viewport. 
	 * @param {HTMLElement} eventData.target - The PLE element to be glimpsed. 
	 * @param {number} [eventData.glimpseThreshold=1] - The area of the PLE element that's visible in the viewport, expressed as a ratio, to trigger the event. 
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     * @param {string} eventData.variantId - Variant ID.
     * @param {string} eventData.variantPrice - Variant price.
     * @param {string} eventData.variantReport - Variant report.
     */
    trackGlimpsePLE({ root, target, glimpseThreshold, ...eventData } = {}) {
        addIntersectionObserver({
            listener: () => this.enqueue({ eventName: GLIMPSE_PLE, eventData }),
            root,
            target,
            threshold: glimpseThreshold,
        });
    }

    /**
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     * @param {string} eventData.variantId - Variant ID.
     * @param {string} eventData.variantPrice - Variant price.
     * @param {string} eventData.variantReport - Variant report.
     */
    trackTapAddToCart(eventData = {}) {
        this.enqueue({ eventName: TAP_ADD_TO_CART, eventData });
    }

    /**
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     * @param {string} eventData.variantId - Variant ID.
     * @param {string} eventData.variantPrice - Variant price.
     * @param {string} eventData.variantReport - Variant report.
     * @param {string} eventData.orderId - The customer's order ID.
     */
    trackPurchaseVariant(eventData = {}) {
        this.enqueue({ eventName: PURCHASE_VARIANT, eventData });
    }

    /**
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     * @param {string} eventData.orderId - The customer's order ID.
     */
    trackCreateOrder(eventData = {}) {
        this.enqueue({ eventName: CREATE_ORDER, eventData });
    }
}

export default new SpressoSdk().init();
