import 'cross-fetch/polyfill';
import { IEventObject } from 'event-factory';
import { isBrowser } from 'utils/browser';
import { consoleLog } from 'utils/debug';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export function track({ orgId, events, useStaging }: ITrackOptions) {
    consoleLog({ useStaging });

    let ENDPOINT = useStaging
        ? 'https://public-pensieve-stats.us-east4.staging.spresso.com/track'
        : 'https://public-pensieve-stats.us-east4.prod.spresso.com/track';

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
    }
}

interface ITrackOptions {
    orgId: string;
    events: Array<IEventObject>;
    useStaging: boolean;
}
