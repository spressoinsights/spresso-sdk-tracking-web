# Spresso Web SDK

## What is Spresso Web SDK?

Description TBD

## How to use Spresso Web SDK?

```
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
```

## Development

1. Run `npm start` in project dir to serve the SDK script on [http://localhost:3000/index.js](http://localhost:3000/index.js)
2. Run `npm start` in `examples/react-app` to start a React app on [http://localhost:8080](http://localhost:8080)

## Testing

TBD
