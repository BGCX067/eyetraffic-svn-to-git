// Version 0.0  Initial version 
// Version 0.1  10/10/2006 Added E_STYLE_7 
// Version 0.2  17/05/2007 Added .isHidden() and .supportsHide()
// Version 0.3  14/09/2007 added .zindex()
function EStyle(stemImage, stemSize, boxClass, boxOffset){
    this.stemImage = stemImage;
    this.stemSize = stemSize;
    this.boxClass = boxClass;
    this.boxOffset = boxOffset;
    //this.border = border;
    // Known fudge factors are:
    // Firefox (1.0.6 and 1.5)    5, -1
    // IE 6.0                     0, -1
    // Opera 8.54                 3, -1
    // Opera 9 prev               4, -1
    // Netscape (7.2, 8.0)        5, -1
    // Safari                     5, -1        
	// Chrome                     0, -1
    var agent = navigator.userAgent.toLowerCase();
    var fudge = 5; // assume chrome if no match found
    if (agent.indexOf("chrome") > -1) {
        fudge = 0;
    }else if (agent.indexOf("opera") > -1) {
        fudge = 3;
    }else if (agent.indexOf("firefox") > -1) {
        fudge = 5;
    }else if (agent.indexOf("safari") > -1) {
        fudge = 5;
    }else if ((agent.indexOf("msie") > -1) && (agent.indexOf("opera") < 1)) {
        fudge = 0;
    }
    this.fudge = fudge;
}
var E_STYLE_1 = new EStyle("stem1.png", new GSize(81, 87), "estyle1", new GPoint(-30, 87 - 3));
var E_STYLE_2 = new EStyle("stem2.png", new GSize(81, 87), "estyle2", new GPoint(-30, 87 - 1));
var E_STYLE_3 = new EStyle("stem3.png", new GSize(81, 87), "estyle3", new GPoint(-30, 87 - 10));
var E_STYLE_4 = new EStyle("stem3.png", new GSize(81, 87), "estyle4", new GPoint(-30, 87 - 10));
var E_STYLE_5 = new EStyle("stem1.png", new GSize(81, 87), "estyle5", new GPoint(-30, 87 - 3));
var E_STYLE_6 = new EStyle("stem6.png", new GSize(100, 50), "estyle6", new GPoint(100 - 2, 20));
var E_STYLE_7 = new EStyle("stem7.png", new GSize(24, 24), "estyle2", new GPoint(-10, 23));
function EWindow(map, estyle, path){
    // parameters
    this.map = map;
    this.estyle = estyle;
	this.path = path||'';
    // internal variables
    this.visible = false;
    // browser - specific variables
    this.ie = false;
    var agent = navigator.userAgent.toLowerCase();
    this.ie= ((agent.indexOf("msie") > -1) && (agent.indexOf("opera") < 1));
}

EWindow.prototype = new GOverlay();
EWindow.prototype.initialize = function(map){
    var div1 = document.createElement("div");
    div1.style.position = "absolute";
    map.getPane(G_MAP_FLOAT_SHADOW_PANE).appendChild(div1);
    var div2 = document.createElement("div");
    div2.style.position = "absolute";
    div2.style.width = this.estyle.stemSize.width + "px";
    map.getPane(G_MAP_FLOAT_SHADOW_PANE).appendChild(div2);
    this.div1 = div1;
    this.div2 = div2;
};
EWindow.prototype.openOnMap = function(point, html, offset){
    this.offset = offset || new GPoint(0, 0);
    this.point = point;
    this.div1.innerHTML = '<div class="' + this.estyle.boxClass + '"><nobr>' + html + '</nobr></div>';
    if (this.ie && this.estyle.stemImage.toLowerCase().indexOf(".png") > -1) {
        var loader = "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.path + this.estyle.stemImage + "', sizingMethod='scale');";
        this.div2.innerHTML = '<div style="height:' + this.estyle.stemSize.height + 'px; width:' + this.estyle.stemSize.width + 'px; ' + loader + '" ></div>';
    } else {
        this.div2.innerHTML = '<img src="' + this.path + this.estyle.stemImage + '" width="' + this.estyle.stemSize.width + '" height="' + this.estyle.stemSize.height + '">';
    }
    var z = GOverlay.getZIndex(this.point.lat());
    this.div1.style.zIndex = z;
    this.div2.style.zIndex = z + 1;
    this.visible = true;
    this.show();
    this.redraw(true);
};
EWindow.prototype.openOnMarker = function(marker, html){
    var icon = marker.getIcon();
	var vx = icon.iconAnchor.x - (icon.infoWindowAnchor)?icon.infoWindowAnchor.x:0;
    var vy = icon.iconAnchor.y - (icon.infoWindowAnchor)?icon.infoWindowAnchor.y:0;
    this.openOnMap(marker.getPoint(), html, new GPoint(vx, vy));
};
EWindow.prototype.redraw = function(force){
    if (!this.visible) {
        return;
    }
    var p = this.map.fromLatLngToDivPixel(this.point);
    this.div2.style.left = (p.x + this.offset.x) + "px";
    this.div2.style.bottom = (-p.y + this.offset.y - this.estyle.fudge) + "px";
    this.div1.style.left = (p.x + this.offset.x + this.estyle.boxOffset.x) + "px";
    this.div1.style.bottom = (-p.y + this.offset.y + this.estyle.boxOffset.y) + "px";
};
EWindow.prototype.remove = function(){
    this.div1.parentNode.removeChild(this.div1);
    this.div2.parentNode.removeChild(this.div2);
    this.visible = false;
};
EWindow.prototype.copy = function(){
    return new EWindow(this.map, this.estyle);
};
EWindow.prototype.show = function(){
    this.div1.style.display = "";
    this.div2.style.display = "";
    this.visible = true;
};
EWindow.prototype.hide = function(){
    this.div1.style.display = "none";
    this.div2.style.display = "none";
    this.visible = false;
};
EWindow.prototype.isHidden = function(){
    return !this.visible;
};
EWindow.prototype.supportsHide = function(){
    return true;
};
EWindow.prototype.zindex = function(zin){
    var z = GOverlay.getZIndex(this.point.lat());
    this.div1.style.zIndex = z + zin;
    this.div2.style.zIndex = z + 1 + zin;
};
