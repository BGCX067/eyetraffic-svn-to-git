var map, lastmarker, gtimes = {}, gmarkers = [], routemarkers = [], mylocation = false;
var dirnRoadClick, dirnRoadDrag;

function initialize(){
    renderFilter();
    showLocation();
    
    if (GBrowserIsCompatible()) {
        map = new GMap2(document.getElementById("map_canvas"));
        if (options.showcontrols) {
            map.addControl(new GLargeMapControl());
            map.addControl(new GMapTypeControl());
        }
        // Add the self created control
        //map.addControl(new MoreControl());
        map.enableScrollWheelZoom();
        //map.setUIToDefault();
        map.setCenter(new GLatLng(49.62672481765915, 6.24847412109375), 10);//lux
        geocoder = new GClientGeocoder();
        //geocoder = new GClientGeocoder(new GGeocodeCache()); 
        if (options.memo) {
            var c = getCookie();
            if (c) {
                map.setCenter(new GLatLng(c.lat, c.lng), c.zoom, map.getMapTypes()[c.maptype]);
            }
        }
        //addEncodedPloyline();
        //initRect();
        //addOverlayRect(map);
        //addOverlayCanvas(map);
        dirnRoadClick = new GDirections();
        dirnRoadDrag = new GDirections();
        //click put marker on the road
        GEvent.addListener(dirnRoadClick, "load", function(){
            var n = dirnRoadClick.getPolyline().getVertexCount();
            var p = dirnRoadClick.getPolyline().getVertex(n - 1);
            addMarker(p, ETF.CAT_ROUTE);
            if (options.drawDirection && routemarkers.length > 0) {
                map.addOverlay(dirnRoadClick.getPolyline());
            }
            updateMarkers();
        });
        //drag move marker on the road
        GEvent.addListener(dirnRoadDrag, "load", function(){
            var p = dirnRoadDrag.getPolyline().getVertex(0);
            lastmarker.setPoint(p);
            updateHtml(lastmarker);
            updateMarkers();
        });
        function addMarker(point, category){
            var index = routemarkers.length;
            var o = {
                index: index,
                category: category,
                lat: point.lat(),
                lng: point.lng()
            };
            var marker = createMarker(point, o, category, {
                draggable: true,
                icon: getIconCafe()
            });
            marker.index = index;
            routemarkers.push(marker);
            GEvent.addListener(marker, "dragend", function(point){
                lastmarker = marker;
                var p = marker.getPoint();
                if (options.nearRoad) {
                    dirnRoadDrag.loadFromWaypoints([p.toUrlValue(6), p.toUrlValue(6)], {
                        getPolyline: true
                    });
                } else {
                    updateHtml(marker);
                    updateMarkers();
                }
            });
        }
        GEvent.addListener(map, "click", function(overlay, point, overlaylatlng){
            if (overlay) {
                return false;
            }
            if (options.nearRoad) {
                var sp = (routemarkers && routemarkers.length > 0) ? (routemarkers[routemarkers.length - 1].getPoint()) : point.toUrlValue(6);
                dirnRoadClick.loadFromWaypoints([sp, point.toUrlValue(6)], {
                    getPolyline: true
                });
            } else {
                addMarker(point, ETF.CAT_ROUTE);
            }
        });

//        showcat(ETF.CAT_TRAFFIC);
        
        makeSidebar();
        //showcat('times');
        //setSize(2);
        //showLocation();
        //getCurrentLocation(true);
    
    }
}

function findNearest(point, points){
    var n = {};
    jQuery(points).each(function(i, p){
        var d = point.distanceFrom(p);
        if (!np || (np && d < ld)) {
            n = {
                point: p,
                distance: d
            };
        }
    });
    return n;
}

function calculateDistance(){
    var dist = 0;
    for (var i = 0; i < gpolys.length; i++) {
        dist += gpolys[i].Distance();
    }
    return "Path length: " + (dist / 1000).toFixed(2) + " km.<br/>" + (dist / 1609.344).toFixed(2) + " miles.";
}

