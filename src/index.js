(function (window) {
    const { addPageViewListener } = require('utils/url');
    const { setDeviceId } = require('utils/tracking');

    let SpressoSdk = {
        init: function () {
            console.log('initialized');
			console.log(setDeviceId());
            addPageViewListener(window, () => console.log('pageview'));
        },
    };

    window.SpressoSdk = SpressoSdk;
    window.SpressoSdk.init();
})(typeof window !== 'undefined' ? window : this);
