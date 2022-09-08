import { getCurrentUrl } from 'utils/browser';
import { getMetaProps, getRootProps, IRootProps, IMetaProps } from 'utils/properties';

export const EventFactory: TEventFactory = {
    ['PAGE_VIEW']: {
        createEvent: function ({
            utmMedium,
            utmSource,
            utmCampaign,
            utmTerm,
            utmTarget,
            utmPurpose,
            utmAdId,
            utmExperiment,
            postalCode,
            remoteAddress,
            referrerUrl,
            userAgent,
            queryParameters,
            ...otherProps
        }) {
            return {
                event: 'spresso_page_view',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    page: getCurrentUrl(),
                    utmMedium,
                    utmSource,
                    utmCampaign,
                    utmTerm,
                    utmTarget,
                    utmPurpose,
                    utmAdId,
                    utmExperiment,
                    postalCode,
                    remoteAddress,
                    referrerUrl,
                    userAgent,
                    queryParameters,
                },
            };
        },
    },

    ['VIEW_PDP']: {
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

    ['GLIMPSE_PLE']: {
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

    ['TAP_ADD_TO_CART']: {
        createEvent: function ({ variantId, variantPrice, variantReport, ...otherProps }) {
            return {
                event: 'spresso_tap_add_to_cart',
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

    ['PURCHASE_VARIANT']: {
        createEvent: function ({ variantId, variantTotalPrice, variantQuantity, variantReport, orderId, ...otherProps }) {
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
                },
            };
        },
    },

    ['CREATE_ORDER']: {
        createEvent: function ({ orderId, ...otherProps }) {
            return {
                event: 'spresso_create_order',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    orderId,
                },
            };
        },
    },
};

export interface IEventData {
    orderId?: string;
    userId?: string;
    variantId?: string;
    variantPrice?: number;
    variantQuantity?: number;
    variantReport?: any;
    variantTotalPrice?: number;
    utmMedium?: string;
    utmSource?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmTarget?: string;
    utmPurpose?: string;
    utmAdId?: string;
    utmExperiment?: string;
    postalCode?: string;
    remoteAddress?: string;
    referrerUrl?: string;
    userAgent?: string;
    queryParameters?: string;
}

export interface IEventObject extends IRootProps {
    event: string;
    properties: IMetaProps &
        IEventData & {
            page?: string;
        };
}

/**
 * @memberof SpressoSdk
 * @alias TEventName
 * A list of event names that can be passed into {@link SpressoSdk#queueEvent}.
 */
type TEventName = {
    /**
     * Requires the same `eventData` as {@link SpressoSdk#trackCreateOrder}.
     */
    CREATE_ORDER: string;
    /**
     * Requires the same `eventData` as {@link SpressoSdk#trackGlimpsePLE}.
     */
    GLIMPSE_PLE: string;
    /**
     * Requires the same `eventData` as {@link SpressoSdk#trackPageView}.
     */
    PAGE_VIEW: string;
    /**
     * Requires the same `eventData` as {@link SpressoSdk#trackPurchaseVariant}.
     */
    PURCHASE_VARIANT: string;
    /**
     * Requires the same `eventData` as {@link SpressoSdk#trackTapAddToCart}.
     */
    TAP_ADD_TO_CART: string;
    /**
     * Requires the same `eventData` as {@link SpressoSdk#trackViewPDP}.
     */
    VIEW_PDP: string;
};

type TEventFactory = {
    [Property in keyof TEventName]: {
        createEvent: (eventData: IEventData) => IEventObject;
    };
};

export type TEventNameLiteral = keyof TEventName;
