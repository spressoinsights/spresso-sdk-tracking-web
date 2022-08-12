import { addBeforeUnloadListener, addIntersectionObserver, isBrowser } from 'utils/browser';
import { initDeviceId } from 'utils/properties';
import { track } from 'utils/api';
import { EventFactory, EVENT_NAMES } from 'event-factory';
import { consoleLog } from 'utils/debug';

declare global {
    interface Window {
        SpressoSdk: SpressoSdk;
    }

    interface globalThis {
        SpressoSdk: SpressoSdk;
    }
}

interface IOptions {
    orgId: string;
    userId: string;
    useStaging: boolean;
}

/**
 * Instantiated on page load. Accessible on `window.SpressoSdk`.
 */
class SpressoSdk {
    options: IOptions;
    orgId: string;
    eventsQueue: Array<object>;
    timerId: number;
    EXECUTE_DELAY: number;

    constructor() {
        this.eventsQueue = [];
        this.timerId = null;
        this.orgId = (isBrowser() && window?.SpressoSdk?.options?.orgId) || null;
        this.options = isBrowser() && window?.SpressoSdk?.options;
        this.EXECUTE_DELAY = 3000;

        consoleLog('SpressoSdk CONSTRUCTED');
    }

    init(options: IOptions) {
        this.orgId = options?.orgId;
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
     * Generic method to send event data. See {@link EVENT_NAMES} for a list of supported events.
     * @example
     * SpressoSdk.queueEvent('VIEW_PDP', {
     * 	variantId: 'some-id',
     * 	variantPrice: 100000
     * });
     * @param {object} data
     * @param {EVENT_NAMES} data.eventName - See {@link EVENT_NAMES} for a list of possible values.
     * @param {object} data.eventData - See {@link EVENT_NAMES} for required `eventData` properties.
     */
    queueEvent({ eventName, eventData = {} }: any) {
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
        const { orgId, useStaging } = this.options;
        const queuedEvents = this.flushQueue();
        track({ orgId, events: queuedEvents, useStaging });
    }

    executeLater() {
        this.timerId =
            isBrowser() &&
            window?.setTimeout?.(() => {
                this.execute();
                this.timerId = null;
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
     * Tracks when a user navigates to any page on the site. Should only fire once on fresh page load or after a SPA transition.
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     */
    trackPageView(eventData = {}) {
        this.queueEvent({ eventName: EVENT_NAMES.PAGE_VIEW, eventData });
    }

    /**
     * Tracks when a user navigates to a Product Display Page (PDP). Should only fire once on fresh page load or after a SPA transition.
     * Should be used in addition to {@link SpressoSdk#trackPageView}.
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     * @param {string} eventData.variantId - Variant ID.
     * @param {number} eventData.variantPrice - Variant price.
     * @param {object} eventData.variantReport - Variant report.
     */
    trackViewPDP(eventData = {}) {
        this.queueEvent({ eventName: EVENT_NAMES.VIEW_PDP, eventData });
    }

    /**
     * Registers a listener that invokes {@link SpressoSdk#trackGlimpsePLE} on the first appearance of a Product List Entity (PLE) within either the browser viewport or a bounding rectangle (if specified).
     * @param {object} eventData
     * @param {HTMLElement} [eventData.root=null] - The parent container of the PLE elements, whose bounding rectangle will be considered the viewport. Defaults to browser viewport.
     * @param {HTMLElement} eventData.target - The PLE element to be glimpsed.
     * @param {number} [eventData.glimpseThreshold=1] - The area of the PLE element that's visible in the viewport, expressed as a ratio, to trigger the event.
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     * @param {string} eventData.variantId - Variant ID.
     * @param {number} eventData.variantPrice - Variant price.
     * @param {object} eventData.variantReport - Variant report.
     */
    registerGlimpsePLE({ root, target, glimpseThreshold, ...eventData }: any = {}) {
        addIntersectionObserver({
            listener: () => this.trackGlimpsePLE(eventData),
            root,
            target,
            threshold: glimpseThreshold,
        });
    }

    /**
     * Tracks when a user views a Product List Element (PLE). Should only fire when a PLE first becomes visible in the browser viewport.
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     * @param {string} eventData.variantId - Variant ID.
     * @param {number} eventData.variantPrice - Variant price.
     * @param {object} eventData.variantReport - Variant report.
     */
    trackGlimpsePLE(eventData = {}) {
        this.queueEvent({ eventName: EVENT_NAMES.GLIMPSE_PLE, eventData });
    }

    /**
     * Tracks when a user adds a product variant to cart. Should fire everytime a user clicks on a link/button to add product variant to cart.
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     * @param {string} eventData.variantId - Variant ID.
     * @param {number} eventData.variantPrice - Variant price.
     * @param {object} eventData.variantReport - Variant report.
     */
    trackTapAddToCart(eventData = {}) {
        this.queueEvent({ eventName: EVENT_NAMES.TAP_ADD_TO_CART, eventData });
    }

    /**
     * Tracks when a user places a successful order. Should be invoked once for every unique product variant in the order.
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     * @param {string} eventData.variantId - Variant ID.
     * @param {number} eventData.variantTotalPrice - Variant price total (includes tax and shipping).
     * @param {number} eventData.variantQuantity - Variant quantity.
     * @param {object} eventData.variantReport - Variant report.
     * @param {string} eventData.orderId - The customer's order ID.
     */
    trackPurchaseVariant(eventData = {}) {
        this.queueEvent({ eventName: EVENT_NAMES.PURCHASE_VARIANT, eventData });
    }

    /**
     * Tracks when a user places a successful order.
     * @param {object} eventData
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     * @param {string} eventData.orderId - The customer's order ID.
     */
    trackCreateOrder(eventData = {}) {
        this.queueEvent({ eventName: EVENT_NAMES.CREATE_ORDER, eventData });
    }
}

export default new SpressoSdk();