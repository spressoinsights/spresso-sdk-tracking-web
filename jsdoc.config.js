'use strict';

module.exports = {
    source: {
        include: ['src'],
        includePattern: '\\.(jsx|js|ts|tsx)$',
    },

    tags: {
        allowUnknownTags: true,
    },

    plugins: ['plugins/markdown', 'node_modules/better-docs/typescript', 'node_modules/better-docs/category'],

    opts: {
        recurse: true,
        readme: './README.md',
        destination: 'docs/',
        template: 'node_modules/better-docs',
    },

    templates: {
        // search: true,

        default: {
            outputSourceFiles: false,
        },

        'better-docs': {
            name: 'Spresso Web SDK Docs',
            title: 'Sresso Web SDK Docs',
            // logo: 'https://app.spresso.com/public/favicon.svg',
            head: '<link rel="icon" type="image/svg+xml" href="https://app.spresso.com/public/favicon.svg" />',
            navLinks: [{ label: 'GitHub', href: 'https://github.com/giddyinc/spresso-sdk-tracking-web' }],
        },
    },
};
