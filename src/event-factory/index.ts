import { parseQueryParameters, getQueryParameters } from 'utils/browser';
import { getMetaProps, getRootProps, IRootProps, IMetaProps } from 'utils/properties';

export const EventFactory: TEventFactory = {
    ['PAGE_VIEW']: {
        createEvent: function ({ ...otherProps }) {
            const queryParameters = getQueryParameters();
            let parsedQueryParameters: any;

            if (queryParameters) {
                parsedQueryParameters = parseQueryParameters(queryParameters);
            }

            return {
                event: 'spresso_page_view',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    queryParameters,
                    utmMedium: parsedQueryParameters?.utm_medium,
                    utmSource: parsedQueryParameters?.utm_source,
                    utmCampaign: parsedQueryParameters?.utm_campaign,
                    utmTerm: parsedQueryParameters?.utm_term,
                    utmTarget: parsedQueryParameters?.utm_target,
                    utmPurpose: parsedQueryParameters?.utm_purpose,
                    utmAdId: parsedQueryParameters?.utm_ad_id,
                    utmExperiment: parsedQueryParameters?.utm_experiment,
                    referrerUrl: typeof document !== 'undefined' ? document.referrer : '',
                },
            };
        },
    },

    ['VIEW_PDP']: {
        createEvent: function ({ variantSku, variantPrice, variantName, variantCost, inStock, ...otherProps }) {
            return {
                event: 'spresso_view_pdp',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    variantSku,
                    variantName,
                    variantPrice,
                    variantCost,
                    inStock,
                    queryParameters: getQueryParameters(),
                },
            };
        },
    },

    ['GLIMPSE_PLE']: {
        createEvent: function ({ variantSku, variantPrice, variantName, variantCost, ...otherProps }) {
            return {
                event: 'spresso_glimpse_ple',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    variantSku,
                    variantName,
                    variantCost,
                    variantPrice,
                    queryParameters: getQueryParameters(),
                },
            };
        },
    },

    ['TAP_ADD_TO_CART']: {
        createEvent: function ({ variantSku, variantPrice, variantName, variantCost, ...otherProps }) {
            return {
                event: 'spresso_tap_add_to_cart',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    variantSku,
                    variantName,
                    variantCost,
                    variantPrice,
                    queryParameters: getQueryParameters(),
                },
            };
        },
    },

    ['PURCHASE_VARIANT']: {
        createEvent: function ({
            variantSku,
            variantTotalPrice,
            variantQuantity,
            orderNumber,
            variantName,
            variantCost,
            variantPrice,
            variantStandardPrice,
            ...otherProps
        }) {
            return {
                event: 'spresso_purchase_variant',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    variantSku,
                    variantName,
                    variantTotalPrice,
                    variantPrice,
                    variantStandardPrice,
                    variantCost,
                    variantQuantity,
                    orderNumber,
                },
            };
        },
    },

    ['CREATE_ORDER']: {
        createEvent: function ({
            orderNumber,
            totalOrderPrice,
            totalVariantQuantity,
            totalVariantCost,
            totalVariantPrice,
            shippingInfoAddressLine1,
            shippingInfoAddressLine2,
            shippingInfoCity,
            shippingInfoState,
            shippingInfoPostalCode,
            shippingInfoCountry,
            shippingInfoFirstName,
            shippingInfoLastName,
            orderFees,
            orderTax,
            orderDeductions,
            ...otherProps
        }) {
            return {
                event: 'spresso_create_order',
                ...getRootProps(),
                properties: {
                    ...getMetaProps(otherProps),
                    orderNumber,
                    totalOrderPrice,
                    totalVariantQuantity,
                    totalVariantCost,
                    totalVariantPrice,
                    shippingInfoAddressLine1,
                    shippingInfoAddressLine2,
                    shippingInfoCity,
                    shippingInfoState,
                    shippingInfoPostalCode,
                    shippingInfoCountry,
                    shippingInfoFirstName,
                    shippingInfoLastName,
                    orderFees,
                    orderTax,
                    orderDeductions,
                },
            };
        },
    },
};

export interface IEventData extends IPageEventData, IVariantEventData, IOrderEventData {
    userId?: string;
    postalCode?: string;
    remoteAddress?: string;
}

export interface IPageEventData {
    utmMedium?: string;
    utmSource?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmTarget?: string;
    utmPurpose?: string;
    utmAdId?: string;
    utmExperiment?: string;
    referrerUrl?: string;
    queryParameters?: string;
}

export interface IVariantEventData {
    variantSku?: string;
    variantName?: string;
    variantPrice?: number;
    variantStandardPrice?: number;
    variantCost?: number;
    variantQuantity?: number;
    variantTotalPrice?: number;
    inStock?: boolean;
}

export interface IOrderEventData {
    orderNumber?: string;
    totalOrderPrice?: number;
    totalVariantQuantity?: string;
    totalVariantCost?: number;
    totalVariantPrice?: number;
    shippingInfoAddressLine1?: string;
    shippingInfoAddressLine2?: string;
    shippingInfoCity?: string;
    shippingInfoState?: string;
    shippingInfoPostalCode?: string;
    shippingInfoCountry?: string;
    shippingInfoFirstName?: string;
    shippingInfoLastName?: string;
    orderTax?: number;
    orderFees?: number;
    orderDeductions?: Array<{ type: string; id: string; value: string }>;
}

export interface IEventObject extends IRootProps {
    event: string;
    properties: IMetaProps & IEventData;
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
