import { addPageViewListener, addBeforeUnloadListener } from 'utils/browser';
import { initDeviceId } from 'utils/tracking';
import { PAGE_VIEW, VIEW_PDP, GLIMPSE_PLE, EventFactory } from 'event-factory';

class SpressoSdk {
    constructor() {
        this.eventsQueue = [];
        this.timerId = null;

        this.EXECUTE_DELAY = 5000;
    }

    init() {
        initDeviceId();

        // addPageViewListener(window, this.trackPageView);
        addBeforeUnloadListener(window, this.executeNow);

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
        if (this.timerId === null && this.eventsQueue.length) {
            this.executeLater();
        }
    }

    // fires API call
    execute() {
        const queuedEvents = this.flushQueue();
        console.log('FIRE', JSON.stringify(queuedEvents, null, 2));
    }

    executeLater() {
        // console.log('execute later');
        this.timerId = window?.setTimeout?.(() => {
            this.execute();
            this.timerId = null;
            // console.log('after timeout');
        }, this.EXECUTE_DELAY);
    }

    executeNow = () => {
        // clear any timed execution
        window?.clearTimeout?.(this.timerId);
        this.timerId = null;

        if (this.eventsQueue.length) {
            this.execute();
        }
    };

    // arrow function to ensure `this` is bound when passed into other functions as callback
    trackPageView = ({ userId } = {}) => {
        // console.log('pageview', this);
        this.enqueue({ eventName: PAGE_VIEW, eventData: { userId } });
    };

    trackViewPDP = ({ variantGid, variantPrice, variantReport, userId } = {}) => {
        this.enqueue({ eventName: VIEW_PDP, eventData: { variantGid, variantPrice, variantReport, userId } });
    };

    trackGlimpsePLE = ({ variantGid, variantPrice, variantReport, userId } = {}) => {
        this.enqueue({ eventName: GLIMPSE_PLE, eventData: { variantGid, variantPrice, variantReport, userId } });
    };
}

export default new SpressoSdk().init();
