import 'cross-fetch/polyfill';
import { isBrowser } from 'utils/browser';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const track = function ({ orgId, events, isStagingData }) {
    console.log({ isStagingData });

    const ENDPOINT = 'https://public-pensieve-collector.us-east4.staging.spresso.com/track';

    if (!isBrowser() || !events?.length) {
        return;
    }

    let body = {
        datas: events,
    };

    try {
        console.log('FIRE', JSON.stringify(body, null, 2));
        body = JSON.stringify(body);

        fetch?.(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8',
                'Org-id': orgId,
            },
            body,
        }).then((res) => {
            if (res.status >= 400) {
                throw new Error('Bad response from server');
            }
            // return res.json();
        });
        // .then((data) => console.log(data));
    } catch (error) {
        console.error(error);
    }
};
