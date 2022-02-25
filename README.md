# Spresso Web SDK

## What is Spresso Web SDK?

TBD

## How to use Spresso Web SDK in Prod?

TBD
```
<script>
    (function () {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'http://<SOME CDN>/v1.0.0/spresso-sdk-web.js';
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    })();
</script>
```

## Development

1. Run `npm start` in project dir to serve the SDK script on [http://localhost:3000/spresso.sdk.web.js](http://localhost:3000/spresso.sdk.web.js)
2. Run `npm start` in `examples/react-app` to start a React app on [http://localhost:8080](http://localhost:8080)

Copy/paste this script tag in the example React app or websites of your own choice.

```
<script>
    (function () {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'http://localhost:3000/spresso.sdk.web.js';
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    })();
</script>
```

## Testing

TBD
