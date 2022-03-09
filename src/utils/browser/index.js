export const addBeforeUnloadListener = function (listener) {
	typeof window !== 'undefined' && window?.addEventListener?.('beforeunload', () => {
		listener();
		window.removeEventListener('beforeunload', listener);
	});
}

export const addIntersectionObserver = function() {}

export const addPageViewListener = function (listener) {
    // https://dirask.com/posts/JavaScript-on-location-changed-event-on-url-changed-event-DKeyZj

    let pushState = typeof window !== 'undefined' && window?.history?.pushState;
    let replaceState = typeof window !== 'undefined' && window?.history?.replaceState;

    if (typeof pushState !== 'function' || typeof replaceState !== 'function' || typeof listener !== 'function') {
        return;
    }

    window.history.pushState = function () {
        pushState.apply(window.history, arguments);
        window.dispatchEvent(new Event('pageview'));
    };

    window.history.replaceState = function () {
        replaceState.apply(window.history, arguments);
        window.dispatchEvent(new Event('pageview'));
    };

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('pageview'));
    });

    // TODO: handle page refresh?
    // window.addEventListener('pageshow', (e) => {
    //     window.dispatchEvent(new Event('pageview'));
    // });

    window.addEventListener('pageview', listener);

    window.addEventListener('beforeunload', () => {
        window.history.pushState = pushState;
        window.history.replaceState = replaceState;
        window.removeEventListener('pageview', listener);
        // console.log('removed');
    });
};

export const getCurrentUrl = function () {
    return typeof window !== 'undefined' ? window.location.href : '';
};
