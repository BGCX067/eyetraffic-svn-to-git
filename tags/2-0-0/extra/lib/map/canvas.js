// ===== Check to see if this browser supports <canvas> ===
// == load the image ==
var img = new Image();
img.src = "images/car.png";
var angle = Math.PI / 2; // == <canvas> uses radians, not degrees

function rotatecar(){
    var cosa = Math.cos(angle);
    var sina = Math.sin(angle);
    canvas.clearRect(0, 0, 32, 32); // clear the canvas
    canvas.save(); // save the canvas state
    canvas.rotate(angle); // rotate the canvas
    canvas.translate(16 * sina + 16 * cosa, 16 * cosa - 16 * sina); // translate the canvas 16,16 in the rotated axes
    canvas.drawImage(img, -16, -16); // plot the car
    canvas.restore(); // restore the canvas state, to undo the rotate and translate
    angle += 0.1;
}

function addOverlayCanvas(map){
    var supportsCanvas = (document.getElementById('mycanvas').getContext);
	// == Check if the browser supports <canvas> and if so create a <canvas> inside an ELabel ==
    if (supportsCanvas) {
        label = new ELabel(map.getCenter(), '<canvas id="carcanvas" width="32" height="32"><\/canvas>', null, new GSize(-16, 16));
        map.addOverlay(label);
        canvas = document.getElementById("carcanvas").getContext('2d');
        angle = Math.PI / 2;
        setInterval(rotatecar, 100);
    } else {
        // == If the browser doesn't support <canvas> do something else ==
        map.addOverlay(new GMarker(map.getCenter()));
    }
}
