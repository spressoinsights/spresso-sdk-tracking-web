import { EventFactory, IEventData, IEventObject, TEventNameLiteral } from 'event-factory';
import { TErrorCallback, track } from 'utils/api';
import { addBeforeUnloadListener, addIntersectionObserver, isBrowser } from 'utils/browser';
import { consoleLog } from 'utils/debug';
import { initDeviceId } from 'utils/properties';

/**
 * @classdesc Instantiated as the global variable `window.SpressoSdk` on page load.
 * @class
 * @hideconstructor
 */
class SpressoSdk {
    options: IOptions;
    orgId: string;
    deviceId: string;
    eventsQueue: Array<IEventObject> = [];
    timerId: number | null = null;
    EXECUTE_DELAY: number = 3000;
    errorCallback?: TErrorCallback;

    constructor() {
        this.orgId = (isBrowser() && window?.SpressoSdk?.options?.orgId) || null;
        this.options = isBrowser() && window?.SpressoSdk?.options;

        consoleLog('SpressoSdk CONSTRUCTED');
    }

    init(options: IOptions) {
        this.options = options;
        this.orgId = options?.orgId;
        this.deviceId = initDeviceId(options.deviceId);
        this.errorCallback = options?.errorCallback;

        addBeforeUnloadListener(this.executeNow.bind(this));

        if (!this.orgId) {
            const errorMessage = `[Spresso Event SDK] "orgId" is missing.`;
            console.error(errorMessage);
            this.errorCallback?.({ message: errorMessage });
        }

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
            deviceId: this.deviceId,
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
        const { useStaging } = this.options;
        const queuedEvents = this.flushQueue();
        if (!this.orgId) {
            const errorMessage = `[Spresso Event SDK] "orgId" is missing.`;
            console.error(errorMessage);
            this.errorCallback?.({ message: errorMessage });
            return;
        }
        track({ orgId: this.orgId, events: queuedEvents, useStaging, errorCallback: this.errorCallback });
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
     *
     * This is a mandatory event.
     * @param {object} eventData
     * @param {string | null} eventData.userId - The customer's user ID. Pass in `null` value if the customer is not logged in.
     * @param {string} eventData.remoteAddress - The `'x-forwarded-for'` HTTP request header.
     * @param {string} [eventData.postalCode] - The customer's postal code.
     * @param {string} [eventData.refUserId] - Other customer unique identifier.
     */
    trackPageView(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'PAGE_VIEW', eventData });
    }

    /**
     * Tracks when a user navigates to a Product Display Page (PDP). Should only fire once on fresh page load or after a SPA transition.
     * Should be used in addition to {@link SpressoSdk#trackPageView}.
     *
     * This is a mandatory event.
     * @param {object} eventData
     * @param {string | null} eventData.userId - The customer's user ID. Pass in `null` value if the customer is not logged in.
     * @param {string} eventData.variantSku - The unique identifier of the product variant.
     * @param {string} eventData.variantName - The name of the product variant.
     * @param {number} eventData.variantPrice - The unit selling price of the variant.
     * @param {string} [eventData.productId] - The unique identifier of the product to which the variant belongs.
     * @param {boolean} [eventData.inStock] - Variant's stock availability.
     * @param {string} [eventData.postalCode] - The customer's postal code.
     * @param {string} [eventData.remoteAddress] - The `'x-forwarded-for'` HTTP request header.
     * @param {string} [eventData.refUserId] - Other customer unique identifier.
     */
    trackViewPDP(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'VIEW_PDP', eventData });
    }

    /**
     * Registers a listener that invokes {@link SpressoSdk#trackGlimpsePLE} on the first appearance of a Product List Entity (PLE) within either the browser viewport or a bounding rectangle (if specified).
     *
     * Note: do not use {@link SpressoSdk#trackGlimpsePLE} if you opt to use this method.
     * @param {object} eventData
     * @param {HTMLElement} [eventData.root=null] - The parent container of the PLE elements, whose bounding rectangle will be considered the viewport. Defaults to browser viewport.
     * @param {HTMLElement} eventData.target - The PLE element to be glimpsed.
     * @param {number} [eventData.glimpseThreshold=1] - The area of the PLE element that's visible in the viewport, expressed as a ratio, to trigger the event.
     * @param {string | null} eventData.userId - The customer's user ID. Pass in `null` value if the customer is not logged in.
     * @param {string} eventData.variantSku - The unique identifier of the product variant.
     * @param {string} eventData.variantName - The name of the product variant.
     * @param {number} eventData.variantPrice - The unit selling price of the variant.
     * @param {string} [eventData.productId] - The unique identifier of the product to which the variant belongs.
     * @param {string} [eventData.postalCode] - The customer's postal code.
     * @param {string} [eventData.remoteAddress] - The `'x-forwarded-for'` HTTP request header.
     * @param {string} [eventData.refUserId] - Other customer unique identifier.
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
     * Tracks when a user views a variant Product List Element (PLE). Should only fire when a variant PLE first becomes visible in the browser viewport.
     *
     * This is a mandatory event.
     *
     * Note: do not use this method if you opt to use {@link SpressoSdk#registerGlimpsePLE}.
     * @param {object} eventData
     * @param {string | null} eventData.userId - The customer's user ID. Pass in `null` value if the customer is not logged in.
     * @param {string} eventData.variantSku - The unique identifier of the product variant.
     * @param {string} eventData.variantName - The name of the product variant.
     * @param {number} eventData.variantPrice - The unit selling price of the variant.
     * @param {string} [eventData.productId] - The unique identifier of the product to which the variant belongs.
     * @param {string} [eventData.postalCode] - The customer's postal code.
     * @param {string} [eventData.remoteAddress] - The `'x-forwarded-for'` HTTP request header.
     * @param {string} [eventData.refUserId] - Other customer unique identifier.
     */
    trackGlimpsePLE(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'GLIMPSE_PLE', eventData });
    }

    /**
     * Registers a listener that invokes {@link SpressoSdk#trackGlimpseProductPLE} on the first appearance of a Product List Entity (PLE) within either the browser viewport or a bounding rectangle (if specified).
     *
     * Note: do not use {@link SpressoSdk#trackGlimpseProductPLE} if you opt to use this method.
     * @param {object} eventData
     * @param {HTMLElement} [eventData.root=null] - The parent container of the PLE elements, whose bounding rectangle will be considered the viewport. Defaults to browser viewport.
     * @param {HTMLElement} eventData.target - The PLE element to be glimpsed.
     * @param {number} [eventData.glimpseThreshold=1] - The area of the PLE element that's visible in the viewport, expressed as a ratio, to trigger the event.
     * @param {string | null} eventData.userId - The customer's user ID. Pass in `null` value if the customer is not logged in.
     * @param {string} eventData.productId - The unique identifier of the product.
     * @param {string} eventData.productName - The name of the product.
     * @param {number} eventData.minPriceRange - The price of the cheapest variant that belongs to the product.
     * @param {number} eventData.maxPriceRange - The price of the most expensive  variant that belongs to the product.
     * @param {string} [eventData.postalCode] - The customer's postal code.
     * @param {string} [eventData.remoteAddress] - The `'x-forwarded-for'` HTTP request header.
     * @param {string} [eventData.refUserId] - Other customer unique identifier.
     */
    registerGlimpseProductPLE({ root, target, glimpseThreshold, ...eventData }: IRegisterGlimpsePLE) {
        if (!(target instanceof HTMLElement)) {
            consoleLog('registerGlimpsePLE: `target` is not a valid `HTMLELement`.');
        }

        addIntersectionObserver({
            listener: () => this.trackGlimpseProductPLE(eventData),
            root: root instanceof HTMLElement ? root : null,
            target,
            threshold: glimpseThreshold || 1,
        });
    }

    /**
     * Tracks when a user views a product Product List Element (PLE). Should only fire when a product PLE first becomes visible in the browser viewport.
     *
     * This is an optional event.
     *
     * Note: do not use this method if you opt to use {@link SpressoSdk#registerGlimpseProductPLE}.
     * @param {object} eventData
     * @param {string | null} eventData.userId - The customer's user ID. Pass in `null` value if the customer is not logged in.
     * @param {string} eventData.productId - The unique identifier of the product.
     * @param {string} eventData.productName - The name of the product.
     * @param {number} eventData.minPriceRange - The price of the cheapest variant that belongs to the product.
     * @param {number} eventData.maxPriceRange - The price of the most expensive  variant that belongs to the product.
     * @param {string} [eventData.postalCode] - The customer's postal code.
     * @param {string} [eventData.remoteAddress] - The `'x-forwarded-for'` HTTP request header.
     * @param {string} [eventData.refUserId] - Other customer unique identifier.
     */
    trackGlimpseProductPLE(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'GLIMPSE_PRODUCT_PLE', eventData });
    }

    /**
     * Tracks when a user adds a product variant to cart. Should fire everytime a user clicks on a link/button to add product variant to cart.
     *
     * This is a mandatory event.
     * @param {object} eventData
     * @param {string | null} eventData.userId - The customer's user ID. Pass in `null` value if the customer is not logged in.
     * @param {string} eventData.variantSku - The unique identifier of the product variant.
     * @param {string} eventData.variantName - The name of the product variant.
     * @param {number} eventData.variantPrice - The unit selling price of the variant.
     * @param {string} [eventData.productId] - The unique identifier of the product to which the variant belongs.
     * @param {string} [eventData.postalCode] - The customer's postal code.
     * @param {string} [eventData.remoteAddress] - The `'x-forwarded-for'` HTTP request header.
     * @param {string} [eventData.refUserId] - Other customer unique identifier.
     */
    trackTapAddToCart(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'TAP_ADD_TO_CART', eventData });
        // Immediately fire ATC event
        this.executeNow();
    }

    /**
     * Tracks when a user places a successful order. Should be invoked once for every unique product variant in the order.
     *
     * This is a mandatory event.
     * @param {object} eventData
     * @param {string | null} eventData.userId - The customer's user ID. Pass in `null` value if the customer is not logged in.
     * @param {string} eventData.orderNumber - The unique identifier for the customer's order.
     * @param {string} eventData.variantSku - The unique identifier of the product variant.
     * @param {string} eventData.variantName - The name of the product variant.
     * @param {number} eventData.variantPrice - The unit selling price of the variant.
     * @param {number} eventData.variantQuantity - Variant quantity.
     * @param {number} [eventData.variantStandardPrice] - **Strongly recommended.** The default base unit price of the variant not inclusive of price optimization or promotions.
     * @param {number} [eventData.variantTotalPrice] - **Strongly recommended.** The extended total price of the variant inclusive of tax and shipping.
     * @param {string} [eventData.refUserId] - Other customer unique identifier.
     */
    trackPurchaseVariant(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'PURCHASE_VARIANT', eventData });
    }

    /**
     * Tracks when a user places a successful order.
     *
     * This is a mandatory event.
     * @param {object} eventData
     * @param {string | null} eventData.userId - The customer's user ID. Pass in `null` value if the customer is not logged in.
     * @param {string} eventData.orderNumber - The unique identifier for the customer's order.
     * @param {number} eventData.totalOrderPrice -  The total price of the order that a customer is paying for (inclusive of tax and shipping).
     * @param {string} eventData.shippingInfoAddressLine1
     * @param {string} eventData.shippingInfoAddressLine2
     * @param {string} eventData.shippingInfoCity
     * @param {string} eventData.shippingInfoState
     * @param {string} eventData.shippingInfoPostalCode
     * @param {string} eventData.shippingInfoCountry
     * @param {string} eventData.shippingInfoFirstName
     * @param {string} eventData.shippingInfoLastName
     * @param {number} [eventData.totalVariantQuantity] - **Strongly recommended.** The total quantity amount of the order.
     * @param {number} [eventData.totalVariantPrice] - **Strongly recommended.** The extended selling price of the variant.
     * @param {number} [eventData.orderTax] - Order-level taxes.
     * @param {number} [eventData.totalOrderFees] - The total value of order-level fees such as shipping, delivery, convenience, service fees.
     * @param {Array<{ type: string, id: string, value: number }>} [eventData.orderFees] - An array of order-level fees such as shipping, delivery, convenience, service fees.
     * @param {number} [eventData.totalOrderDeductions] - The total value of promo codes or discounts or credits or loyalty promotions.
     * @param {Array<{ type: string, id: string, value: number }>} [eventData.orderDeductions] - An array of all promo codes or discounts or credits or loyalty promotions.
     * @param {string} [eventData.refUserId] - Other customer unique identifier.
     */
    trackCreateOrder(eventData: IEventData = {}) {
        this.queueEvent({ eventName: 'CREATE_ORDER', eventData });
    }
}

interface IOptions {
    orgId: string;
    deviceId?: string;
    userId?: string;
    postalCode?: string;
    remoteAddress?: string;
    useStaging?: boolean;
    errorCallback?: TErrorCallback;
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

    var __SDK_VERSION__: string;
}

export default new SpressoSdk();
