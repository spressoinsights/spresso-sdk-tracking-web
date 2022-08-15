import 'cross-fetch/polyfill';
import { isBrowser } from 'utils/browser';
import { consoleLog } from 'utils/debug';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const track = function ({ orgId, events, useStaging }) {
    consoleLog({ useStaging });

    const ENDPOINT = useStaging ? 'https://public-pensieve-stats.us-east4.staging.spresso.com/track' : 'https://public-pensieve-stats.us-east4.prod.spresso.com/track';

    if (!isBrowser() || !events?.length) {
        return;
    }

    let body = {
        datas: events,
    };

    try {
        consoleLog('FIRE', JSON.stringify(body, null, 2));
        body = JSON.stringify(body);

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
};
