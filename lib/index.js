(function (window) {
    let SpressoSdk = {};

    SpressoSdk.init = function () {
        console.log('initialized!');
    };

    window.SpressoSdk = SpressoSdk;
})(typeof window !== 'undefined' ? window : this);
