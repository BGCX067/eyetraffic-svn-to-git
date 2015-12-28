//resize map : http://www.wolfpil.de/map-in-a-box.html

// http://www.birdtheme.org/useful/googletool.html
// http://code.google.com/apis/maps/documentation/utilities/polylineutility.html

var img_path = "images/map/";
var polyShape;
var polyLineColor = "#3355ff";
var polyFillColor = "#335599";
var polyPoints = [];
var markers = [];
var report = document.getElementById("status");
function loadMap(){
    map.disableDoubleClickZoom();
    GEvent.addListener(map, "click", leftClick);
}

function addIcon(icon){ // Add icon properties
    icon.iconSize = new GSize(11, 11);
    icon.dragCrossSize = new GSize(0, 0);
    icon.shadowSize = new GSize(11, 11);
    icon.iconAnchor = new GPoint(5, 5);
    icon.maxHeight = 0;
}

function leftClick(overlay, point){
    if (point) {
        // Square marker icons
        var square = new GIcon();
        square.image = img_path+"square.png";
        addIcon(square);
        // Make markers draggable
        var marker = new GMarker(point, {
            icon: square,
            draggable: true,
            bouncy: false,
            dragCrossMove: true
        });
        markers.push(marker);
        map.addOverlay(marker);
        GEvent.addListener(marker, "drag", function(){
            drawPoly();
        });
        GEvent.addListener(marker, "mouseover", function(){
            marker.setImage(img_path+"m-over-square.png");
        });
        GEvent.addListener(marker, "mouseout", function(){
            marker.setImage(img_path+"square.png");
        });
        // Second click listener to remove the square
        GEvent.addListener(marker, "click", function(){
            // Find out which square to remove
            for (var n = 0; n < markers.length; n++) {
                if (markers[n] == marker) {
                    map.removeOverlay(markers[n]);
                    break;
                }
            }
            markers.splice(n, 1);
            drawPoly();
        });
        drawPoly();
    }
}

function drawPoly(){
    if (polyShape) {
		map.removeOverlay(polyShape);
	}
    polyPoints.length = 0;
    for (i = 0; i < markers.length; i++) {
        polyPoints.push(markers[i].getLatLng());
    }
    // Close the shape with the last line or not
    // polyPoints.push(markers[0].getLatLng());
    polyShape = new GPolygon(polyPoints, polyLineColor, 3, 0.8, polyFillColor, 0.3);
    var unit = " km&sup2;";
    var area = polyShape.getArea() / (1000 * 1000);
    if (markers.length <= 2) {
        report.innerHTML = "&nbsp;";
    } else if (markers.length > 2) {
        report.innerHTML = area.toFixed(3) + unit;
    }
    map.addOverlay(polyShape);
}

function zoomToPoly(){
    if (polyShape && polyPoints.length > 0) {
        var bounds = polyShape.getBounds();
        map.setCenter(bounds.getCenter());
        map.setZoom(map.getBoundsZoomLevel(bounds));
    }
}

function clearPoly(){
    // Remove polygon and reset arrays
    map.clearOverlays();
    polyPoints.length = 0;
    markers.length = 0;
    report.innerHTML = "&nbsp;";
}
