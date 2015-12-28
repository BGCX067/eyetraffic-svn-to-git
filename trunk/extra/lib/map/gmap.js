var map, places = {};
//var lastmarker, gtimes = {},  routemarkers = [], mylocation = false;
var dirnRoadClick, dirnRoadDrag;

var initialLocation;
var browserSupportFlag = new Boolean();

function addControls(text, title, fn){
    addControl('Home', 'Locate me', function(){
        locateme();
    }, google.maps.ControlPosition.TOP_LEFT);
    addControl('Luxembourg', 'Luxembourg', function(){
        locate('lux');
    }, google.maps.ControlPosition.TOP_LEFT);
    addControl('Destination', 'Destination', function(){
    
    }, google.maps.ControlPosition.TOP_LEFT, '#location', 'destination');
    addControl('Direction', 'Direction', function(){
    
    }, google.maps.ControlPosition.TOP_LEFT, '#route', 'route');
    
    addControl('Small', 'Small', function(){
        setSize(0);
    }, google.maps.ControlPosition.LEFT_BOTTOM);
    addControl('Medium', 'Medium', function(){
        setSize(1);
    }, google.maps.ControlPosition.LEFT_BOTTOM);
    addControl('Large', 'Large', function(){
        setSize(2);
    }, google.maps.ControlPosition.LEFT_BOTTOM);
    
    $.each(FILTERS, function(id, o){
        //html.push('<span>' + o.label + ': <input type="checkbox" id="cat_' + id + '" /></span>');
        addControl(o.label, o.label, function(status){
            if (o.fn) {
                o.fn(this, id, status);
            } else {
                selcat(this, id, status);
            }
        }, google.maps.ControlPosition.BOTTOM_CENTER);
    });
}
function addControl(text, title, fn, position, menu, id){
	var elmenu, c = $('<div class="gm-container gm-pos-' + position + '"></div>');
	if (id){
		c[0].id='ctn-'+id;
	}
    var m = $('<div class="gm-control" title="' + title + '"></div>');
    m.append('<label style="vertical-align: middle; cursor: pointer; ">' + text + '</label>');
    c.append(m);
    if (menu) {
        elmenu = $('<div class="gm-menu"></div>');
        elmenu.hide();
        elmenu.append($(menu));
        c.append(elmenu);
    }
    google.maps.event.addDomListener(m[0], 'click', function(e){
        var b = !$(this).hasClass('gm-selected');
        if (b) {
            $('.gm-pos-' + position + ' .gm-control').removeClass('gm-selected');
            $('.gm-pos-' + position + ' .gm-menu').hide();
            $(this).addClass('gm-selected');
        } else {
            //disable
            $(this).removeClass('gm-selected');
        }
        if (menu) {
            elmenu.toggle(b);
        }
        fn(b);
    });
    map.controls[position || google.maps.ControlPosition.BOTTOM_CENTER].push(c[0]);
}

