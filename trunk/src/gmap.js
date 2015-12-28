(function( $ ) {
function initGmap(){
    if (google.maps){
    	
    	var mapTypeIds = [];
		for(var type in google.maps.MapTypeId) {
			mapTypeIds.push(google.maps.MapTypeId[type]);
		}
		mapTypeIds.push("RTL");
		
	    var map = new google.maps.Map(document.getElementById("gmap"), {
			zoom: 11,
			center: new google.maps.LatLng(49.56, 6.130),//Lux
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			streetViewControl: false,
			mapTypeControlOptions : {
				mapTypeIds : mapTypeIds
			}
	    });
	   
	    var trafficLayer = new google.maps.TrafficLayer();
	    trafficLayer.setMap(map);
	    
	    var maxis={
	    	1:{x:2,y:3, ox:940, oy:579},
	    	2:{x:5,y:7, ox:1880, oy:1158},
	    	4:{x:11,y:15, ox:7526, oy:4645}
	    };
	    map.mapTypes.set("RTL", new google.maps.ImageMapType({
			getTileUrl : function(coord, zoom) {
				var url=null, z=zoom-10, mm=maxis[z];
				if (mm){
					//http://images.newmedia.lu/trafic_map/tiles/4x/complete2_4x_6_12.png
					var x = Math.round(coord.x-mm.ox), y= Math.round(coord.y-mm.oy);
					//1x_2_3  
					//2x_5_7
					//4x_11_15
					if (x>=0 && x<=mm.x && y>=0 && y<=mm.y){
						var r = Math.round(Math.random()*10000)+1;
						url = "http://images.newmedia.lu/trafic_map/tiles/" + z + "x/complete2_"+z+"x_" + x + "_" + y + ".png?r="+r;
					}
				}
				return url;
			},
			//tileSize : new google.maps.Size(256, 256),
			tileSize : new google.maps.Size(288, 307),
			name : "RTL Traffic",
			minZoom: 11,
			maxZoom: 14
		}));
    }
}

$(function() {
  initGmap();
});
})( jQuery );