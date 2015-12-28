/**
 * Main popup
 *
 * @author Ludovic Valente
 * @web pitaso.com
 * @web xeoos.fr
 */
//UTF8: é
//var backgroundPage = chrome.extension.getBackgroundPage();
function update(){
    //updatepopup();
    req('updatetimes', onUpdateTimes);
    req('updatealerts', onUpdateAlerts);
    req('updateflashs', onUpdateFlashs);
    updateCams();
}

function onUpdateTimes(fragments){
    jQuery.each(fragments, function(zone, times){
        var el = jQuery('#time-' + zone);
        if (el) {
            el.html('');
            jQuery.each(times, function(i, t){
                var label = timeTexts[t.id] || t.code;
                el.append(label + '(' + t.id + ') : ' + t.time + '<br/>');
            });
        }
    });
}

var xtplAlert;
function onUpdateAlerts(channel){
    if (channel && channel.item) {
        jQuery('#alert').html('');
        items = channel.item;
        if (!jQuery.isArray(items)) {
            items = [items];
        }
        if (!xtplAlert) {
            xtplAlert = $.template(tplAlert);
        }
        jQuery.each(items, function(i, item){
            //title,description,pubDate
            item.date = jQuery.prettyDate.format(item.pubDate);
            jQuery('#alert').prepend(xtplAlert, item);
        });
    } else {
        jQuery('#alert').html(LANG.NOTRAFFICINFO);
    }
}

function onUpdateFlashs(news){
    if (news) {
        var html = '<span class="title">' + news.title + '</span><br/>' + news.content;
        jQuery('#flashinfo').html(html).show();
    } else {
        jQuery('#flashinfo').html('').hide();
    }
}

function req(message, cb){
    if (chrome.extension) {
        chrome.extension.sendRequest({
            message: message
        }, cb);
    }
}

function updatepopup(){
    //Temps de parcours
    xhr({
        method: 'GET',
        url: urlTime,
        dataType: 'text'
    }, function(xhr){
        var m, html = {}, data = xhr.responseText;
        //&1A6_lux_sud=LUX-SUD  24 min.
        while ((m = reTime.exec(data)) !== null) {
            var id = m[1], code = m[2], zone = m[3], time = m[4];
            var label = timeTexts[id] || code;
            if (!html[zone]) {
                html[zone] = '';
            }
            html[zone] += label + ' : ' + time + '<br/>';
            if (code == prefs.timecode) {
                chrome.extension.sendRequest({
                    message: 'badge',
                    title: time + ' minutes',
                    time: time
                });
            }
        }
        jQuery.each(html, function(zone, h){
            jQuery('#time-' + zone).html(h);
        });
    });
    //alert info
    xhr({
        method: 'GET',
        url: urlAlert,
        dataType: 'xml'
    }, function(xhr){
        var o = JSON.parse(xhr.responseJson);
        var channel = o.rss.channel;
        if (channel && channel.item) {
            jQuery('#alert').html('');
            items = channel.item;
            if (!jQuery.isArray(items)) {
                items = [items];
            }
            jQuery.each(items, function(i, item){
                //title,description,pubDate
                item.date = jQuery.prettyDate.format(item.pubDate);
                jQuery('#alert').prepend(tplAlert, item);
            });
        } else {
            jQuery('#alert').html(LANG.NOTRAFFICINFO);
        }
    });
    //flashinfo les frontaliers
    xhr({
        method: 'GET',
        url: urlFlashInfo,
        dataType: 'text'
    }, function(xhr){
        var m, data = xhr.responseText;
        m = reFlashInfoLF.main.exec(data);
        if (m && m[1]) {
            var n = reFlashInfoLF.title.exec(m[1]), p = reFlashInfoLF.content.exec(m[1]), title = n[1], content = p[1], html = '<span class="title">' + title + '</span><br/>' + content;
            jQuery('#flashinfo').html(html).show();
        } else {
            jQuery('#flashinfo').html('').hide();
        }
    });
}

function updateCams(){
    jQuery('.icam').each(function(i, img){
        if (img && img.id) {
            var url = getUrlCam(img.id.replace('icam', ''));
            img.src = url;
        }
    });
}

function getUrlCam(id){
    return urlCam.replace('{0}', id).replace('{1}', (new Date()).getTime());
}

function getUrlMap(id){
    return urlMap.replace('{0}', id);
}

function createCams(){
    jQuery.each(dcams, function(road, dcam){
        var el = jQuery('#cam-' + road);
        createMenuCams(el, dcam);
        createImageCams(el, dcam, true);
        createImageCams(el, dcam, false);
        var urlMap = getUrlMap(road);
        var div = jQuery('<div class="body zmap"><img src="' + urlMap + '"/></div>').hide();
        el.append(div);
    });
}

