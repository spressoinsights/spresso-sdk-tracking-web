'use strict';

module.exports = {
    plugins: ['plugins/markdown'],

    opts: {
        readme: './README.md',
        destination: 'docs/',
        template: './node_modules/clean-jsdoc-theme',
        theme_opts: {
            theme: 'light',
            favicon: 'https://app.spresso.com/public/favicon.svg',
            title: 'Getting Started',
        },
    },
};