function logDirection(dirn){
    var poly = false, s = '';
    if (dirn && (poly = dirn.getPolyline())) {
        var n = poly.getVertexCount();
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var p = dirn.getPolyline().getVertex(i);
                console.log(i + '-' + p.x + ',' + p.y);
            }
        }
    }
    return s;
}

function createMarker(point, data, category, options){
	var p;
	if (point && point.lat && typeof point.lat !== 'function') {
		p = new GLatLng(point.lat, point.lng);
	} else {
		p = point;
	}
	var opt = {};
	if (typeof options === 'function') {
		opt = options(point, data, category);
	} else {
		opt = options || {};
	}
	var marker = new GMarker(p, opt);
	marker.category = category;
	marker.data = data;
	var html = getHtml(marker, category);
	if (html) {
		function openwindow(){
			marker.openInfoWindowHtml(html, {
				maxWidth: 200
			});
		}
		GEvent.addListener(marker, "click", openwindow);
		//GEvent.addListener(marker, "mouseover", openwindow);
	}
    map.addOverlay(marker);
    gmarkers.push(marker);
    return marker;
}

function addEncodedPloyline(){
    var encodedPolyline = new GPolyline.fromEncoded({
        color: "#FF0000",
        weight: 10,
        points: "gxqmH_`kd@fEqbAwHcyAuo@g}@csAopAwqBal@k{BsVmb@_wA",
        levels: "BBBBBBBB",
        zoomFactor: 32,
        numLevels: 4
    });
    map.addOverlay(encodedPolyline);
}

function drawPolyline(from, to, color){
    var points = [new GLatLng(from.lat, from.lng), new GLatLng(to.lat, to.lng)];
    //color, weight=3, opacity=0.4
    var polyline = new GPolyline(points, COLORS_STATUS[color] || COLORS_STATUS[5], 10, 0.5);
    map.addOverlay(polyline);
    return polyline;
}

function addOverlayRect(map){
    // Display a rectangle in the center of the map at about a quarter of
    // the size of the main map
    var bounds = map.getBounds();
    var southWest = bounds.getSouthWest();
    var northEast = bounds.getNorthEast();
    var lngDelta = (northEast.lng() - southWest.lng()) / 1;//4
    var latDelta = (northEast.lat() - southWest.lat()) / 1;//4
    var rectBounds = new GLatLngBounds(new GLatLng(southWest.lat() + latDelta, southWest.lng() + lngDelta), new GLatLng(northEast.lat() - latDelta, northEast.lng() - lngDelta));
    map.addOverlay(new Rectangle(rectBounds));
}

var routes = {};
function renderRoute(id, o){
    var route = routes[id];
    if (!route) {
        route = new GDirections(map);
        routes[id] = route;
    }
    route.clear();
    GEvent.addListener(route, "error", function(){
        console.log('error');
    });
    var source = timesCoords[o.from].from;
    //var ms = createMarker(source, source.name, 'times2', {icon:getIconStart()});
    var psource = new GLatLng(source.lat, source.lng);
    var destination = timesCoords[o.to].to;
    var pdest = new GLatLng(destination.lat, destination.lng);
    //var me = createMarker(destination, getHtml(destination), 'times2', {icon:getIconEnd()});
    function getDurationHtml(point, duration){
        return point.name + ' : ' + (duration || '');
    }
    GEvent.addListener(route, "load", function(){
        var d = route.getDuration();
        var ms = route.getMarker(0);
        console.log(ms);
        console.log(d.html);
        ms.bindInfoWindowHtml(getDurationHtml(ms.getPoint(), d.html));
    });
    route.loadFromWaypoints([psource.toUrlValue(6), pdest.toUrlValue(6)], {
        getPolyline: true,
        preserveViewport: true //false to zoom centered
    });
    console.log("from: " + o.from + " to: " + o.to);
    //Geocoding					
    //route.load("from: " + source + " to: " + destination);
}

function terminate(){
    if (options.memo) {
        setCookie();
    }
    GUnload();
}

window.onunload = terminate;


