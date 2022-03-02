(function (window) {
    const { addPageViewListener } = require('utils/url');
    const { initDeviceId } = require('utils/tracking');
    const { EventFactory } = require('event-factory');

    class SpressoSdk  {
		constructor() {
			this.eventsQueue = [];
			this.timerId = null;
		}

        init() {
            initDeviceId();

            // addPageViewListener(window, () => {
            //     this.trackPageView();
            // });
            addPageViewListener(window, this.trackPageView);

            window.addEventListener('beforeunload', () => {
                console.log('fire', this.eventsQueue);
            });

            console.log('initialized', this);
        }

        emptyQueue() {
            let previousQueue = null;
            previousQueue = this.eventsQueue;
            this.eventsQueue = [];
            return previousQueue;
        }

        enqueue({ eventName, eventData = {} }) {
            let eventObj = EventFactory[eventName]?.createEvent?.(eventData);

            if (typeof eventObj === 'object') {
                this.eventsQueue.push(eventObj);
            }
        }

        trackPageView = () => { // arrow function to ensure `this` is bound when passed into other functions as callback
            // console.log('pageview', this);
            this.enqueue({ eventName: 'PAGE_VIEW' });
        }
    }

    window.SpressoSdk = new SpressoSdk();
    window.SpressoSdk.init();
})(typeof window !== 'undefined' ? window : this);
