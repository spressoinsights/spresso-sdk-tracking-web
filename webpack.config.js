const path = require('path');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const WEBPACK_DEV_SERVER_PORT = 3002;

module.exports = {
    mode: isDev ? 'development' : 'production',

    // devtool: false,

    // target: ['web', 'es5'], // to support IE11: https://webpack.js.org/migrate/5/#need-to-support-an-older-browser-like-ie-11
    target: 'web',

    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'spresso.sdk.web.js',
    },

    module: {
        rules: [
            {
                // Use Babel to handle browser compatibility
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    cacheCompression: !isDev, // https://javascript.plainenglish.io/how-to-improve-webpack-performance-7637db26fa5f
                    cacheDirectory: true,
                },
            },
        ],
    },

    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'], // https://webpack.js.org/configuration/resolve/#resolvemodules
        // alias: {},
    },

    devServer: {
        hot: true,
        port: WEBPACK_DEV_SERVER_PORT,
        devMiddleware: {
            stats: {
                colors: true,
                errors: true,
                warnings: true,
            },
        },
    },
};