function createMenuCams(el, dcam){
    var nav = jQuery('<div class="nav"></div>');
    console.log(dcam.start + ',' + dcam.end);
    var ain = jQuery('<a class="ain selected">' + dcam.start + '-' + dcam.end + '</a>').attr('href', '#').click(changeMenuCams);
    var aout = jQuery('<a class="aout">' + dcam.end + '-' + dcam.start + '</a>').attr('href', '#').click(changeMenuCams);
    var amap = jQuery('<a class="amap">' + LANG.map + '</a>').attr('href', '#').click(changeMenuCams);
    nav.append(ain).append('&nbsp;&nbsp;&nbsp;').append(aout).append('&nbsp;&nbsp;&nbsp;').append(amap);
    el.append(nav);
}

function changeMenuCams(e){
    var el = jQuery(e.target);
    var id = el.get(0).className.replace(/^a/, '');
    var content = el.parents('.ui-tabs-panel');
    content.find('a').removeClass("selected");
    el.addClass("selected");
    content.find('.body').hide();
    content.find('.z' + id).show();
}

function createImageCams(el, dcam, isin){
    var txt = ((isin) ? 'in' : 'out');
    var div = jQuery('<div class="body z' + txt + '"></div>').toggle(isin);
    el.append(div);
    jQuery.each((isin) ? dcam.camsin : dcam.camsout, function(id, cam){
        div.append('<div class="cam"><img class="icam" id="icam' + id + '" src="' + getUrlCam(id) + '" title="' + id + ' - ' + cam.text + '"/><span>' + cam.text + '</span></div>');
    });
}

function xhr(a, cb){
    if (typeof chrome !== 'undefined' && typeof chrome.extension !== 'undefined') {
        a.message = 'xhr';
        chrome.extension.sendRequest(a, cb);
    } else {
        /*a.success = cb;
         a.type = a.method;
         $.ajax(a);*/
    }
}

function getHtml(id){
    if (id === '#map-bison') {
        return '<iframe src="http://www.bison-fute.equipement.gouv.fr/astec_acai/internet/ie1_myrabel.html?langue=fr&evt=1" width="590" height="480"></iframe>';
    } else if (id === '#map-cita') {
        return '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="600" height="444" align="" vspace="0" hspace="0">' +
        '<param name="movie" value="http://www2.pch.etat.lu/cita/cita.swf"><param name="src" value="http://www2.pch.etat.lu/cita/cita.swf"><param name="play" value="true"><param name="wmode" value=""><param name="scale" value="2"><param name="quality" value="high"><param name="menu" value="false"><param name="bgcolor" value=""><param name="AllowScriptAccess" value="sameDomain"><param name="loop" value="false">' +
        '<embed src="http://www2.pch.etat.lu/cita/cita.swf" scale="" wmode="" play="true" quality="high" menu="false" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="600" height="444" align="" bgcolor="" allowscriptaccess="sameDomain" loop="false" hspace="0" vspace="0">' +
        '</object>';
    } else {
        return '';
    }
}

function loadHtml(el, id){
    if (!el.attr('loaded')) {
        el.html(getHtml(id)).attr('loaded', 1);
    }
}

function convert(){
    xhr({
        method: 'GET',
        url: 'data/cams.xml',
        dataType: 'xml'
    }, function(xhr){
        var o = JSON.parse(xhr.responseJson);
		var r = {markers:[]};
        jQuery.each(o.markers.marker, function(i, marker){
            var html = Base64.decode(marker['@html']);
			var cam,titre,localite, label = '';
			
			var m = /cccam_(\d+)/.exec(html);
			if (m && m[1]){
				cam = parseInt(m[1],10);
			}
			
			m = /titrepopup2\">([^<]+)/.exec(html);
			if (m && m[1]){
				titre = m[1];
			}
			
			m = /localitepopup2\">([^<]+)/.exec(html);
			if (m && m[1]){
				localite = m[1];
			}
			
			label='Camera '+cam +'-'+titre+','+localite;
			
			//lat,lng,html
			r.markers.push({
				lat:parseFloat(marker['@lat'],10), 
				lng:parseFloat(marker['@lng'],10), 
				html:html,
				cam:cam,
				titre:titre,
				localite:localite,
				label:label
			});
        });
		jQuery('#res').val(JSON.stringify(r));
    });
}

function init(){
    jQuery('#refresh').button().click(update);
    jQuery('#convert').button().click(convert);
    //jQuery('#flashinfo').hide();
    jQuery('#times').tabs();
    jQuery('#cams').tabs({
        load: function(event, ui){
            createCams();
        }
    });
    jQuery('#maps').tabs({
        select: function(event, ui){
            loadHtml($(ui.panel), ui.tab.hash);
        }
    });
    window.setTimeout(function(){
        update();
    }, 200);
    window.setInterval(update, 30000);
    window.setTimeout(function(){
        loadHtml($('#map-cita'), '#map-cita');
    }, 3000);
}
