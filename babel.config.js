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
                targets: 'last 2 versions, not dead, > 0.2%, not ie <= 10',
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
