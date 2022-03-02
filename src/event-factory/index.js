import { getDeviceId } from 'utils/tracking';
import { getCurrentUrl } from 'utils/url';

const getCommonProps = function () {
    return {
        deviceId: getDeviceId(),
        page: getCurrentUrl(),
    };
};

export const EventFactory = {
    PAGE_VIEW: {
        createEvent: function () {
            return {
                event: 'pageView',
                properties: {
                    ...getCommonProps(),
                },
            };
        },
    },
};
