import { addBeforeUnloadListener, addIntersectionObserver, isBrowser } from 'utils/browser';
import { initDeviceId } from 'utils/properties';
import { track } from 'utils/api';
import { EventFactory, IEventData, IEventObject, TEventNameLiteral } from 'event-factory';
import { consoleLog } from 'utils/debug';

/**
 * @classdesc Instantiated as the global variable `window.SpressoSdk` on page load.
 * @class
 * @hideconstructor
 */
class SpressoSdk {
    options: IOptions;
    orgId: string;
    eventsQueue: Array<IEventObject>;
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

    flushQueue(): Array<IEventObject> {
        const previousQueue = this.eventsQueue;
        this.eventsQueue = [];
        return previousQueue;
    }

    /**
     * Generic method to send event data. See {@link TEventName} for a list of supported events.
     * @example
     * SpressoSdk.queueEvent('VIEW_PDP', {
     * 	variantSku: 'some-unique-identifier',
     * 	variantPrice: 100000
     * });
     * @param {object} data
     * @param {TEventName} data.eventName - See {@link TEventName} for a list of possible values.
     * @param {object} data.eventData - See {@link TEventName} for required `eventData` properties.
     */
    queueEvent({ eventName, eventData = {} }: IQueueEvent) {
        const { userId, postalCode, remoteAddress } = this.options;

        let eventObj = EventFactory[eventName]?.createEvent?.({
            ...eventData,
            ...(userId && { userId }),
            ...(postalCode && { postalCode }),
            ...(remoteAddress && { remoteAddress }),
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
     * @param {string} eventData.remoteAddress - The `'x-forwarded-for'` HTTP request header.
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     * @param {string} [eventData.postalCode] - The customer's postal code.
     * @param {number} [eventData.remoteAddress] - The `'x-forwarded-for'` HTTP request header.
     */
    trackPageView(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'PAGE_VIEW', eventData });
    }

    /**
     * Tracks when a user navigates to a Product Display Page (PDP). Should only fire once on fresh page load or after a SPA transition.
     * Should be used in addition to {@link SpressoSdk#trackPageView}.
     * @param {object} eventData
     * @param {string} eventData.variantSku - The unique identifier of the product variant.
     * @param {string} eventData.variantName - The name of the product variant.
     * @param {number} eventData.variantPrice - The unit selling price of the variant.
     * @param {number} [eventData.variantCost] - The unit cost of the variant.
     * @param {number} [eventData.inStock] - Variant's stock availability.
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     * @param {number} [eventData.postalCode] - The customer's postal code.
     * @param {number} [eventData.remoteAddress] - The `'x-forwarded-for'` HTTP request header.
     */
    trackViewPDP(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'VIEW_PDP', eventData });
    }

    /**
     * Registers a listener that invokes {@link SpressoSdk#trackGlimpsePLE} on the first appearance of a Product List Entity (PLE) within either the browser viewport or a bounding rectangle (if specified).
     * @param {object} eventData
     * @param {HTMLElement} [eventData.root=null] - The parent container of the PLE elements, whose bounding rectangle will be considered the viewport. Defaults to browser viewport.
     * @param {HTMLElement} eventData.target - The PLE element to be glimpsed.
     * @param {number} [eventData.glimpseThreshold=1] - The area of the PLE element that's visible in the viewport, expressed as a ratio, to trigger the event.
     * @param {string} eventData.variantSku - The unique identifier of the product variant.
     * @param {string} eventData.variantName - The name of the product variant.
     * @param {number} eventData.variantPrice - The unit selling price of the variant.
     * @param {number} [eventData.variantCost] - The unit cost of the variant.
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     * @param {number} [eventData.postalCode] - The customer's postal code.
     * @param {number} [eventData.remoteAddress] - The `'x-forwarded-for'` HTTP request header.
     */
    registerGlimpsePLE({ root, target, glimpseThreshold, ...eventData }: IRegisterGlimpsePLE) {
        if (!(target instanceof HTMLElement)) {
            consoleLog('registerGlimpsePLE: `target` is not a valid `HTMLELement`.');
        }

        addIntersectionObserver({
            listener: () => this.trackGlimpsePLE(eventData),
            root: root instanceof HTMLElement ? root : null,
            target,
            threshold: glimpseThreshold || 1,
        });
    }

    /**
     * Tracks when a user views a Product List Element (PLE). Should only fire when a PLE first becomes visible in the browser viewport.
     * @param {object} eventData
     * @param {string} eventData.variantSku - The unique identifier of the product variant.
     * @param {string} eventData.variantName - The name of the product variant.
     * @param {number} eventData.variantPrice - The unit selling price of the variant.
     * @param {number} [eventData.variantCost] - The unit cost of the variant.
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     * @param {number} [eventData.postalCode] - The customer's postal code.
     * @param {number} [eventData.remoteAddress] - The `'x-forwarded-for'` HTTP request header.
     */
    trackGlimpsePLE(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'GLIMPSE_PLE', eventData });
    }

    /**
     * Tracks when a user adds a product variant to cart. Should fire everytime a user clicks on a link/button to add product variant to cart.
     * @param {object} eventData
     * @param {string} eventData.variantSku - The unique identifier of the product variant.
     * @param {string} eventData.variantName - The name of the product variant.
     * @param {number} eventData.variantPrice - The unit selling price of the variant.
     * @param {number} [eventData.variantCost] - The unit cost of the variant.
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     * @param {number} [eventData.postalCode] - The customer's postal code.
     * @param {number} [eventData.remoteAddress] - The `'x-forwarded-for'` HTTP request header.
     */
    trackTapAddToCart(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'TAP_ADD_TO_CART', eventData });
    }

    /**
     * Tracks when a user places a successful order. Should be invoked once for every unique product variant in the order.
     * @param {object} eventData
     * @param {string} eventData.orderNumber - The unique identifier for the customer's order.
     * @param {string} eventData.variantSku - The unique identifier of the product variant.
     * @param {string} eventData.variantName - The name of the product variant.
     * @param {number} eventData.variantPrice - The unit selling price of the variant.
     * @param {number} eventData.variantQuantity - Variant quantity.
     * @param {number} [eventData.variantStandardPrice] - The default base unit price of the variant not inclusive of price optimization or promotions.
     * @param {number} [eventData.variantCost] - The unit cost of the variant.
     * @param {number} [eventData.variantTotalPrice] - The extended total price of the variant inclusive of tax and shipping.
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     */
    trackPurchaseVariant(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'PURCHASE_VARIANT', eventData });
    }

    /**
     * Tracks when a user places a successful order.
     * @param {object} eventData
     * @param {string} eventData.orderNumber - The unique identifier for the customer's order.
     * @param {number} eventData.totalOrderPrice -  The total price of the order that a customer is paying for (inclusive of tax and shipping).
     * @param {string} eventData.shippingInfoAddressLine1
     * @param {string} eventData.shippingInfoAddressLine2
     * @param {string} eventData.shippingInfoCity
     * @param {string} eventData.shippingInfoState
     * @param {string} eventData.shippingInfoPostalCode
     * @param {string} eventData.shippingInfoCountry
     * @param {number} [eventData.totalVariantQuantity] - The total quantity amount of the order.
     * @param {number} [eventData.totalVariantCost] - The extended variant cost of the order.
     * @param {number} [eventData.totalVariantPrice] - The extended selling price of the variant.
     * @param {number} [eventData.orderFees] - Any order-level fee such as shipping, delivery, convenience, service fees.
     * @param {number} [eventData.orderTax] - Order-level taxes.
     * @param {Array<{ type: string, id: string, value: number }>} [eventData.orderDeductions] - An array of all promo codes or discounts or credits or loyalty promotions.
     * @param {string} [eventData.userId] - The customer's user ID. Defaults to `deviceId` for guests, which is a randomly generated string stored in a cookie on the first script execution.
     */
    trackCreateOrder(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'CREATE_ORDER', eventData });
    }
}

interface IOptions {
    orgId: string;
    userId?: string;
    postalCode?: string;
    remoteAddress?: string;
    useStaging: boolean;
}

interface IQueueEvent {
    eventName: TEventNameLiteral;
    eventData: IEventData;
}

interface IRegisterGlimpsePLE extends IEventData {
    root?: HTMLElement | null;
    target: HTMLElement;
    glimpseThreshold?: number;
}

declare global {
    interface Window {
        SpressoSdk: SpressoSdk;
    }

    interface globalThis {
        SpressoSdk: SpressoSdk;
    }
}

export default new SpressoSdk();
