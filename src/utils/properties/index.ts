import { v4 as uuidv4 } from 'uuid';
import { writeCookie, readCookie, removeCookie } from 'utils/cookie';
import { IEventData } from 'event-factory';

function setDeviceId() {
    const deviceId = uuidv4();
    writeCookie({ name: 'spressoDeviceId', value: deviceId, domain: '' });
    return deviceId;
}

export function getDeviceId() {
    return readCookie('spressoDeviceId');
}

export function initDeviceId() {
    let deviceId = getDeviceId();

    if (!deviceId || deviceId === '') {
        deviceId = setDeviceId();
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

export function getMetaProps({ userId }: IEventData): IMetaProps {
    const deviceId = getDeviceId();
    return {
        deviceId,
        userId: userId || deviceId,
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
}
