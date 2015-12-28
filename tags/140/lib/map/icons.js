function getIconBlue(){
    return getIcon("http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png");
}

function getIconPause(){
   return getIcon("http://www.google.com/intl/en_ALL/mapfiles/icon-dd-pause-trans.png");
}

function getIconStart(){
    return getIcon("http://www.google.com/intl/en_ALL/mapfiles/icon-dd-play-trans.png");
}

function getIconEnd(){
    return getIcon("http://www.google.com/intl/en_ALL/mapfiles/icon-dd-stop-trans.png");
}

function getIconA(){
   return getIcon("http://maps.gstatic.com/intl/en_us/mapfiles/kml/paddle/go.png");
}

function getIconB(){
    return getIcon("http://maps.gstatic.com/intl/en_us/mapfiles/kml/paddle/stop.png");
}

function getIconWhite(){
    return getIcon({
			url: "http://labs.google.com/ridefinder/images/mm_20_white.png",
			width:12, 
			height:20,
			anchor:{x:6,y:20}
		}, { 
			url:"http://labs.google.com/ridefinder/images/mm_20_shadow.png",
			width:22, 
			height:20,
			anchor:{x:6,y:20}
	});
}

function getIconCafe(){
        return getIcon({
			url: "http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe|996600",
			width:12, 
			height:20,
			anchor:{x:6,y:20}
		}, { 
			url:"http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
			width:22, 
			height:20,
			anchor:{x:6,y:20}
	});
}


function getIconRed(){
    return getIcon({
			url: "http://labs.google.com/ridefinder/images/mm_20_red.png",
			width:12, 
			height:20,
			anchor:{x:6,y:20}
		},{ 
			url:"http://labs.google.com/ridefinder/images/mm_20_shadow.png",
			width:22, 
			height:20,
			anchor:{x:6,y:20}
	});
}

function getIconBlueTiny(){
    return getIcon( {
			url: "http://labs.google.com/ridefinder/images/mm_20_blue.png",
			width:12, 
			height:20,
			anchor:{x:6,y:20}
		},{ 
			url:"http://labs.google.com/ridefinder/images/mm_20_shadow.png",
			width:22, 
			height:20,
			anchor:{x:6,y:20}
	});
    //icon.infoWindowAnchor = new GPoint(5, 1);
}

function getIcon(image, shadow, coords ){
    //http://code.google.com/apis/maps/documentation/javascript/examples/icon-complex.html
	//image : url, size, origin, anchor
	//shadow : url, size, origin, anchor

	var o = {};
	if (typeof image === 'string') {
		o.icon= image;
	}else{
		image.origin = image.origin || {};
		image.anchor = image.anchor || {};
		o.icon = new google.maps.MarkerImage(image.url, 
		new google.maps.Size(image.width, image.height), 
		new google.maps.Point(image.origin.x || 0, image.origin.y || 0), 
		new google.maps.Point(image.anchor.x || 0, image.anchor.y || image.height || 0)
		);
	}
    if (shadow) {
		shadow.origin=shadow.origin||{};
		shadow.anchor=shadow.anchor||{};
		o.shadow = new google.maps.MarkerImage(shadow.url,
			new google.maps.Size(shadow.width, shadow.height), 
			new google.maps.Point(shadow.origin.x||0, shadow.origin.y||0), 
			new google.maps.Point(shadow.anchor.x||0, shadow.anchor.y||shadow.height||0));
	}
    if (coords) {
		o.shape = {
			coord: coords, //[1, 1, 1, 20, 18, 20, 18, 1]
			type: 'poly'
		};
	}
    return o;
}

