import 'cross-fetch/polyfill';
import { IEventObject } from 'event-factory';
import { isBrowser } from 'utils/browser';
import { consoleLog } from 'utils/debug';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export function track({ orgId, events, useStaging, errorCallback }: ITrackOptions) {
    consoleLog({ useStaging });

    let ENDPOINT = useStaging
        ? 'https://api.staging.spresso.com/pim/public/events'
        : 'https://api.spresso.com/pim/public/events';

    if (isDev) {
        ENDPOINT = 'http://localhost:1337/track';
    }

    if (!isBrowser() || !events?.length) {
        return;
    }

    try {
        consoleLog('FIRE', JSON.stringify({ datas: events }, null, 2));

        const body = JSON.stringify({ datas: events });

        fetch?.(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8',
                'Org-Id': orgId,
            },
            body,
        }).then((res) => {
            if (res.status >= 400) {
                throw new Error('Bad response from server');
            }
            // return res.json();
        });
        // .then((data) => consoleLog(data));
    } catch (error) {
        console.error(error);
        errorCallback?.(error);
    }
}

interface ITrackOptions {
    orgId: string;
    events: Array<IEventObject>;
    useStaging: boolean;
    errorCallback?: TErrorCallback;
}

export type TErrorCallback = (error: any) => any;
