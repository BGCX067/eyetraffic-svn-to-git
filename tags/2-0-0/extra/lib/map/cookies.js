var cookiename = "mapinfo"; // name for this cookie
var expiredays = 7; // number of days before cookie expiry

function getCookie(){
    // === Default values to use if there is no cookie ===
    var lat = 0;
    var lng = 0;
    var zoom = 1;
    var maptype = 0;    
    // === Look for the cookie ===
    if (document.cookie.length > 0) {
        cookieStart = document.cookie.indexOf(cookiename + "=");
        if (cookieStart != -1) {
            cookieStart += cookiename.length + 1;
            cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookietext = document.cookie.substring(cookieStart, cookieEnd);
            // == split the cookie text and create the variables ==
            bits = cookietext.split("|");
            return {
                lat: parseFloat(bits[0]),
                lng: parseFloat(bits[1]),
                zoom: parseInt(bits[2]),
                maptype: parseInt(bits[3])
            }
        }
    }
	return false;
}

// === Set the cookie before exiting ===
function setCookie(){
    maptype = 0;
    for (var i = 0; i < map.getMapTypes().length; i++) {
        if (map.getCurrentMapType() == map.getMapTypes()[i]) {
            maptype = i;
        }
    }
    var cookietext = cookiename + "=" + map.getCenter().lat() + "|" + map.getCenter().lng() + "|" + map.getZoom() + "|" + maptype;
	console.log(cookietext);
    if (expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        cookietext += ";expires=" + exdate.toGMTString();
    }
    // == write the cookie ==
    document.cookie = cookietext;
}
