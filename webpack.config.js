const path = require('path');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const WEBPACK_DEV_SERVER_PORT = 3002;

console.log({ 'process.env.NODE_ENV': process.env.NODE_ENV });

module.exports = {
    mode: isDev ? 'development' : 'production',

    devtool: isDev && 'eval-cheap-module-source-map',

    cache: {
        type: 'filesystem', // https://webpack.js.org/configuration/cache/#cachetype
    },

    entry: path.resolve(__dirname, './src/index.js'),

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'spresso.sdk.tracking.web.js',
        library: {
            name: 'SpressoSdk',
            type: 'umd', // enable browser or node import
            export: 'default',
        },
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
    },

    ...(isDev && {
        devServer: {
            hot: true,
            port: WEBPACK_DEV_SERVER_PORT,
            devMiddleware: {
                stats: {
                    preset: 'normal',
                    errorDetails: true,
                },
            },
        },
    }),
};
