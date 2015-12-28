var Direction = {
    dirContainer: false,
    travelModeInput: 'driving', /* 'driving','bicycling','walking' */
    unitInput: 'metric',  /* imperial, metric */
    
    // API Objects
    dirService: new google.maps.DirectionsService(),
    dirRenderer: new google.maps.DirectionsRenderer(),
    map: null,
    
    showDirections: function(dirResult, dirStatus){
        if (dirStatus != google.maps.DirectionsStatus.OK) {
            alert('Directions failed: ' + dirStatus);
            return;
        }
        
        // Show directions
        Direction.dirRenderer.setMap(Direction.map);
		if (Direction.dirContainer) {
			Direction.dirRenderer.setPanel(Direction.dirContainer);
		}
        Direction.dirRenderer.setDirections(dirResult);
    },
    
    getSelectedTravelMode: function(){
        var value = Direction.travelModeInput;
        if (value == 'driving') {
            value = google.maps.DirectionsTravelMode.DRIVING;
        } else if (value == 'bicycling') {
            value = google.maps.DirectionsTravelMode.BICYCLING;
        } else if (value == 'walking') {
            value = google.maps.DirectionsTravelMode.WALKING;
        } else {
            //alert('Unsupported travel mode.');
        }
        return value;
    },
    
    getSelectedUnitSystem: function(){
        return Direction.travelModeInput == 'metric' ? google.maps.DirectionsUnitSystem.METRIC : google.maps.DirectionsUnitSystem.IMPERIAL;
    },
    
    getDirections: function(fromStr, toStr){
        var dirRequest = {
            origin: fromStr,
            destination: toStr,
            travelMode: Direction.getSelectedTravelMode(),
            unitSystem: Direction.getSelectedUnitSystem(),
            provideRouteAlternatives: true
        };
        Direction.dirService.route(dirRequest, Direction.showDirections);
    },
    
    show: function(map, fromStr, toStr, pos, travelMode, unit){
        if (pos) {
			if (pos.lat) {
				pos = new google.maps.LatLng(pos.lat, pos.lng);
			}
			centerMap(pos);
		}
        
		Direction.map = map;
	    Direction.travelModeInput= travelMode||'driving';
	    Direction.unitInput= unit||'metric';
	
        // Show directions onload
        Direction.getDirections(fromStr, toStr);
    }
};
