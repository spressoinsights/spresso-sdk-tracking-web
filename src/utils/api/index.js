import 'cross-fetch/polyfill';
import { isBrowser } from 'utils/browser';

export const track = function ({ endpoint, events }) {
    if (typeof endpoint !== 'string' || !isBrowser() || !events?.length) {
        return;
    }

    let body = {
        datas: events,
    };

    try {
        console.log('FIRE', JSON.stringify(body, null, 2));
        body = JSON.stringify(body);

        fetch?.(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8',
            },
            body,
        })
            .then((res) => {
                if (res.status >= 400) {
                    throw new Error('Bad response from server');
                }
                return res.json();
            })
            // .then((data) => console.log(data));
    } catch (error) {
        console.error(error);
    }
};
