/**
<script>
    (function () {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'http://localhost:3000/index.js';
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    })();
</script>
 */

(function (window) {
    let SpressoSdk = {};

    SpressoSdk.init = function () {
        console.log('initialized!');
    };

    window.SpressoSdk = SpressoSdk;
})(typeof window !== 'undefined' ? window : this);
