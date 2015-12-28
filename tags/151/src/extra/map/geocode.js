var geocoder = new google.maps.Geocoder();
function locate(place, optMarker){
    if (place) {
		if ((typeof place == 'string') && places[place]) {
            centerMap(places[place], optMarker);
        }else{
			centerMap(place, optMarker);
		}
    } else {
        locateme(optMarker);
    }
}

function locateme(addMarker){
    // Try W3C Geolocation (Preferred)
    if (navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position){
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            centerMap(initialLocation, addMarker);
        }, function(){
            handleNoGeolocation(browserSupportFlag);
        });
        // Try Google Gears Geolocation
    } else if (google.gears) {
        browserSupportFlag = true;
        var geo = google.gears.factory.create('beta.geolocation');
        geo.getCurrentPosition(function(position){
            initialLocation = new google.maps.LatLng(position.latitude, position.longitude);
            centerMap(initialLocation, addMarker);
        }, function(){
            handleNoGeoLocation(browserSupportFlag);
        });
        // Browser doesn't support Geolocation
    } else {
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }
    
    function handleNoGeolocation(errorFlag){
        if (errorFlag === true) {
            alert("Geolocation service failed.");
            initialLocation = newyork;
        } else {
            alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
            initialLocation = siberia;
        }
        centerMap(initialLocation, addMarker);
    }
}
function getAddress(pos, cb){
    geocoder.geocode({
        latLng: pos
    }, function(responses){
        if (responses && responses.length > 0) {
            cb(responses[0].formatted_address, responses[0]);
        }
    });
}

function getPosition(address, cb){
    geocoder.geocode({
        'address': address
    }, function(results, status){
        var pt = false;
        if (status == google.maps.GeocoderStatus.OK) {
            pt = results[0].geometry.location;
        }
        cb(pt);
    });
}
