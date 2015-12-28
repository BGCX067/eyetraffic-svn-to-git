function fillTpl(tpl, o){
    var txt = '' + tpl;
    for (var k in o) {
        if (o.hasOwnProperty(k)) {
            if (typeof o[k] !== "object") {
                var re = new RegExp("\\{" + k + "\\}", "g");
                txt = txt.replace(re, (o[k]) ? ('' + o[k]) : '');
            }
        }
    }
    return txt;
}

function getRandom(max){
	max =max || 100;
	return Math.round(Math.random() * max)+1; 
}

function req(message, cb, data){
    if (chrome.extension) {
        var o = data || {};
        o.message = message;
        chrome.extension.sendRequest(o, cb);
    }
}