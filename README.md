# jdigiclock


## Install
* Require Jquery library
* Insert the code below in your html page :
```
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<link rel="stylesheet" type="text/css" href="jdigiclock/jquery.jdigiclock.css">
</head>
<body>
<div id="digiclock"></div>
<script type="text/javascript" src="jdigiclock/jquery.jdigiclock.js"></script>
<script>
$('#digiclock').jdigiclock({
    imagesPath : 'jdigiclock/images/',
    am_pm : false,
    weatherLocationCode : '615702',
    weatherMetric : 'C',
    weatherUpdate : '60'
});
</script>
</body>
</html>
```

## Preview
![alt tag](screenshot.png)


## Changelog

### Version 2.1.4 - 2016-05-31
* Modification by Thomas Cellerier
* Single view page, added French language

### Version 2.1.3 - 2015-03-21
* Unofficial modification by <a href="http://www.baldwhiteguy.co.nz" target="_blank">Andrew Mercer</a>
* Changed to use Yahoo Weather rather than defunct accuweather feed.
* Disabled proxy as redundant with JSONP callback.
* Server offset option allowing JDigiClock to display in specific timezone based on server-supplied time.
* Compatibility with JQuery 1.10.2      

### Version 2.1.0 - 2010-02-24
* Fixed bug with configuration option <code>weatherImagesPath</code> reported by <a href="http://www.emessage.it" target="_blank">Alessandro Benedetti</a>
* Animation method rewriting
* New configuration option <code>proxyType</code>
* Added .NET proxy. Thanks to <a href="http://www.emessage.it" target="_blank">Alessandro Benedetti</a>

### Version 2.0.0 - 2009-12-06
* Add 5-day forecast panel.

### Version 1.0.0 - 2009-11-28
* Initial release.
