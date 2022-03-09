const isBrowser = function () {
    return typeof window !== 'undefined';
};

export const addBeforeUnloadListener = function (listener) {
    isBrowser() &&
        window?.addEventListener?.('beforeunload', () => {
            listener();
            window.removeEventListener('beforeunload', listener);
        });
};

export const addIntersectionObserver = function ({ listener, root, target, threshold = 1 }) {
    if (
        !isBrowser() ||
        typeof IntersectionObserver !== 'function' ||
        !(typeof HTMLElement !== 'undefined' && target instanceof HTMLElement)
    ) {
        return;
    }

    let observer = null;

    const cb = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry?.isIntersecting) {
                typeof listener === 'function' && listener();
                observer?.unobserve?.(entry.target); // fire callback only once after `target` is visible within `root`
            }
        });
    };

    try {
        observer = new IntersectionObserver(cb, {
            root: root instanceof HTMLElement ? root : null,
            threshold,
        });
        observer.observe(target);
    } catch (err) {
        console.error(err);
    }
};

export const addPageViewListener = function (listener) {
    // https://dirask.com/posts/JavaScript-on-location-changed-event-on-url-changed-event-DKeyZj

    let pushState = isBrowser() && window?.history?.pushState;
    let replaceState = isBrowser() && window?.history?.replaceState;

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
    return isBrowser() ? window.location.href : '';
};
