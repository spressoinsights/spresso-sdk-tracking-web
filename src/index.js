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

class SpressoSdk {
    constructor() {
        this.eventsQueue = [];
        this.timerId = null;

        this.EXECUTE_DELAY = 3000;
    }

    init() {
        initDeviceId();

        // addPageViewListener(this.trackPageView);
        addBeforeUnloadListener(this.executeNow);

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

    executeNow = () => {
        // clear any timed execution
        isBrowser() && window?.clearTimeout?.(this.timerId);
        this.timerId = null;

        if (this.eventsQueue.length) {
            this.execute();
        }
    };

    // arrow function to ensure `this` is bound when passed into other functions as callback
    trackPageView = (eventData = {}) => {
        // console.log('pageview', this);
        this.enqueue({ eventName: PAGE_VIEW, eventData });
    };

    trackViewPDP = (eventData = {}) => {
        this.enqueue({ eventName: VIEW_PDP, eventData });
    };

    trackGlimpsePLE = ({ root, target, glimpseThreshold, ...eventData } = {}) => {
        addIntersectionObserver({
            listener: () => this.enqueue({ eventName: GLIMPSE_PLE, eventData }),
            root,
            target,
            threshold: glimpseThreshold,
        });
    };

    trackTapAddToCart = (eventData = {}) => {
        this.enqueue({ eventName: TAP_ADD_TO_CART, eventData });
    };

    trackPurchaseVariant = (eventData = {}) => {
        this.enqueue({ eventName: PURCHASE_VARIANT, eventData });
    };

    trackCreateOrder = (eventData = {}) => {
        this.enqueue({ eventName: CREATE_ORDER, eventData });
    };
}

export default new SpressoSdk().init();
