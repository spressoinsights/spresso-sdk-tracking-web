export const addPageViewListener = (window, listener) => {
	// https://dirask.com/posts/JavaScript-on-location-changed-event-on-url-changed-event-DKeyZj
	
    let pushState = window?.history?.pushState;
    let replaceState = window?.history?.replaceState;

    if (
        typeof pushState !== 'function' ||
        typeof replaceState !== 'function' ||
        typeof listener !== 'function'
    ) {
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

    window.addEventListener('pageview', listener);
};
