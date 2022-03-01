(function (window) {
    const { addPageViewListener } = require('utils/url');
    const { initCommonProperties } = require('utils/tracking');

    let SpressoSdk = {
        init: function () {
            initCommonProperties();
            addPageViewListener(window, () => console.log('pageview'));

            console.log('initialized');
        },
    };

    window.SpressoSdk = SpressoSdk;
    window.SpressoSdk.init();
})(typeof window !== 'undefined' ? window : this);
