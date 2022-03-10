import { getDeviceId } from 'utils/tracking';
import { getCurrentUrl } from 'utils/browser';

const getMetaProps = function ({ userId }) {
    const deviceId = getDeviceId();
    return {
        tenant_id: 'tenant',
        device_id: deviceId,
        // page: getCurrentUrl(),
        user_id: userId || deviceId,
        timestamp: new Date().getTime(),
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
        createEvent: function ({ userId }) {
            return {
                event: 'spressoPageView',
                properties: {
                    ...getMetaProps({ userId }),
                    page: getCurrentUrl(),
                },
            };
        },
    },

    [VIEW_PDP]: {
        createEvent: function ({ variantId, variantPrice, variantReport, userId }) {
            return {
                event: 'spressoViewPDP',
                properties: {
                    ...getMetaProps({ userId }),
                    variant_id: variantId,
                    variant_price: variantPrice,
                    variant_report: variantReport,
                },
            };
        },
    },

    [GLIMPSE_PLE]: {
        createEvent: function ({ variantId, variantPrice, variantReport, userId }) {
            return {
                event: 'spressoGlimpsePLE',
                properties: {
                    ...getMetaProps({ userId }),
                    variant_id: variantId,
                    variant_price: variantPrice,
                    variant_report: variantReport,
                },
            };
        },
    },

    [TAP_ADD_TO_CART]: {
        createEvent: function ({ variantId, variantPrice, variantReport, userId, thestralFeatures }) {
            return {
                event: 'spressoTapAddToCart',
                properties: {
                    ...getMetaProps({ userId }),
                    variant_id: variantId,
                    variant_price: variantPrice,
                    variant_report: variantReport,
                    // thestralFeatures,
                },
            };
        },
    },

    [PURCHASE_VARIANT]: {
        createEvent: function ({ variantId, variantPrice, variantReport, userId, thestralFeatures, orderId }) {
            return {
                event: 'spressoPurchaseVariant',
                properties: {
                    ...getMetaProps({ userId }),
                    variant_id: variantId,
                    variant_price: variantPrice,
                    variant_report: variantReport,
                    order_id: orderId,
                    // thestralFeatures,
                },
            };
        },
    },

    [CREATE_ORDER]: {
        createEvent: function ({ userId, thestralFeatures, orderId }) {
            return {
                event: 'spressoPurchaseVariant',
                properties: {
                    ...getMetaProps({ userId }),
                    order_id: orderId,
                    // thestralFeatures,
                },
            };
        },
    },
};
