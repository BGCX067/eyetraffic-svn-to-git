//http://mapsapi.googlepages.com/reversegeo.htm
function geocode(query, pin_){
    geo.getLocations(query, function(addresses){
        if (addresses.Status.code != 200) {
            alert("D'oh!\n " + query);
        } else {
            //marker = pin_||createMarker();
            var result = addresses.Placemark[0];
            var mylocation = {
                lat: result.Point.coordinates[1],
                lng: result.Point.coordinates[0],
                address: result.address,
                details: result.AddressDetails || {},
                howMany: addresses.Placemark.length
            };
            mylocation.accuracy = mylocation.details.Accuracy || 0;
            var point = new GLatLng(mylocation.lat, mylocation.lng);
            var markerOptions = {
                icon: getIconA()
            };
            //createMarker(point, mylocation, ETF.CAT_POSITION , markerOptions);
            marker.setLatLng(point);
            if (marker.poly) {
                map.removeOverlay(marker.poly);
            }
            marker.poly = new GPolyline([query, point], "#ff0000", 2, 1);
            map.addOverlay(marker.poly);
            marker.index = markers.length;
            markers.push(marker);
            if (!pin_) {
                map.setCenter(responsePoint);
                map.setZoom(marker.accuracy * 2 + 3);
            }
            if (result.address) {
                doInfo(marker);
            }
        }
    });
}

/**
 * creates and opens an info window
 * @param GMarker
 */
function doInfo(marker_){
    var pin = marker_;
    var iwContents = pin.response.replace(/,/g, ",<br/>");
    iwContents += "<div class='small'>" + pin.getLatLng().toUrlValue();
    iwContents += "<br/>Accuracy: " + pin.accuracy;
    if (pin.howMany > 1) {
        iwContents += "<br/>" + pin.howMany;
    }
    iwContents += "</div>";
    iwContents += "<a href='javascript:memo(markers[" + pin.index + "])'>Copy to memo area</a>";
    pin.bindInfoWindowHtml(iwContents);
    map.openInfoWindowHtml(pin.getLatLng(), iwContents);
}

function getCurrentLocation(hidden){
    if (google.loader.ClientLocation) {
        var cl = google.loader.ClientLocation;
        //location = [cl.address.city, cl.address.region, cl.address.country].join(', ');
        mylocation = {
            lat: cl.latitude,
            lng: cl.longitude
        };
        var point = new GLatLng(mylocation.lat, mylocation.lng);
        var markerOptions = {
            icon: getIconBlue()
        };
        var marker = createMarker(point, mylocation, ETF.CAT_POSITION, markerOptions);
        if (hidden) {
            marker.hide();
        } else {
            map.setCenter(point, 10);
        }
    }
}