function initialize(){
    places.lux = new google.maps.LatLng(49.62672481765915, 6.24847412109375);
    
    var myOptions = {
        zoom: 10,
        center: places.lux,
        panControl: true,
        zoomControl: true,
        scaleControl: true,
        scaleControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        streetViewControl: false,
        mapTypeControl: true,
        mapTypeControlOptions: {
            //style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    
    addControls();
    
    /*
     dirnRoadClick = new GDirections();
     dirnRoadDrag = new GDirections();
     //click put marker on the road
     google.maps.event.addListener(dirnRoadClick, "load", function(){
     var n = dirnRoadClick.getPolyline().getVertexCount();
     var p = dirnRoadClick.getPolyline().getVertex(n - 1);
     addMarker(p, ETF.CAT_ROUTE);
     if (options.drawDirection && routemarkers.length > 0) {
     map.addOverlay(dirnRoadClick.getPolyline());
     }
     updateMarkers();
     });
     //drag move marker on the road
     google.maps.event.addListener(dirnRoadDrag, "load", function(){
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
     google.maps.event.addListener(marker, "dragend", function(point){
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
     google.maps.event.addListener(map, "click", function(overlay, point, overlaylatlng){
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
     */
}

function detectBrowser(){
    var useragent = navigator.userAgent;
    var mapdiv = document.getElementById("map_canvas");
    
    if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1) {
        mapdiv.style.width = '100%';
        mapdiv.style.height = '100%';
    } else {
        mapdiv.style.width = '600px';
        mapdiv.style.height = '800px';
    }
}
var singleTip = null, anchorTip = false;
function closewindow(){
    if (singleTip) {
        singleTip.close();
    }
}
function createMarker(point, data, category, options){
    var p;
    if (point && point.lat && typeof point.lat !== 'function') {
        p = new google.maps.LatLng(point.lat, point.lng);
    } else {
        p = point;
    }
    var opt = options || {};
    if (typeof opt === 'function') {
        opt = opt(point, data, category);
    }
    opt = $.extend(opt, {
        position: p,
        title: '',
        map: map,
        draggable: true
    });
    var marker = new google.maps.Marker(opt);
    marker.data = data;
    var html = '';
	if (category) {
		marker.category = category;
		html = getHtml(marker, category);
	}else{
		html = opt.html;
	}
    if (html) {
        function openwindowp(){
            if (marker.tip && marker.tip.getVisible()) {
                marker.tip.close();
            } else {
                openwindow(true);
            }
        }
        function openwindow(anchor){
            anchorTip = anchor;
            if (!marker.tip) {
                var otip = options.tip || {};
                marker.tip = new google.maps.InfoWindow($.extend(otip, {
                    html: html
                }));
            }
            //marker.tip.setContent(html);
            marker.tip.open(map, marker);
            singleTip = marker.tip;
        }
        function opensinglewindow(){
            if (!singleTip) {
                singleTip = new google.maps.InfoWindow();
            }
            singleTip.setContent(html);
            singleTip.open(map, marker);
            //maxWidth: 200
        }
        
        var b = opt.windowbehavior || 'auto';
        if (b == 'click') {
            google.maps.event.addListener(marker, "click", openwindow);
            google.maps.event.addListener(map, 'click', closewindow);
        } else if (b == 'mouseover') {
            google.maps.event.addListener(marker, 'mouseover', opensinglewindow);
            google.maps.event.addListener(marker, 'mouseout', closewindow);
            google.maps.event.addListener(map, 'click', closewindow);
        } else {
            google.maps.event.addListener(marker, "click", openwindowp);
            google.maps.event.addListener(marker, 'mouseover', opensinglewindow);
            google.maps.event.addListener(marker, 'mouseout', closewindow);
        }
    }
	if (category){
	    //map.addOverlay(marker);
	    gmarkers[category] = gmarkers[category] || [];
	    gmarkers[category].push(marker);
	}
    return marker;
}

function drawPolyline(from, to, color, weight, opacity){
    var path = [new google.maps.LatLng(from.lat, from.lng), new google.maps.LatLng(to.lat, to.lng)];
    return new google.maps.Polyline({
        map: map,
        path: path,
        strokeColor: COLORS_STATUS[color] || COLORS_STATUS[5],
        strokeWeight: weight || 6,
        strokeOpacity: opacity || 0.5
    });
}
var myPosMarker;
function centerMap(location, optMarker){
    if (optMarker) {
        if (!myPosMarker) {
			var opt = optMarker;
			if (typeof opt !== 'object') {
				opt = {};
			}
			myPosMarker = createMarker(location, false, false, opt);
		} else {
			myPosMarker.setPosition(location);
			//TOOD: tip is lazy created !!! 
			if (optMarker && optMarker.html && myPosMarker.tip) {
				myPosMarker.tip.setContent(optMarker.html);
			}
        }
    }
    centerMap(location);
}