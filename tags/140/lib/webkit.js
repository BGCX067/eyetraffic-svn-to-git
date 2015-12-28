function Notifier(){
}

// Request permission for this page to send notifications. If allowed,
// calls function "cb" with "true" as the first argument.
Notifier.prototype.requestPermission = function(cb){
    window.webkitNotifications.requestPermission(function(){
        if (cb) {
            cb(window.webkitNotifications.checkPermission() === 0);
        }
    });
};

// Popup a notification with icon, title, and body. Returns false if
// permission was not granted.
Notifier.prototype.notify = function(icon, title, body, timeout){
    if (window.webkitNotifications.checkPermission() === 0) {
        console.log('createNotification');
		var popup = window.webkitNotifications.createNotification(icon, title, body);
		/*popup.ondisplay = function() { 
			window.setTimeout(function(){
				popup.close();
			},timeout||5000);
		};*/
    	//popup.onclose = function() {  };
        popup.show();
        return true;
    }
    return false;
};

function Geolocation(){
}
Geolocation.prototype.getCurrentPosition = function(){
	var geo = google.gears.factory.create('beta.geolocation');
	function updatePosition(position){
		alert('Current lat/lon is: ' + position.latitude + ',' + position.longitude);
	}
	function handleError(positionError){
		alert('Attempt to get location failed: ' + positionError.message);
	}
	geo.getCurrentPosition(updatePosition, handleError);
}