import { v4 as uuidv4 } from 'uuid';
// const { v4: uuidv4 } = require('uuid');

export const setDeviceId = function () {
    return uuidv4();
};
