const path = require('path');
const webpack = require('webpack');
const NodemonPlugin = require('nodemon-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const packageJson = require('./package.json');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const useNodemon = process.env.USE_NODEMON === 'true';

const WEBPACK_DEV_SERVER_PORT = 3003;

const resolveExtensions = ['*', '.js', '.ts'];

const stats = {
    preset: 'normal',
    errorDetails: true,
    warnings: true,
    modules: false,
};

console.log({ 'process.env.NODE_ENV': process.env.NODE_ENV, useNodemon });

module.exports = {
    mode: isDev ? 'development' : 'production',

    devtool: isDev && 'eval-cheap-module-source-map',

    cache: {
        type: 'filesystem', // https://webpack.js.org/configuration/cache/#cachetype
    },

    entry: path.resolve(__dirname, './src/index.ts'),

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'spresso.sdk.tracking.web.js',
        library: {
            name: 'SpressoSdk',
            type: 'umd', // enable browser or node import
            export: 'default',
        },
        globalObject: 'this',
    },

    module: {
        rules: [
            {
                // Use Babel to handle browser compatibility
                test: /\.(ts|js)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        // Use Babel to handle browser compatibility
                        loader: 'babel-loader',
                        options: {
                            envName: isDev ? 'development' : 'production', // transpile code in prod mode for staging/production builds
                            cacheDirectory: true,
                            cacheCompression: !isDev, // https://javascript.plainenglish.io/how-to-improve-webpack-performance-7637db26fa5f
                            configFile: path.resolve(__dirname, 'babel.config.js'),
                        },
                    },
                    'ts-loader',
                ],
            },
        ],
    },

    resolve: {
        extensions: resolveExtensions,

        plugins: [
            new TsconfigPathsPlugin({
                configFile: `tsconfig.json`,
                extensions: resolveExtensions, // https://github.com/dividab/tsconfig-paths-webpack-plugin#extensions-string-defaultts-tsx
            }),
        ],
    },

    plugins: [
        // new webpack.ProgressPlugin({
        //     profile: true,
        // }),
        new webpack.DefinePlugin({
            __SDK_VERSION__: JSON.stringify(packageJson.version),
        }),
        useNodemon &&
            new NodemonPlugin({
                // only runs on `dev:prod-mode`
                exec: 'serve',
                script: 'dist',
                args: [`--listen=${WEBPACK_DEV_SERVER_PORT}`],
                watch: ['./dist'],
                ext: 'js',
                env: {
                    NODE_ENV: 'production',
                },
            }),
    ].filter(Boolean),

    stats,

    devServer: isDev
        ? {
              hot: true,
              port: WEBPACK_DEV_SERVER_PORT,
              devMiddleware: {
                  stats,
              },
          }
        : {},
};
