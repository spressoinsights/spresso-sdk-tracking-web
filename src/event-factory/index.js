import { getDeviceId } from 'utils/properties';
import { getCurrentUrl } from 'utils/browser';

const getRootProps = function () {
    const currentTimestamp = new Date();

    return {
        utcTimestampMs: currentTimestamp.getTime(),
        timezoneOffsetTs: currentTimestamp.getTimezoneOffset(),
    };
};

const getMetaProps = function ({ userId }) {
    const deviceId = getDeviceId();
    return {
        deviceId,
        userId: userId || deviceId,
    };
};

export const PAGE_VIEW = 'PAGE_VIEW';
export const VIEW_PDP = 'VIEW_PDP';
export const GLIMPSE_PLE = 'GLIMPSE_PLE';
export const TAP_ADD_TO_CART = 'TAP_ADD_TO_CART';
export const PURCHASE_VARIANT = 'PURCHASE_VARIANT';
export const CREATE_ORDER = 'CREATE_ORDER';

export const EventFactory = {
    [PAGE_VIEW]: {
        createEvent: function ({ ...otherProps }) {
            return {
                event: 'spressoPageView',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    page: getCurrentUrl(),
                },
            };
        },
    },

    [VIEW_PDP]: {
        createEvent: function ({ variantId, variantPrice, variantReport, ...otherProps }) {
            return {
                event: 'spressoViewPDP',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    variantId,
                    variantPrice,
                    variantReport,
                },
            };
        },
    },

    [GLIMPSE_PLE]: {
        createEvent: function ({ variantId, variantPrice, variantReport, ...otherProps }) {
            return {
                event: 'spressoGlimpsePLE',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    variantId,
                    variantPrice,
                    variantReport,
                },
            };
        },
    },

    [TAP_ADD_TO_CART]: {
        createEvent: function ({ variantId, variantPrice, variantReport, thestralFeatures, ...otherProps }) {
            return {
                event: 'spressoTapAddToCart',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    variantId,
                    variantPrice,
                    variantReport,
                    // thestralFeatures,
                },
            };
        },
    },

    [PURCHASE_VARIANT]: {
        createEvent: function ({ variantId, variantPrice, variantReport, orderId, thestralFeatures, ...otherProps }) {
            return {
                event: 'spressoPurchaseVariant',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    variantId,
                    variantPrice,
                    variantReport,
                    orderId,
                    // thestralFeatures,
                },
            };
        },
    },

    [CREATE_ORDER]: {
        createEvent: function ({ orderId, thestralFeatures, ...otherProps }) {
            return {
                event: 'spressoPurchaseVariant',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    orderId,
                    // thestralFeatures,
                },
            };
        },
    },
};
