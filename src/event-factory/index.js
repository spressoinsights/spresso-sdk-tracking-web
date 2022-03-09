import { getDeviceId } from 'utils/tracking';
import { getCurrentUrl } from 'utils/browser';

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
export const GLIMPSE_PLE = 'GLIMPSE_PLE';
export const TAP_ADD_TO_CART = 'TAP_ADD_TO_CART';

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

    [GLIMPSE_PLE]: {
        createEvent: function ({ variantGid, variantPrice, variantReport, userId }) {
            return {
                event: 'glimpsePLE',
                properties: {
                    ...getCommonProps({ userId }),
                    variantGid,
                    variantPrice,
                    variantReport,
                },
            };
        },
    },

    [TAP_ADD_TO_CART]: {
        createEvent: function ({ variantGid, variantPrice, variantReport, userId, thestralFeatures }) {
            return {
                event: 'tapAddToCart',
                properties: {
                    ...getCommonProps({ userId }),
                    variantGid,
                    variantPrice,
                    variantReport,
                    thestralFeatures,
                },
            };
        },
    },
};
