# jdigiclock


## Install
* Require Jquery library (cf. code below)
* Insert the code below in your html page and change the parameters to fit your needs :
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
    imagesPath : 'jdigiclock/images/', // Base path to image files. Clock and Weather images are located in subdirectories below this
    lang: 'fr', // Language of date : fr or en
    am_pm : false, // Specifies the AM/PM option.
    weatherLocationCode : '615702', // Weather location code (see lookup: woeid.rosselliot.co.nz).
    weatherMetric : 'C', // Specifies the weather metric mode: c or f.
    weatherUpdate : '60', // Weather update in minutes.
    svrOffset: 0  // Server offset in milliseconds.
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
