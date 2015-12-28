var ETF={
	CAT_ROUTE:'route',
	CAT_CAMS:'cams',
	CAT_TIMES:'times',
	CAT_POSITION:'position'
};

ETF.tpl = {
	cams:'<div class="tipcam"><a href="javascript:centeretzoom({lat},{lng})">'+
'<img src="http://www2.pch.etat.lu/info_trafic/cameras/images/cccam_{cam}.jpg" height="80" width="120"/></a><br/>'+
'<div class="titrepopup2">{titre}</div><div class="localitepopup2">{localite}</div></div>',
	timesAll:'<table border="0" cellpadding="0" cellspacing="0"><tr><td width="100%" class="EWTitle" nowrap>{title}<\/td><\/tr><tr><td nowrap>{content}<\/td><\/tr><\/table>',
	times:'<span>{to}</span><span>{duration}</span><br/>',
	route:'',
	position:'This is my position : {lat},{lng}'
};

var geocoder;
function searchMap(){
    var addressSource = document.getElementById("addressSource").value;
    if (geocoder) {
        geocoder.getLatLng(addressSource, function(point){
            if (point) {
                map.setCenter(point, 13);
                var marker = new GMarker(point);
                map.addOverlay(marker);
                marker.openInfoWindowHtml(addressSource);
            }
        });
    }
}

function saveLocation(){
    var point = map.getCenter();
    setCookie();
}

function resetLocation(){
    if (mylocation) {
        var point = new GLatLng(mylocation.lat, mylocation.lng);
        map.setCenter(point);
    }
}

function showRoute(showLoc){
    jQuery('#location').toggle(showLoc);
    jQuery('#route').toggle(!showLoc);
}

function showLocation(){
    showRoute(true);
}

var sizes = [{
    w: 400,
    h: 335
}, {
    w: 490,
    h: 445
}, {
    w: 700,
    h: 505
}, {
    w: 1000,
    h: 870
}];
function setSize(size){
    var m = sizes[size];
    if (m) {
        jQuery("#map_canvas").width(m.w).height(m.h);
        //jQuery("#wrapper").width(m.w).height(m.h);
    }
}

var dirnRoute;
//route with geocoding
function getRoute(){
    if (!dirnRoute) {
        dirnRoute = new GDirections();
    }
    dirnRoute.clear();
    //, jQuery("#left")[0]
    dirnRoute = new GDirections(map);
    GEvent.addListener(dirnRoute, "error", function(){
        console.log('error');
    });
    GEvent.addListener(dirnRoute, "load", function(){
        var d = dirnRoute.getDuration();
        console.log(d.html);
    });
    var source = jQuery("#routeA").val();
    var destination = jQuery("#routeB").val();
    dirnRoute.load("from: " + source + " to: " + destination);
}

function clearRoute(){
    if (dirnRoute) {
        dirnRoute.clear();
    }
}

function selcat(box, category){
    if (box.checked) {
        showcat(category);
    } else {
        hidecat(category);
    }
    // == rebuild the side bar
    makeSidebar();
}


function getHtmlTimes(marker, category, location){
	var content='';
	jQuery.each(timeMappings, function(id, o){
		if (o.from === location){
			content += fillTpl(ETF.tpl.times, o);
		} 
	});
	var html = fillTpl(ETF.tpl.timesAll, {title:location, content:content});
	return html;
}
function getHtml(marker, category){
	var html = '';
	if (category === ETF.CAT_TIMES) {
		html = getHtmlTimes(marker, category, marker.data.location);
	} else {
		html = fillTpl(ETF.tpl[category || marker.category] || '', marker.data);
	}
	return html;
}
function updateHtml(marker){
    marker.bindInfoWindowHtml(getHtml(marker));
}
function updateTime(marker){
    if (marker.data) {
		marker.duration = gtimes[marker.data.location] || '';
	}
}

var ewindows=[];
function addOverlayWindows(){
	var ewindow = new EWindow(map, E_STYLE_7, 'lib/map/ewindow/');
	map.addOverlay(ewindow);
	ewindows.push(ewindow);
	return ewindow;
}

var elprev={};
function overwindow(event){
	var category=event.data.category;
	if (elprev[category]){
		elprev[category].css('z-index','auto');
	}
	var el = jQuery(this);
	el.css('z-index',9999);
	elprev[category]=el;
}
function showcat(category){
	jQuery(gmarkers).each(function(i, marker){
        if (marker.category === category) {
            marker.show();
			updateTime(marker);
			marker.ewindow=addOverlayWindows();
			jQuery(marker.ewindow.div1).bind('mouseover', {category: category}, overwindow);
			var html = getHtml(marker, category);
            marker.ewindow.openOnMarker(marker, html);
        }
    });
    document.getElementById('cat_' + category).checked = true;
}

function hidecat(category){
    jQuery(gmarkers).each(function(i, marker){
        if (marker.category === category) {
            marker.hide();
			if (marker.ewindow) {
				marker.ewindow.hide();
			}
        }
    });
    document.getElementById('cat_' + category).checked = false;
    // == close the info window, in case its open on a marker that we just hid
    map.closeInfoWindow();
}

function makeSidebar(){
    var el = jQuery('#sidebar_cats');
    el.html('');
    jQuery.each(timeMappings, function(id, o){
        jQuery('<a id="' + id + '" href="#">' + o.text + '</a>').click(function(){
            renderRoute(id, o);
            el.find('.selected').each(function(){
                if (routes[this.id]) {
                    routes[this.id].clear();
                    delete routes[this.id];
                }
                jQuery(this).removeClass('selected');
            });
            jQuery(this).addClass('selected');
        }).appendTo(el).after('<br>');
    });
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
    var source = timesCoords[o.from];
    //var ms = createMarker(source, source.name, 'times2', {icon:getIconStart()});
    var psource = new GLatLng(source.lat, source.lng);
    var destination = timesCoords[o.to];
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
        getPolyline: true
        ,preserveViewport: true //false to zoom centered
    });
    //Geocoding					
    //route.load("from: " + source + " to: " + destination);
}
