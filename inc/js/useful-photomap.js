/*
	Source:
	van Creij, Maurice (2012). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var polyfills = polyfills || {};

	// enabled the use of HTML5 elements in Internet Explorer
	polyfills.html5 = function () {
		var a, b, elementsList;
		elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
		if (navigator.userAgent.match(/msie/gi)) {
			for (a = 0 , b = elementsList.length; a < b; a += 1) {
				document.createElement(elementsList[a]);
			}
		}
	};

	// allow array.indexOf in older browsers
	polyfills.arrayIndexOf = function () {
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (obj, start) {
				for (var i = (start || 0), j = this.length; i < j; i += 1) {
					if (this[i] === obj) { return i; }
				}
				return -1;
			};
		}
	};

	// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
	polyfills.querySelectorAll = function () {
		if (!document.querySelectorAll) {
			document.querySelectorAll = function (a) {
				var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
				return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
			};
		}
	};

	// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
	polyfills.addEventListener = function () {
		!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
			WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
				var target = this;
				registry.unshift([target, type, listener, function (event) {
					event.currentTarget = target;
					event.preventDefault = function () { event.returnValue = false; };
					event.stopPropagation = function () { event.cancelBubble = true; };
					event.target = event.srcElement || target;
					listener.call(target, event);
				}]);
				this.attachEvent("on" + type, registry[0][3]);
			};
			WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
				for (var index = 0, register; register = registry[index]; ++index) {
					if (register[0] == this && register[1] == type && register[2] == listener) {
						return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
					}
				}
			};
			WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
				return this.fireEvent("on" + eventObject.type, eventObject);
			};
		})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
	};

	// allow console.log
	polyfills.consoleLog = function () {
		var overrideTest = new RegExp('console-log', 'i');
		if (!window.console || overrideTest.test(document.querySelectorAll('html')[0].className)) {
			window.console = {};
			window.console.log = function () {
				// if the reporting panel doesn't exist
				var a, b, messages = '', reportPanel = document.getElementById('reportPanel');
				if (!reportPanel) {
					// create the panel
					reportPanel = document.createElement('DIV');
					reportPanel.id = 'reportPanel';
					reportPanel.style.background = '#fff none';
					reportPanel.style.border = 'solid 1px #000';
					reportPanel.style.color = '#000';
					reportPanel.style.fontSize = '12px';
					reportPanel.style.padding = '10px';
					reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
					reportPanel.style.right = '10px';
					reportPanel.style.bottom = '10px';
					reportPanel.style.width = '180px';
					reportPanel.style.height = '320px';
					reportPanel.style.overflow = 'auto';
					reportPanel.style.zIndex = '100000';
					reportPanel.innerHTML = '&nbsp;';
					// store a copy of this node in the move buffer
					document.body.appendChild(reportPanel);
				}
				// truncate the queue
				var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
				// process the arguments
				for (a = 0, b = arguments.length; a < b; a += 1) {
					messages += arguments[a] + '<br/>';
				}
				// add a break after the message
				messages += '<hr/>';
				// output the queue to the panel
				reportPanel.innerHTML = messages + reportString;
			};
		}
	};

	// allows Object.create (https://gist.github.com/rxgx/1597825)
	polyfills.objectCreate = function () {
		if (typeof Object.create !== "function") {
			Object.create = function (original) {
				function Clone() {}
				Clone.prototype = original;
				return new Clone();
			};
		}
	};

	// allows String.trim (https://gist.github.com/eliperelman/1035982)
	polyfills.stringTrim = function () {
		if (!String.prototype.trim) {
			String.prototype.trim = function () { return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ''); };
		}
		if (!String.prototype.ltrim) {
			String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
		}
		if (!String.prototype.rtrim) {
			String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
		}
		if (!String.prototype.fulltrim) {
			String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
		}
	};

	// for immediate use
	polyfills.html5();
	polyfills.arrayIndexOf();
	polyfills.querySelectorAll();
	polyfills.addEventListener();
	polyfills.consoleLog();
	polyfills.objectCreate();
	polyfills.stringTrim();

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "useful.requests.js: A library of useful functions to ease working with AJAX and JSON.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Fallbacks:
	<!--[if IE]>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<![endif]-->
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var request = request || {};

	// adds a random argument to the AJAX URL to bust the cache
	request.randomise = function (url) {
		return url.replace('?', '?time=' + new Date().getTime() + '&');
	};

	// perform and handle an AJAX request
	request.send = function (properties) {
		var serverRequest;
		// create an HTTP request
		serverRequest = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
		// add the onchange handler
		serverRequest.onreadystatechange = function () {
			request.update(serverRequest, properties);
		};
		// if the request is a POST
		if (properties.post) {
			// open the request
			serverRequest.open('POST', properties.url, true);
			// set its header
			serverRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			serverRequest.setRequestHeader("Content-length", properties.post.length);
			serverRequest.setRequestHeader("Connection", "close");
			// send the request, or fail gracefully
			try { serverRequest.send(properties.post); }
			catch (errorMessage) { properties.onFailure({readyState : -1, status : -1, statusText : errorMessage}); }
		// else treat it as a GET
		} else {
			// open the request
			serverRequest.open('GET', request.randomise(properties.url), true);
			// send the request
			try { serverRequest.send(); }
			catch (errorMessage) { properties.onFailure({readyState : -1, status : -1, statusText : errorMessage}); }
		}
	};

	// regularly updates the status of the request
	request.update = function (serverRequest, properties) {
		// react to the status of the request
		if (serverRequest.readyState === 4) {
			switch (serverRequest.status) {
			case 200 :
				properties.onSuccess(serverRequest, properties);
				break;
			case 304 :
				properties.onSuccess(serverRequest, properties);
				break;
			default :
				properties.onFailure(serverRequest, properties);
			}
		} else {
			properties.onProgress(serverRequest, properties);
		}
	};

	// turns a string back into a DOM object
	request.deserialize = function (text) {
		var parser, xmlDoc;
		// if the DOMParser exists
		if (window.DOMParser) {
			// parse the text as an XML DOM
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(text, "text/xml");
		// else assume this is Microsoft doing things differently again
		} else {
			// parse the text as an XML DOM
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = "false";
			xmlDoc.loadXML(text);
		}
		// return the XML DOM object
		return xmlDoc;
	};

	// turns a json string into a JavaScript object
	request.decode = function (text) {
		var object;
		object = {};
		// if JSON.parse is available
		if (typeof JSON !== 'undefined' && typeof JSON.parse !== 'undefined') {
			// use it
			object = JSON.parse(text);
		// if jQuery is available
		} else if (typeof jQuery !== 'undefined') {
			// use it
			object = jQuery.parseJSON(text);
		}
/*
		else {
			// do something desperate
			eval('object = ' + text);
		}
*/
		// return the object
		return object;
	};

	// public functions
	useful.request = useful.request || {};
	useful.request.send = request.send;
	useful.request.decode = request.decode;

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "useful.context.js: Plots the GPS data of the photos in a slideshow on a map", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<script src="http://www.context.org/openlayers/context.js"></script>
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	useful.Photomap = function (obj, cfg) {
		// properties
		this.obj = obj;
		this.cfg = cfg;
		// methods
		this.start = function () {
			this.busy.setup(this);
			this.gpx.load(this);
			// disable the start function so it can't be started twice
			this.start = function () {};
		};
		this.busy = {};
		this.busy.setup = function () {};
		this.busy.show = function () {};
		this.busy.hide = function () {};
		this.exif = {};
		this.exif.load = function (src, context) {
			// retrieve the exif data of a photo
			useful.request.send({
				url : context.cfg.exif.replace('{src}', src),
				post : null,
				onProgress : function (reply) {
					return reply;
				},
				onFailure : function (reply) {
					return reply;
				},
				onSuccess : function (reply) {
					context.exif.convert(useful.request.decode(reply.responseText), context);
				}
			});
		};
		this.exif.convert = function (exif, context) {
			var deg, min, sec;
console.log(exif);
			// longitude
			deg = (exif.GPS.GPSLongitude[0].match(/\//)) ?
				parseInt(exif.GPS.GPSLongitude[0].split('/')[0], 10) / parseInt(exif.GPS.GPSLongitude[0].split('/')[1], 10):
				parseInt(exif.GPS.GPSLongitude[0], 10);
			min = (exif.GPS.GPSLongitude[1].match(/\//)) ?
				parseInt(exif.GPS.GPSLongitude[1].split('/')[0], 10) / parseInt(exif.GPS.GPSLongitude[1].split('/')[1], 10):
				parseInt(exif.GPS.GPSLongitude[1], 10);
			sec = (exif.GPS.GPSLongitude[2].match(/\//)) ?
				parseInt(exif.GPS.GPSLongitude[2].split('/')[0], 10) / parseInt(exif.GPS.GPSLongitude[2].split('/')[1], 10):
				parseInt(exif.GPS.GPSLongitude[2], 10);
			context.cfg.indicator.lon = (deg + min / 60 + sec / 3600) * (exif.GPS.GPSLongitudeRef === "W" ? -1 : 1);
			// latitude
			deg = (exif.GPS.GPSLatitude[0].match(/\//)) ?
				parseInt(exif.GPS.GPSLatitude[0].split('/')[0], 10) / parseInt(exif.GPS.GPSLatitude[0].split('/')[1], 10):
				parseInt(exif.GPS.GPSLatitude[0], 10);
			min = (exif.GPS.GPSLatitude[1].match(/\//)) ?
				parseInt(exif.GPS.GPSLatitude[1].split('/')[0], 10) / parseInt(exif.GPS.GPSLatitude[1].split('/')[1], 10):
				parseInt(exif.GPS.GPSLatitude[1], 10);
			sec = (exif.GPS.GPSLatitude[2].match(/\//)) ?
				parseInt(exif.GPS.GPSLatitude[2].split('/')[0], 10) / parseInt(exif.GPS.GPSLatitude[2].split('/')[1], 10):
				parseInt(exif.GPS.GPSLatitude[2], 10);
			context.cfg.indicator.lat = (deg + min / 60 + sec / 3600) * (exif.GPS.GPSLatitudeRef === "N" ? 1 : -1);
			// temporary console report
			if (typeof(console) !== 'undefined') {
				console.log(context.cfg.indicator);
			}
			// render the indicator
			context.indicator.add(context);
			// focus the map on the indicator
			context.indicator.focus(context);
		};
		this.exif.unload = function (context) {
			// remove the indicator
			context.indicator.remove(context);
		};
		this.gpx = {};
		this.gpx.load = function (context) {
			// show the busy indicator
			context.busy.show(context);
			// onload
			useful.request.send({
				url : context.cfg.gpx,
				post : null,
				onProgress : function (reply) { return reply; },
				onFailure : function (reply) { return reply; },
				onSuccess : function (reply) {
					// store the result
					context.cfg.gpxDOM = reply.responseXML;
					// draw the map
					context.map.setup(context);
					// plot the route
					context.route.plot(context);
					// show the permanent markers
					context.markers.add(context);
					// show the indicator
					context.indicator.add(context);
					// prepare the balloon
					context.cfg.balloon = context.cfg.balloon || {};
					// hide the busy indicator
					context.busy.show(context);
				}
			});
		};
		this.map = {};
		this.map.setup = function (context) {
			// define the map
			context.cfg.map = {};
			context.cfg.map.object = new OpenLayers.Map("testmap", {
				controls: [
					new OpenLayers.Control.Navigation(),
					new OpenLayers.Control.PanZoomBar(),
					new OpenLayers.Control.LayerSwitcher(),
					new OpenLayers.Control.Attribution()
				],
				maxExtent: new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34),
				maxResolution: 156543.0399,
				numZoomLevels: 19,
				units: 'm',
				projection: new OpenLayers.Projection("EPSG:900913"),
				displayProjection: new OpenLayers.Projection("EPSG:4326")
			});
			// define the map layer
			var layerCycleMap = new OpenLayers.Layer.OSM.CycleMap("CycleMap");
			context.cfg.map.object.addLayer(layerCycleMap);
			var layerMapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
			context.cfg.map.object.addLayer(layerMapnik);
			// get the duration of the walk
			context.map.duration(context);
			// get the centre of the map
			context.map.centre(context);
			// centre the map on the coordinates
			context.cfg.map.centre.lonLat = new OpenLayers.LonLat(context.cfg.map.centre.lon, context.cfg.map.centre.lat).transform(new OpenLayers.Projection("EPSG:4326"), context.cfg.map.object.getProjectionObject());
			context.cfg.map.object.setCenter(context.cfg.map.centre.lonLat, context.cfg.zoom);
		};
		this.map.duration = function (context) {
			var time, start, end, points = context.cfg.gpxDOM.getElementsByTagName('trkpt');
			// if the duration placeholder and the time markers exist
			if (context.cfg.duration && points[0].getElementsByTagName('time').length > 0) {
				// get the start time
				time = points[0].getElementsByTagName('time')[0].firstChild.nodeValue;
				start = new Date(time);
				// if the date could not be interpreted
				if (isNaN(start)) {
					// split the string up manually as a fall back
					start = new Date(
						parseInt(time.split('-')[0], 10),
						parseInt(time.split('-')[1], 10) + 1,
						parseInt(time.split('-')[2], 10),
						parseInt(time.split('T')[1], 10),
						parseInt(time.split(':')[1], 10),
						parseInt(time.split(':')[2], 10)
					);
				}
				// get the start time
				time = points[points.length - 1].getElementsByTagName('time')[0].firstChild.nodeValue;
				end = new Date(time);
				// if the date could not be interpreted
				if (isNaN(end)) {
					// split the string up manually as a fall back
					end = new Date(
						parseInt(time.split('-')[0], 10),
						parseInt(time.split('-')[1], 10) + 1,
						parseInt(time.split('-')[2], 10),
						parseInt(time.split('T')[1], 10),
						parseInt(time.split(':')[1], 10),
						parseInt(time.split(':')[2], 10)
					);
				}
				// write the duration to the document
				context.cfg.duration.innerHTML = (!isNaN(start)) ? Math.round((end.getTime() - start.getTime()) / 3600000, 10) + ' hours' : '- hours';
			}
			if (context.cfg.there) {
				context.cfg.there.innerHTML = context.cfg.markers.start.description;
			}
			if (context.cfg.back) {
				context.cfg.back.innerHTML = context.cfg.markers.end.description;
			}
		};
		this.map.centre = function (context) {
			var a, b, points, totLat = 0, totLon = 0;
			context.cfg.map.centre = context.cfg.map.centre || {};
			// for all navigation points
			points = context.cfg.gpxDOM.getElementsByTagName('trkpt');
			for (a = 0 , b = points.length; a < b; a += 1) {
				totLat += parseFloat(points[a].getAttribute('lat'));
				totLon += parseFloat(points[a].getAttribute('lon'));
			}
			// average the centre
			context.cfg.map.centre.lat = totLat / points.length;
			context.cfg.map.centre.lon = totLon / points.length;
		};
		this.route = {};
		// add the Layer with the GPX Track
		this.route.plot = function (context) {
			var lgpx = new OpenLayers.Layer.Vector("route", {
				strategies: [new OpenLayers.Strategy.Fixed()],
				protocol: new OpenLayers.Protocol.HTTP({
					url: context.cfg.gpx,
					format: new OpenLayers.Format.GPX()
				}),
				style: {strokeColor: "blue", strokeWidth: 5, strokeOpacity: 0.5},
				projection: new OpenLayers.Projection("EPSG:4326")
			});
			context.cfg.map.object.addLayer(lgpx);
		};
		this.markers = {};
		// add the Layer with the permanent markers
		this.markers.add = function (context) {
			var marker, size, offset, icon;
			context.cfg.markers.object = new OpenLayers.Layer.Markers("Markers");
			context.cfg.trackPoints = context.cfg.gpxDOM.getElementsByTagName('trkpt');
			// for all markers
			for (marker in context.cfg.markers) {
				if (context.cfg.markers.hasOwnProperty(marker) && marker !== 'object') {
					// special markers
					switch (marker) {
					case 'start' :
						context.cfg.markers[marker].lat = context.cfg.trackPoints[0].getAttribute('lat');
						context.cfg.markers[marker].lon = context.cfg.trackPoints[0].getAttribute('lon');
						break;
					case 'end' :
						context.cfg.markers[marker].lat = context.cfg.trackPoints[context.cfg.trackPoints.length - 1].getAttribute('lat');
						context.cfg.markers[marker].lon = context.cfg.trackPoints[context.cfg.trackPoints.length - 1].getAttribute('lon');
						break;
					}
					// add the marker
					size = new OpenLayers.Size(32, 32);
					offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
					icon = new OpenLayers.Icon(context.cfg.markers[marker].icon, size, offset);
					context.cfg.markers[marker].lonLat = new OpenLayers.LonLat(context.cfg.markers[marker].lon, context.cfg.markers[marker].lat).transform(new OpenLayers.Projection("EPSG:4326"), context.cfg.map.object.getProjectionObject());
					context.cfg.markers[marker].object = new OpenLayers.Marker(context.cfg.markers[marker].lonLat, icon);
					context.markers.click(context.cfg.markers[marker], context);
					context.cfg.markers.object.addMarker(context.cfg.markers[marker].object);
				}
			}
			// add the layer to the map
			context.cfg.map.object.addLayer(context.cfg.markers.object);
		};
		this.markers.click = function (marker, context) {
			marker.object.events.register('mousedown', marker.object, function (evt) {
				context.cfg.balloon.description = marker.description;
				context.cfg.balloon.lon = marker.lon;
				context.cfg.balloon.lat = marker.lat;
				context.balloon.add(context);
				OpenLayers.Event.stop(evt);
			});
		};
		this.indicator = {};
		this.indicator.add = function (context) {
			var size, offset, icon;
			// if the indicator has coordinates
			if (context.cfg.indicator.lon && context.cfg.indicator.lat) {
				// remove the old indicator
				context.indicator.remove(context);
				// add the new indicator
				size = new OpenLayers.Size(32, 32);
				offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
				icon = new OpenLayers.Icon(context.cfg.indicator.icon, size, offset);
				context.cfg.indicator.lonLat = new OpenLayers.LonLat(context.cfg.indicator.lon, context.cfg.indicator.lat).transform(new OpenLayers.Projection("EPSG:4326"), context.cfg.map.object.getProjectionObject());
				context.cfg.indicator.object = new OpenLayers.Marker(context.cfg.indicator.lonLat, icon);
				context.markers.click(context.cfg.indicator, context);
				context.cfg.markers.object.addMarker(context.cfg.indicator.object);
			}
		};
		this.indicator.remove = function (context) {
			// remove the balloon
			context.balloon.remove(context);
			// remove the indicator
			if (context.cfg.indicator.object) {
				context.cfg.markers.object.removeMarker(context.cfg.indicator.object);
				context.cfg.indicator.object.destroy();
				context.cfg.indicator.object = null;
			}
		};
		this.indicator.focus = function (context) {
			// focus the map on the indicator
			context.cfg.map.object.setCenter(context.cfg.indicator.lonLat);
		};
		this.balloon = {};
		this.balloon.add = function (context) {
			// remove the old balloon
			context.balloon.remove(context);
			// add the new popup
			var myLocation = new OpenLayers.Geometry.Point(context.cfg.balloon.lon, context.cfg.balloon.lat).transform('EPSG:4326', 'EPSG:3857');
			var size = new OpenLayers.Size(320, 240);
			context.cfg.balloon.object = new OpenLayers.Popup.FramedCloud(
				"Balloon",
				myLocation.getBounds().getCenterLonLat(),
				size,
				context.cfg.balloon.description,
				null,
				true
			);
			context.cfg.map.object.addPopup(context.cfg.balloon.object);
			context.cfg.balloon.object.show();
		};
		this.balloon.remove = function (context) {
			// remove the balloon
			if (context.cfg.balloon.object) {
				context.cfg.balloon.object.destroy();
				context.cfg.balloon.object = null;
			}
		};
		// public API
		this.indicate = function (source, description) {
			this.cfg.indicator.description = description;
			this.exif.load(source, this);
		};
		// go
		this.start();
	};

}(window.useful = window.useful || {}));
