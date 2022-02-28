(function (window) {
    const { addPageViewListener } = require('utils/url');

    let SpressoSdk = {
        init: function () {
            console.log('initialized');

            addPageViewListener(window, () => console.log('pageview again'));
        },
    };

    window.SpressoSdk = SpressoSdk;
    window.SpressoSdk.init();
})(typeof window !== 'undefined' ? window : this);
