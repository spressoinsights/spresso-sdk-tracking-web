import { v4 as uuidv4 } from 'uuid';
import { writeCookie, readCookie } from 'utils/cookie';
import { getCurrentUrl } from 'utils/browser';
import { IEventData } from 'event-factory';

function setDeviceId(id?: string) {
    let deviceId = id;
    if (!Boolean(deviceId)) {
        deviceId = uuidv4();
    }
    writeCookie({ name: 'spressoDeviceId', value: deviceId, domain: '' });
    return deviceId;
}

export function getDeviceId() {
    return readCookie('spressoDeviceId');
}

export function initDeviceId(id?: string) {
    let deviceId = getDeviceId();

    if (!deviceId || deviceId === '') {
        deviceId = setDeviceId(id);
    }

    return deviceId;
}

export function getRootProps(): IRootProps {
    const currentTimestamp = new Date();

    return {
        uid: uuidv4(),
        utcTimestampMs: currentTimestamp.getTime(),
        timezoneOffset: currentTimestamp.getTimezoneOffset() * 60 * 1000, // convert to milliseconds
    };
}

export function getMetaProps({ userId, postalCode, remoteAddress, deviceId, refUserId }: IEventData): IMetaProps {
    let _deviceId = getDeviceId(); // use cookie

    if (!Boolean(_deviceId) && Boolean(deviceId)) {
        // if cookie doesn't exist, use memory
        _deviceId = setDeviceId(deviceId);
    } else if (!Boolean(_deviceId) && !Boolean(deviceId)) {
        // cookie/memory don't exist, re-generate new `deviceId`
        _deviceId = setDeviceId();
    }

    return {
        deviceId: _deviceId,
        userId: userId || deviceId,
        refUserId,
        isLoggedIn: Boolean(userId) && userId !== deviceId,
        page: getCurrentUrl(),
        platform: 'Web',
        postalCode,
        remoteAddress: remoteAddress || '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        version: __SDK_VERSION__,
    };
}

export interface IRootProps {
    uid: string;
    utcTimestampMs: number;
    timezoneOffset: number;
}

export interface IMetaProps {
    deviceId: string;
    userId: string;
    refUserId?: string;
    isLoggedIn: boolean;
    page: string;
    platform: string;
    postalCode?: string;
    remoteAddress?: string;
    userAgent: string;
    version: string;
}
