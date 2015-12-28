var map, lastmarker, gtimes = {}, gmarkers = [], routemarkers = [], mylocation = false;
var options = {
    nearRoad: true,
    drawDirection: true,
    showcontrols: false,
    memo: false
};

function initialize(){
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
        var dirnRoadClick = new GDirections();
        var dirnRoadDrag = new GDirections();
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
        renderMarkersCams();
        renderMarkersTimes();
		
		makeSidebar();
		//showcat('times');
        //setSize(2);
        //showLocation();
        getCurrentLocation(true);
				
    }
}

function renderMarkersCams(){
    var markerOptions = {
        icon: getIconRed()
    };
    renderMarkers(data_cams, ETF.CAT_CAMS, markerOptions);
    /*getJSON('data/cams.json', function(json){
     renderMarkers(json);
     });*/
}

function renderMarkersTimes(){
    var data_times = {
        markers: []
    };
    jQuery.each(timesCoords, function(i, data){
        var o = {
            location: i
        };
        jQuery.extend(o, data);
        data_times.markers.push(o);
    });
    var markerOptions = {
        icon: getIconPause()
    };
    renderMarkers(data_times, ETF.CAT_TIMES, markerOptions);
}

function renderMarkers(json, category, options){
    jQuery(json.markers).each(function(i, marker){
        createMarker(marker, marker, category, options);
    });
    jQuery(json.lines).each(function(i, line){
        var pts = [];
        for (var j = 0; j < line.points.length; j++) {
            pts[j] = new GLatLng(line.points[j].lat, line.points[j].lng);
        }
        map.addOverlay(new GPolyline(pts, line.colour, line.width));
    });
}



function getJSON(url, cb){
    GDownloadUrl(url, cb);
    /*
     var p = 'file:///C:/Documents%20and%20Settings/Valente/My%20Documents/Aptana%20Studio%20Workspace/EyeTraffic/src/';
     p = '';
     jQuery.ajax({
     url: p + url,
     success: function(data){
     if (data) {
     var json = JSON.parse(data);
     cb(json);
     }
     }
     });*/
    //$.getJSON(url, cb);
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

function updateMarkers(){
    var o = [];
    jQuery(routemarkers).each(function(i, marker){
        var point = marker.getLatLng();
        o.push({
            i: marker.index + 1,
            lat: point.lat(),
            lng: point.lng(),
            html: marker.html,
            label: marker.getTitle()
        });
    });
    jQuery('#jmarkers').html(JSON.stringify(o));
}

function createMarker(point, data, category, options){
    var p;
    if (point && point.lat && typeof point.lat !=='function') {
        p = new GLatLng(point.lat, point.lng);
    } else {
        p = point;
    }
    var marker = new GMarker(p, options || {});
    marker.category = category;
    marker.data = data;
    var html = getHtml(marker, category);
    function openwindow(){
        marker.openInfoWindowHtml(html, {
            maxWidth: 200
        });
    }
    GEvent.addListener(marker, "click", openwindow);
    //GEvent.addListener(marker, "mouseover", openwindow);
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


function terminate(){
    if (options.memo) {
        setCookie();
    }
    GUnload();
}

window.onunload = terminate;


