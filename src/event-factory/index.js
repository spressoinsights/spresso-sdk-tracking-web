import { getDeviceId } from 'utils/tracking';
import { getCurrentUrl } from 'utils/url';

const getCommonProps = function ({ userId }) {
    const deviceId = getDeviceId();
    return {
        deviceId,
        page: getCurrentUrl(),
        userId: userId || deviceId,
    };
};

export const PAGE_VIEW = 'PAGE_VIEW';
export const VIEW_PDP = 'VIEW_PDP';

export const EventFactory = {
    [PAGE_VIEW]: {
        createEvent: function ({ userId }) {
            return {
                event: 'pageView',
                properties: {
                    ...getCommonProps({ userId }),
                },
            };
        },
    },

    [VIEW_PDP]: {
        createEvent: function ({ variantGid, variantPrice, variantReport, userId }) {
            return {
                event: 'viewPDP',
                properties: {
                    ...getCommonProps({ userId }),
                    variantGid,
                    variantPrice,
                    variantReport,
                },
            };
        },
    },
};
