const isDebugMode = process.env.NODE_ENV !== 'production';

export const consoleLog = function () {
    if (isDebugMode) {
        console.log.apply(null, arguments);
    }
};
