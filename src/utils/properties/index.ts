import { v4 as uuidv4 } from 'uuid';
import { writeCookie, readCookie, removeCookie } from 'utils/cookie';
import { IEventData } from 'event-factory';

const setDeviceId = function () {
    const deviceId = uuidv4();
    writeCookie({ name: 'spressoDeviceId', value: deviceId, domain: '' });
    return deviceId;
};

export const getDeviceId = function () {
    return readCookie('spressoDeviceId');
};

export const initDeviceId = function () {
    let deviceId = getDeviceId();

    if (!deviceId || deviceId === '') {
        deviceId = setDeviceId();
    }

    return deviceId;
};

export interface IRootProps {
    uid: string;
    utcTimestampMs: number;
    timezoneOffset: number;
}

export const getRootProps = function (): IRootProps {
    const currentTimestamp = new Date();

    return {
        uid: uuidv4(),
        utcTimestampMs: currentTimestamp.getTime(),
        timezoneOffset: currentTimestamp.getTimezoneOffset() * 60 * 1000, // convert to milliseconds
    };
};

export interface IMetaProps {
    deviceId: string;
    userId: string;
}

export const getMetaProps = function ({ userId }: IEventData): IMetaProps {
    const deviceId = getDeviceId();
    return {
        deviceId,
        userId: userId || deviceId,
    };
};
