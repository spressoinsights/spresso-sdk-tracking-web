import { v4 as uuidv4 } from 'uuid';
// const { v4: uuidv4 } = require('uuid');
import { writeCookie, readCookie, removeCookie } from 'utils/cookie';

const setDeviceId = function () {
    const deviceId = uuidv4();
    writeCookie({ name: 'deviceId', value: deviceId });
    return deviceId;
};

export const getDeviceId = function () {
    return readCookie('deviceId');
};

export const initDeviceId = function () {
    let deviceId = getDeviceId();

    if (!deviceId || deviceId === '') {
        deviceId = setDeviceId();
    }

    return deviceId;
};
