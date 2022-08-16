const isDebugMode = process.env.NODE_ENV !== 'production';

export function consoleLog(...args: Array<string | object>) {
    if (isDebugMode) {
        console.log.apply(null, args);
    }
}
