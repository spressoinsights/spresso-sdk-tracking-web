const path = require('path');

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

console.log('using babel.config.js');

module.exports = function (api) {
    api.cache(true);

    let presets = [
        [
            '@babel/preset-env',
            {
                corejs: 3, // To polyfill ES6 features for browsers that don't support them
                useBuiltIns: 'usage', // With this, @babel/preset-env replaces direct imports of core-js to imports of only the specific modules required for a target environment: https://karen-kua.medium.com/the-end-of-babel-polyfill-the-more-efficient-alternative-95f959fef9c2
                targets: 'defaults, not ie <= 11', // https://github.com/browserslist/browserslist#full-list
                // targets: 'defaults',
                // debug: true,
            },
        ],
    ];

    let plugins = [];

    return {
        presets,
        plugins,
        comments: isDev,
    };
};
