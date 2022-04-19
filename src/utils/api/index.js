import 'cross-fetch/polyfill';
import { isBrowser } from 'utils/browser';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// const ENDPOINT = isDev ? 'http://localhost:1337/track' : 'https://34.111.61.186.nip.io/track';
const ENDPOINT = 'https://staging-pensieve-0983-public.boxed.com/track';

export const track = function ({ orgId, events }) {
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
