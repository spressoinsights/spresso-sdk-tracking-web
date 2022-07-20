import { addBeforeUnloadListener, addIntersectionObserver, isBrowser } from 'utils/browser';
import { initDeviceId } from 'utils/properties';
import { track } from 'utils/api';
import { EventFactory, EVENT_NAMES } from 'event-factory';
import { consoleLog } from 'utils/debug';

/**
 * Instantiated on page load. Accessible on `window.SpressoSdk`.
 */
class SpressoSdk {
    constructor() {
        this.eventsQueue = [];
        this.timerId = null;
        this.orgId = (isBrowser() && window?.SpressoSdk?.options?.orgId) || null;
        this.options = (isBrowser() && window?.SpressoSdk?.options) || {};

        this.EXECUTE_DELAY = 3000;
        consoleLog('SpressoSdk CONSTRUCTED');
    }

    init(options = {}) {
        this.orgId = options.orgId;
        this.options = options;

        initDeviceId();
        addBeforeUnloadListener(this.executeNow.bind(this));

        consoleLog('SpressoSdk INITIALIZED');
        return this;
    }

    flushQueue() {
        const previousQueue = this.eventsQueue;
        this.eventsQueue = [];
        return previousQueue;
    }

    /**
     * @example
     * SpressoSdk.queueEvent('VIEW_PDP', {
     * 	variantId: 'some-id',
     * 	variantPrice: 100000
     * });
     * @param {object} data
     * @param {EVENT_NAMES} data.eventName - Click on `EVENT_NAMES` for a list of possible values.
     * @param {object} data.eventData - Click on `EVENT_NAMES` for required `eventData` properties.
     */
    queueEvent({ eventName, eventData = {} }) {
        const { userId } = this.options;

        let eventObj = EventFactory[eventName]?.createEvent?.({
            ...eventData,
            ...(userId && { userId }),
        });

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
        const { orgId, isStagingData } = this.options;
        const queuedEvents = this.flushQueue();
        track({ orgId, events: queuedEvents, isStagingData });
    }

    executeLater() {
        // consoleLog('execute later');
        this.timerId =
            isBrowser() &&
            window?.setTimeout?.(() => {
                this.execute();
                this.timerId = null;
                // consoleLog('after timeout');
            }, this.EXECUTE_DELAY);
    }

    executeNow() {
        // clear any timed execution
        isBrowser() && window?.clearTimeout?.(this.timerId);
        this.timerId = null;

        if (this.eventsQueue.length) {
            this.execute();
        }
    }

    /**
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     */
    trackPageView(eventData = {}) {
        this.queueEvent({ eventName: EVENT_NAMES.PAGE_VIEW, eventData });
    }

    /**
     * Tracks when a user navigates to a Product Display Page. Should only fire once on fresh page load or after a SPA transition.
     * Should be used in addition to {@link SpressoSdk#trackPageView}.
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     * @param {string} eventData.variantId - Variant ID.
     * @param {number} eventData.variantPrice - Variant price.
     * @param {object} eventData.variantReport - Variant report.
     */
    trackViewPDP(eventData = {}) {
        this.queueEvent({ eventName: EVENT_NAMES.VIEW_PDP, eventData });
    }

    /**
     * @param {object} eventData
     * @param {HTMLElement} [eventData.root=null] - The parent container of the PLE elements, whose bounding rectangle will be considered the viewport. Defaults to browser viewport.
     * @param {HTMLElement} eventData.target - The PLE element to be glimpsed.
     * @param {number} [eventData.glimpseThreshold=1] - The area of the PLE element that's visible in the viewport, expressed as a ratio, to trigger the event.
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     * @param {string} eventData.variantId - Variant ID.
     * @param {number} eventData.variantPrice - Variant price.
     * @param {object} eventData.variantReport - Variant report.
     */
    registerGlimpsePLE({ root, target, glimpseThreshold, ...eventData } = {}) {
        addIntersectionObserver({
            listener: () => this.trackGlimpsePLE(eventData),
            root,
            target,
            threshold: glimpseThreshold,
        });
    }

    /**
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     * @param {string} eventData.variantId - Variant ID.
     * @param {number} eventData.variantPrice - Variant price.
     * @param {object} eventData.variantReport - Variant report.
     */
    trackGlimpsePLE(eventData = {}) {
        this.queueEvent({ eventName: EVENT_NAMES.GLIMPSE_PLE, eventData });
    }

    /**
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     * @param {string} eventData.variantId - Variant ID.
     * @param {number} eventData.variantPrice - Variant price.
     * @param {object} eventData.variantReport - Variant report.
     */
    trackTapAddToCart(eventData = {}) {
        this.queueEvent({ eventName: EVENT_NAMES.TAP_ADD_TO_CART, eventData });
    }

    /**
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     * @param {string} eventData.variantId - Variant ID.
     * @param {number} eventData.variantPriceTotal - Variant price total (includes tax and shipping).
     * @param {object} eventData.variantReport - Variant report.
     * @param {string} eventData.orderId - The customer's order ID.
     */
    trackPurchaseVariant(eventData = {}) {
        this.queueEvent({ eventName: EVENT_NAMES.PURCHASE_VARIANT, eventData });
    }

    /**
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests.
     * @param {string} eventData.orderId - The customer's order ID.
     */
    trackCreateOrder(eventData = {}) {
        this.queueEvent({ eventName: EVENT_NAMES.CREATE_ORDER, eventData });
    }
}

export default new SpressoSdk();
