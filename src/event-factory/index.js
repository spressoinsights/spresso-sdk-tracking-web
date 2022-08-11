import { v4 as uuidv4 } from 'uuid';
import { getDeviceId } from 'utils/properties';
import { getCurrentUrl } from 'utils/browser';

const getRootProps = function () {
    const currentTimestamp = new Date();

    return {
        uid: uuidv4(),
        utcTimestampMs: currentTimestamp.getTime(),
        timezoneOffset: currentTimestamp.getTimezoneOffset() * 60 * 1000, // convert to milliseconds
    };
};

const getMetaProps = function ({ userId }) {
    const deviceId = getDeviceId();
    return {
        deviceId,
        userId: userId || deviceId,
    };
};

/**
 * A list of event names that can be passed into {@link SpressoSdk#queueEvent}.
 * @namespace EVENT_NAMES
 * @property {string} CREATE_ORDER='CREATE_ORDER' - Requires the same `eventData` as {@link SpressoSdk#trackCreateOrder}.
 * @property {string} GLIMPSE_PLE='GLIMPSE_PLE' - Requires the same `eventData` as {@link SpressoSdk#trackGlimpsePLE}.
 * @property {string} PAGE_VIEW='PAGE_VIEW' - Requires the same `eventData` as {@link SpressoSdk#trackPageView}.
 * @property {string} PURCHASE_VARIANT='PURCHASE_VARIANT' - Requires the same `eventData` as {@link SpressoSdk#trackPurchaseVariant}.
 * @property {string} TAP_ADD_TO_CART='TAP_ADD_TO_CART' - Requires the same `eventData` as {@link SpressoSdk#trackTapAddToCart}.
 * @property {string} VIEW_PDP='VIEW_PDP' - Requires the same `eventData` as {@link SpressoSdk#trackViewPDP}.
 */
export const EVENT_NAMES = {
    CREATE_ORDER: 'CREATE_ORDER',
    GLIMPSE_PLE: 'GLIMPSE_PLE',
    PAGE_VIEW: 'PAGE_VIEW',
    PURCHASE_VARIANT: 'PURCHASE_VARIANT',
    TAP_ADD_TO_CART: 'TAP_ADD_TO_CART',
    VIEW_PDP: 'VIEW_PDP',
};

export const EventFactory = {
    [EVENT_NAMES.PAGE_VIEW]: {
        createEvent: function ({ ...otherProps }) {
            return {
                event: 'spresso_page_view',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    page: getCurrentUrl(),
                },
            };
        },
    },

    [EVENT_NAMES.VIEW_PDP]: {
        createEvent: function ({ variantId, variantPrice, variantReport, ...otherProps }) {
            return {
                event: 'spresso_view_pdp',
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

    [EVENT_NAMES.GLIMPSE_PLE]: {
        createEvent: function ({ variantId, variantPrice, variantReport, ...otherProps }) {
            return {
                event: 'spresso_glimpse_ple',
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

    [EVENT_NAMES.TAP_ADD_TO_CART]: {
        createEvent: function ({ variantId, variantPrice, variantReport, thestralFeatures, ...otherProps }) {
            return {
                event: 'spresso_tap_add_to_cart',
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

    [EVENT_NAMES.PURCHASE_VARIANT]: {
        createEvent: function ({ variantId, variantTotalPrice, variantQuantity, variantReport, orderId, thestralFeatures, ...otherProps }) {
            return {
                event: 'spresso_purchase_variant',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    variantId,
                    variantTotalPrice,
                    variantQuantity,
                    variantReport,
                    orderId,
                    // thestralFeatures,
                },
            };
        },
    },

    [EVENT_NAMES.CREATE_ORDER]: {
        createEvent: function ({ orderId, thestralFeatures, ...otherProps }) {
            return {
                event: 'spresso_create_order',
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
