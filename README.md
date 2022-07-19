# Spresso Web SDK

## Overview

Spresso Web SDK is a client-side JavaScript library you can install in your project to start sending event data from anywhere in your application.
### 1. Initialize the library in your project

Paste the HTML script tag snippet within the `<head>` tag of your page and initialize with your Org ID.

```
<script>
    (function (orgId) {
        window.SpressoSdk = window.SpressoSdk || { init: function(orgId) { SpressoSdk.orgId = orgId; } }
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://boxed-spresso-sdk-staging-gcp.boxed.com/tracking-web/0.1.17-alpha/spresso.sdk.tracking.web.js';
        s.onload = function() { window.SpressoSdk.init(orgId) }
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    })('orgId');
</script>
```

### 2. Send Data

Let's get started by sending event data, for example, when a user views a Product Details Page (PDP).

```javascript
SpressoSdk.trackViewPDP({
    variantId: 'some-id',
    variantPrice: '1000000',
    userId: 'awesome-customer-id',
});
```

Click [here](SpressoSdk.html) for the all the events that you can send. 