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
        readme: './docs/README.md',
        destination: 'docs/',
        template: 'node_modules/better-docs',
    },

    templates: {
        // search: true,

        default: {
            outputSourceFiles: false,
        },

        'better-docs': {
            // name: 'Web Event SDK Documentation',
            title: 'Spresso Web Event SDK',
            logo: 'static/images/logo.jpeg',
            css: 'static/styles/style.css',
            head: '<link rel="icon" type="image/svg+xml" href="https://app.spresso.com/public/favicon.svg" />',
            navLinks: [{ label: 'GitHub', href: 'https://github.com/spressoinsights/spresso-sdk-tracking-web' }],
            hideGenerator: true,
        },
    },
};
