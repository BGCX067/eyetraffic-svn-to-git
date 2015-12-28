var baseIcon = new GIcon(G_DEFAULT_ICON);
baseIcon.iconSize = new GSize(24, 38);
var icon1 = G_START_ICON;
var icon2 = G_PAUSE_ICON;
var icon3 = G_END_ICON;
var icon4 = getIconWhite();
function getIconWhite(){
    var icon4 = new GIcon(baseIcon, "http://labs.google.com/ridefinder/images/mm_20_white.png");
    icon4.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
    icon4.iconSize = new GSize(12, 20);
    icon4.shadowSize = new GSize(22, 20);
    icon4.iconAnchor = new GPoint(6, 20);
    icon4.infoWindowAnchor = new GPoint(5, 1);
}

function getIconCafe(){
    var icon = new GIcon();
    icon.image = "http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe|996600";
    icon.shadow = "http://chart.apis.google.com/chart?chst=d_map_pin_shadow";
    icon.iconSize = new GSize(12, 20);
    icon.shadowSize = new GSize(22, 20);
    icon.iconAnchor = new GPoint(6, 20);
    icon.infoWindowAnchor = new GPoint(5, 1);
    return icon;
}

function getIconBlue(){
    var icon = new GIcon(G_DEFAULT_ICON);
    icon.image = "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png";
    return icon;
}

function getIconPause(){
    var icon = new GIcon(G_DEFAULT_ICON);
    icon.image = "http://www.google.com/intl/en_ALL/mapfiles/icon-dd-pause-trans.png";
    return icon;
}

function getIconStart(){
    var icon = new GIcon(G_DEFAULT_ICON);
    icon.image = "http://www.google.com/intl/en_ALL/mapfiles/icon-dd-play-trans.png";
    return icon;
}

function getIconEnd(){
    var icon = new GIcon(G_DEFAULT_ICON);
    icon.image = "http://www.google.com/intl/en_ALL/mapfiles/icon-dd-stop-trans.png";
    return icon;
}

function getIconA(){
    var icon = new GIcon(G_DEFAULT_ICON);
    icon.image = "http://maps.gstatic.com/intl/en_us/mapfiles/kml/paddle/go.png";
    return icon;
}

function getIconB(){
    var icon = new GIcon(G_DEFAULT_ICON);
    icon.image = "http://maps.gstatic.com/intl/en_us/mapfiles/kml/paddle/stop.png";
    return icon;
}

function getIconRed(){
    var icon = new GIcon();
    icon.image = "http://labs.google.com/ridefinder/images/mm_20_red.png";
    icon.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
    icon.iconSize = new GSize(12, 20);
    icon.shadowSize = new GSize(22, 20);
    icon.iconAnchor = new GPoint(6, 20);
    return icon;
}

function getIconBlueTiny(){
    var tiny = new GIcon();
    tiny.image = "http://labs.google.com/ridefinder/images/mm_20_blue.png";
    tiny.shadow = "http://labs.google.com/ridefinder/images/mm_20_shadow.png";
    tiny.iconSize = new GSize(12, 20);
    tiny.shadowSize = new GSize(22, 20);
    tiny.iconAnchor = new GPoint(6, 20);
    tiny.infoWindowAnchor = new GPoint(5, 1);
    return icon;
}
