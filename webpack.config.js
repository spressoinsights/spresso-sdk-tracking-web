const path = require('path');
// const TerserPlugin = require('terser-webpack-plugin');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const WEBPACK_DEV_SERVER_PORT = 3002;

console.log({ 'process.env.NODE_ENV': process.env.NODE_ENV });

module.exports = {
    mode: isDev ? 'development' : 'production',

    // devtool: false,

    cache: {
        type: 'filesystem', // https://webpack.js.org/configuration/cache/#cachetype
    },

    entry: './src/index.js',

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
        // alias: {},
    },

    // optimization: {
    //     minimize: !isDev,
    //     minimizer: [
    //         !isDev && new TerserPlugin({
    //             minify: TerserPlugin.uglifyJsMinify,
    //             // `terserOptions` options will be passed to `uglify-js`
    //             // Link to options - https://github.com/mishoo/UglifyJS#minify-options
    //             terserOptions: {
    //                 mangle: { toplevel: true },
    //             },
    //         }),
    //     ].filter(Boolean),
    // },

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
