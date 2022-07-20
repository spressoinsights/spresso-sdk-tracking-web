# Spresso Web SDK

## Overview

Spresso Web SDK is a client-side JavaScript library you can install in your project to start sending event data from anywhere in your application.
### 1. Initialize the library in your project

Paste the HTML script tag snippet within the `<head>` tag of your page and initialize with your Org ID.

```
<script>
    (function (options) {
        window.SpressoSdk = window.SpressoSdk || { init: function(o) { SpressoSdk.options = o; } }
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://boxed-spresso-sdk-staging-gcp.boxed.com/tracking-web/v2.2.19-alpha/spresso.sdk.tracking.web.js';
        s.onload = function() { window.SpressoSdk.init(options) }
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    })({ orgId: 'YOUR_ORG_ID' });
</script>
```

If User ID is available, paste the HTML script tag snippet below to initialize with Org ID and User ID. 
```
<script>
    (function (options) {
        window.SpressoSdk = window.SpressoSdk || { init: function(o) { SpressoSdk.options = o; } }
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://boxed-spresso-sdk-staging-gcp.boxed.com/tracking-web/v2.2.19-alpha/spresso.sdk.tracking.web.js';
        s.onload = function() { window.SpressoSdk.init(options) }
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    })({ orgId: 'YOUR_ORG_ID', userId: 'USER_ID' });
</script>
```

### 2. Send Data

Let's get started by sending event data, for example, when a user views a Product Details Page (PDP).

```javascript
SpressoSdk.trackViewPDP({
    variantId: 'some-id',
    variantPrice: 1000000,
    userId: 'awesome-customer-id',
});
```

Click [here](SpressoSdk.html) for all the events that you can send. 