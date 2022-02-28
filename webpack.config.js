const path = require('path');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

module.exports = {
    mode: isDev ? 'development' : 'production',

    // devtool: false,

    target: ['web', 'es5'], // to support IE11: https://webpack.js.org/migrate/5/#need-to-support-an-older-browser-like-ie-11

    entry: './lib/index.js',

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
        alias: {
            utils: path.resolve(__dirname, 'lib/utils/'),
        },
    },

    devServer: {
        hot: true,
        port: 3000,
        devMiddleware: {
            stats: {
                colors: true,
                errors: true,
                warnings: true,
            },
        },
    },
};
