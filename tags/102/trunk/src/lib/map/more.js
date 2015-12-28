var timer;
var chosen = [];
 
/* Array of GLayers
 * The 'name' property is not being used here
*/
var layers = [
 { name: "Pano", obj: new GLayer("com.panoramio.all") },
 { name: "Tube", obj: new GLayer("com.youtube.all") },
 { name: "Wiki", obj: new GLayer("org.wikipedia.en") },
 { name: "Cams", obj: new GLayer("com.google.webcams") }
];
 
 
function hideAll(){
    var boxes = document.getElementsByName("mark");
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) {
            boxes[i].checked = false;
            switchLayer(false, layers[i].obj);
            chosen.push(i);
        }
    }
}

function checkChecked(){
    /* Returns true if a checkbox is still checked
     *  otherwise false
     */
    var boxes = document.getElementsByName("mark");
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) return true;
    }
    return false;
}

function switchLayer(checked, layer){
    /* Function was originally borrowed from Esa:
     *  http://esa.ilmari.googlepages.com/dropdownmenu.htm
     */
    var layerbox = document.getElementById("box");
    var boxlink = document.getElementById("boxlink");
    var button = document.getElementById("more_inner");
    if (checked) {
        map.addOverlay(layer);
        // Reset chosen array
        chosen.length = 0;
        /* Highlight the link and
         *  make the button font bold.
         */
        boxlink.className = "highlight";
        layerbox.className = "highlight";
        button.className = "highlight";
    } else {
        map.removeOverlay(layer);
        /*  Reset the link and the button
         * if all checkboxes were unchecked.
         */
        if (!checkChecked()) {
            boxlink.blur();
            boxlink.className = "";
            layerbox.className = "";
            button.className = "";
        }
    }
}

function showLayerbox(){
    if (window.timer) {
		clearTimeout(timer);
	}
    document.getElementById("box").style.display = "block";
    var button = document.getElementById("more_inner");
    button.style.borderBottomWidth = "4px";
    button.style.borderBottomColor = "white";
}

function setClose(){
    var layerbox = document.getElementById("box");
    var button = document.getElementById("more_inner");
    var bottomColor = checkChecked() ? "#6495ed" : "#c0c0c0";
    timer = window.setTimeout(function(){
        layerbox.style.display = "none";
        button.style.borderBottomWidth = "1px";
        button.style.borderBottomColor = bottomColor;
    }, 400);
}

function toggleLayers(){
    if (chosen.length > 0) {
        /* Make an independent copy of chosen array since switchLayer()
         *  resets the chosen array, which may not be useful here.
         */
        var copy = chosen.slice();
        for (var i = 0; i < copy.length; i++) {
            var index = parseInt(copy[i],10);
            switchLayer(true, layers[index].obj);
            document.getElementsByName("mark")[index].checked = true;
        }
    } else {
        hideAll();
    }
}

function MoreControl(){
	//
}
MoreControl.prototype = new GControl();
MoreControl.prototype.initialize = function(map){
    var more = document.getElementById("outer_more");
    var buttonDiv = document.createElement("div");
    buttonDiv.id = "morebutton";
    buttonDiv.title = "Show/Hide Layers";
    buttonDiv.style.border = "1px solid black";
    buttonDiv.style.width = "86px";
    var textDiv = document.createElement("div");
    textDiv.id = "more_inner";
    textDiv.appendChild(document.createTextNode("More..."));
    buttonDiv.appendChild(textDiv);
    // Register Event handlers
    more.onmouseover = showLayerbox;
    more.onmouseout = setClose;
    buttonDiv.onclick = toggleLayers;
    // Insert the button just after outer_more div
    more.insertBefore(buttonDiv, document.getElementById("box").parentNode);
    // Remove the whole div from its location and reinsert it to the map
    map.getContainer().appendChild(more);
    return more;
};
MoreControl.prototype.getDefaultPosition = function(){
    return new GControlPosition(G_ANCHOR_TOP_LEFT, new GSize(278, 7));
};
