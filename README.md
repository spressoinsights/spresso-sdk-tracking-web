# Spresso Web SDK

## What is Spresso Web SDK?

Lorem eiusmod non duis ea deserunt ut. Excepteur mollit irure exercitation nostrud nisi sint dolor eu sunt voluptate aute cupidatat laborum. Velit ipsum tempor ad mollit ullamco consectetur laborum veniam elit. Dolor quis duis quis quis cupidatat reprehenderit velit irure nulla nisi ad et qui aliquip.

## How to use Spresso Web SDK in Prod?

Lorem eiusmod non duis ea deserunt ut. Excepteur mollit irure exercitation nostrud nisi sint dolor eu sunt voluptate aute cupidatat laborum. Velit ipsum tempor ad mollit ullamco consectetur laborum veniam elit. Dolor quis duis quis quis cupidatat reprehenderit velit irure nulla nisi ad et qui aliquip.

```
<script>
	(function (tenantId) {
		window.SpressoSdk = window.SpressoSdk || { init: function() { SpressoSdk.tenantId = tenantId; } };
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.async = true;
		s.src = 'http://localhost:3002/spresso.sdk.web.js';
		s.onload = function() { SpressoSdk.init(tenantId) }
		var x = document.getElementsByTagName('script')[0];
		x.parentNode.insertBefore(s, x);
	})('tenantId');
</script>
```

## Development

1. Run `npm install` in project dir.
2. Run `npm run dev` in project dir to serve the SDK script on [http://localhost:3002/spresso.sdk.web.js](http://localhost:3002/spresso.sdk.web.js)
3. Run `npm install` in `examples/react-app`
4. Run `npm start` in `examples/react-app` to start a React app on [http://localhost:8080](http://localhost:8080)

Copy/paste this script tag in the example React app or websites of your own choice.

```
<script>
	(function (tenantId) {
		window.SpressoSdk = window.SpressoSdk || { init: function() { SpressoSdk.tenantId = tenantId; } };
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.async = true;
		s.src = 'http://localhost:3002/spresso.sdk.web.js';
		s.onload = function() { SpressoSdk.init(tenantId) }
		var x = document.getElementsByTagName('script')[0];
		x.parentNode.insertBefore(s, x);
	})('tenantId');
</script>
```

## Testing

Lorem eiusmod non duis ea deserunt ut. Excepteur mollit irure exercitation nostrud nisi sint dolor eu sunt voluptate aute cupidatat laborum. Velit ipsum tempor ad mollit ullamco consectetur laborum veniam elit. Dolor quis duis quis quis cupidatat reprehenderit velit irure nulla nisi ad et qui aliquip.
