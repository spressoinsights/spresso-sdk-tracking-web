import { getDeviceId } from 'utils/tracking';
import { getCurrentUrl } from 'utils/url';

const getCommonProps = function () {
    return {
        deviceId: getDeviceId(),
        page: getCurrentUrl(),
    };
};

export const PAGE_VIEW = 'PAGE_VIEW';
export const VIEW_PDP = 'VIEW_PDP';

export const EventFactory = {
    [PAGE_VIEW]: {
        createEvent: function () {
            return {
                event: 'pageView',
                properties: {
                    ...getCommonProps(),
                },
            };
        },
    },

    [VIEW_PDP]: {
        createEvent: function () {
            return {
                event: 'viewPDP',
                properties: {
                    ...getCommonProps(),
                },
            };
        },
    },
};

