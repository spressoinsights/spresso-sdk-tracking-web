import { consoleLog } from 'utils/debug';

export function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

export function addBeforeUnloadListener(listener: IListener) {
    isBrowser() &&
        window?.addEventListener?.('beforeunload', () => {
            listener();
            window.removeEventListener('beforeunload', listener);
        });
}

export function addIntersectionObserver(options: IIntersectionObserverOptions) {
    const { listener, root = null, target, threshold = 1 } = options;

    if (!isBrowser() || typeof IntersectionObserver !== 'function' || typeof HTMLElement === 'undefined' || !(target instanceof HTMLElement)) {
        return;
    }

    const executeListener: IntersectionObserverCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry?.isIntersecting) {
                typeof listener === 'function' && listener();
                observer?.unobserve?.(entry.target); // fire callback only once after `target` is visible within `root`
            }
        });
    };

    const observer = new IntersectionObserver(executeListener, {
        root: root instanceof HTMLElement ? root : null, // `null` defaults to the browser's viewport
        threshold,
    });
    observer?.observe?.(target);
}

export function addPageViewListener(listener: IListener) {
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
}

export function getCurrentUrl(): string {
    return isBrowser() ? window.location.href : '';
}

export function getQueryParameters(): string {
    return isBrowser() ? window.location.search : '';
}

export function parseQueryParameters(params: string = ''): object {
    let search = params.substring(1);
    let parsedParams = {};

    if (search) {
        try {
            parsedParams = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function (key, value) {
                return key === '' ? value : decodeURIComponent(value);
            });
        } catch (err) {
            consoleLog({ msg: 'Error parsing search params', err });
        }
    }
    return parsedParams;
}

interface IListener {
    (): any;
}

interface IIntersectionObserverOptions {
    listener: IListener;
    root?: HTMLElement | null;
    target: HTMLElement;
    threshold?: number;
}
