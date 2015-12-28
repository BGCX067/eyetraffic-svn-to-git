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