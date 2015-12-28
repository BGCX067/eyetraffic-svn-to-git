/**
 * Main popup
 *
 * @author Ludovic Valente
 * @web pitaso.com
 * @web xeoos.fr
 */
//UTF8: é
(function( $ ) {
	
var values = [], prefs, tid, disabled=false;
function initPopup(){
    var mapsel = localStorage.getItem('tab-maps')||'map-tomtom';
    var camsel = localStorage.getItem('tab-cams')||'cam-A1';
    var timesel = localStorage.getItem('tab-times')||'time-FRANCE';
    
    $('#times').tabs({
        activate: function(event, ui){
            var gid='tab-times', id = ui.newPanel[0].id;
    		localStorage.setItem(gid,id);
        }
    });
    $('#cams').tabs({
        activate: function(event, ui){
            loadTabContent(ui.newPanel, 'tab-cams');
        }
    });

	$('#maps').tabs({
        activate: function(event, ui){
            loadTabContent(ui.newPanel, 'tab-maps');
        }
    });
    
    i18n();

    $('#_status').click(function(){
    	startStatus(true);
    });
    
    
    updateOnce();
    $('#refresh').button().click(update);
    
    //load first tab
    selectTab('times', timesel);
    selectTab('maps', mapsel);
    selectTab('cams', camsel);

    startStatus();
}
function startStatus(toggle){
	var bstatus = localStorage.getItem('status')||'';
	if (toggle){
		bstatus=(bstatus)?'':'disabled';
	}
	if (bstatus){
		//Stop
		disabled=true;
		bstatus='disabled';
		clearInterval(tid);
		tid=0;
	}else{
		//Start
		disabled=false;
		bstatus='';
		window.setTimeout(function(){
	        update();
	        tid = window.setInterval(update, 30000);
	    }, 1000);
	}
	disableBadge(bstatus);
	localStorage.setItem('status', bstatus);
	$(document.body).toggleClass('disabled', disabled);
	$('#_status').text(disabled?'On':'Off');
}

function disableBadge(disabled){
	var badgeid = (prefs) ? prefs.badge.id : false;
	//Stop tictac
    //Disable badge
    req('status', function(a){
        
    }, {
        disabled:disabled,
        id: badgeid
    });
}
function selectTab(tabId, mapsel){
    var tabEl=$('#'+tabId), gid='tab-'+tabId;
    var i = $('#'+mapsel).prevAll('.tab-content').length;
    if (i==0){
    	tabEl.tabs( "load", 1 );
    	var panel1 = $('.tab-content',tabEl).first();
    	loadTabContent(panel1, gid);
    }
    tabEl.tabs('option', 'active', i);
}
function loadTabContent(panel, gid){
    var id = panel[0].id;
    localStorage.setItem(gid,id);
    loadHtml(panel, id);
}
function updateOnce(){
    req('prefs', function(p){
        prefs = p;
        setTimeout(function(){
        	createCams(false);
        });
        if (p.options){
        	//Display at open
        	setTimeout(function(){
        		onUpdateFlashs(p.options.flashs);
        	},100);
        }
    });
}

function update(){
    if (disabled){
    	return;
    }
    req('updatetimes', onUpdateTimes);
    req('updatealerts', onUpdateAlerts, {chantiers:true});
    req('updateflashs', onUpdateFlashs);
    updateCams();
    renderPlots();
}

function changebadgeref(event){
    var id = event.data.id;
    req('updateprefs', function(p){
        //alert('Change done!');
        $('#times').find('a.selected').removeClass('selected');
        $('#lk' + id).addClass('selected');
        prefs = p;
        renderPlots();
    }, {
        badge: {
            id: id
        }
    });
}

function savelastcam(e){
    var id,road;
    if (e){
    	//Click picture
    	id = $(e.target)[0].id.replace('icam', '');
    }else{
    	//Read current tab/submenu
    	var tab = $('#cams').tabs('option', 'active');
    	//current road = current tab
    	road = $($('#cams ul>li>a')[tab]).attr('data-id');
    }
    req('updateprefs', function(p){
        //
    }, {
        cam: {/*id:id,*/ road:road}
    });
}

function renderPlots(){
    var badgeid = (prefs) ? prefs.badge.id : false;
    req('history', function(a){
        $('#history').sparkline(a.values, {
            fillColor: false,
            normalRangeMin: a.limit.orange,
            normalRangeMax: a.limit.red,
            normalRangeColor: '#FDFF94'
        });
        var last = a.values[a.values.length - 1];
        $('#history').attr('title', 'History on last hour - ' + last + 'min - Orange:' + a.limit.orange + 'min - Red:' + a.limit.red + 'min');
    }, {
        id: badgeid
    });
}


function onUpdateTimes(fragments){
    var badgeid = (prefs) ? prefs.badge.id : false;
    $.each(fragments, function(zone, times){
        var el = $('#time-' + zone);
        if (el) {
            el.html('');
            $.each(times, function(i, t){
                //var label = (timeMappings[t.id]) ? (timeMappings[t.id].text) : t.code;
				//label += '(' + t.id + ')';
				var label = t.text;
                var link = $('<a href="#" id="lk' + t.id + '">' + label + '</a>').bind('click', {
                    id: t.id
                }, changebadgeref);
                if (badgeid == t.id) {
                    link.addClass('selected');
                }
                link.appendTo(el);
                el.append(' : ' + t.time + '<br/>');
            });
        }
    });
}

var xtplAlert;
function onUpdateAlerts(channel){
    if (channel && channel.item) {
        $('#alert').html('');
        items = channel.item;
        if (!$.isArray(items)) {
            items = [items];
        }
        if (!xtplAlert) {
            xtplAlert = tplAlert;
            //xtplAlert = $.template(tplAlert);
        }
        $.each(items, function(i, item){
            //title,description,pubDate
        	var d = getMoment(item.pubDate);
            item.date = d.fromNow();
            item.description =item.description||'';
            item.title =item.title||'';
            var output = Mustache.render(xtplAlert, item);
            //$('#alert').prepend(xtplAlert, item);
            $('#alert').prepend(output);
        });
    } else {
        $('#alert').html(LANG.NOTRAFFICINFO);
    }
}
function onUpdateFlashs(flashs){
    var el = $('#flashinfo'), pb = $('#main .panel-body');
    if (flashs) {
        var html='',f=0;
        $.each(flashs, function(i,flash){
        	var title = flash.title;
        	if (flash.url){
        		title='<a href="'+flash.url+'" target="flash_'+(++f)+'">'+flash.title+'</a>';
        	}
        	html += '<span class="title">' + title + '</span><br/>' + flash.html;
        });
        el.html(html);
        
    } else {
        el.html('');
    }
}

function req(message, cb, data){
    if (chrome.extension) {
        var o = data || {};
        o.message = message;
        chrome.extension.sendRequest(o, cb);
    }
}

function updateCams(){
    $('.izi').each(function(i, a){
        var img = $(a).find('.icam');
        if (img && img.id) {
            var url = getUrlCam(img.id.replace('icam', ''));
            img.attr('src', url);
            a.href = url;
        }
    });
}

function getUrlCam(id){
    return urlCam.replace('{0}', id).replace('{1}', (new Date()).getTime());
}

function getUrlMap(id){
    return urlMap.replace('{0}', id);
}

function createCams(static){
    var i = 0;
    $.each(dcams, function(road, dcam){
        var el = $('#cam-' + road);
        if (el) {
            createMenuCams(el, dcam);
            createImageCams(el, dcam, true, static);
            createImageCams(el, dcam, false, static);
            var url = getUrlMap(road);
            var div = $('<div class="body zmap"><img src="' + url + '"/></div>').hide();
            el.append(div);
        }
    });
    
    
    $('a.izi').fancyZoom({
    	minBorder:90,
    	//+
    	afterclick:savelastcam,
    	container:$('#main')
    });
    //$('a.izi').click(savelastcam);
}

function createMenuCams(el, dcam){
    var nav = $('<div class="nav"></div>');
    //console.log(dcam.start + ',' + dcam.end);
    var ain = $('<a class="ain selected">' + dcam.start + '-' + dcam.end + '</a>').attr('href', '#').click(changeMenuCams);
    var aout = $('<a class="aout">' + dcam.end + '-' + dcam.start + '</a>').attr('href', '#').click(changeMenuCams);
    var amap = $('<a class="amap">' + LANG.map + '</a>').attr('href', '#').click(changeMenuCams);
    nav.append(ain).append('&nbsp;&nbsp;&nbsp;').append(aout).append('&nbsp;&nbsp;&nbsp;').append(amap);
    el.append(nav);
}

function changeMenuCams(e){
    var el = $(e.target);
    if (el.hasClass('selected')) {
        return;
    }
    var id = el.get(0).className.replace(/^a/, '');
    var content = el.parents('.ui-tabs-panel');
    content.find('a').removeClass("selected");
    el.addClass("selected");
    content.find('.body').hide();
    content.find('.z' + id).show();
    
    //Save road
    savelastcam();
}

function createImageCams(el, dcam, isin, static){
    var txt = ((isin) ? 'in' : 'out'), html = '<div class="body z' + txt + '">';
    //var div = $('<div class="body z' + txt + '"></div>');
    $.each((isin) ? dcam.camsin : dcam.camsout, function(id, cam){
        var u = (static) ? urlCamNa : getUrlCam(id), t = id + ' - ' + cam.text;
        html += '<div class="cam">' +
        '<a class="izi" href="'+u+'" title="'+t+'">' +
        '<img class="icam" alt="'+cam.text+'" id="icam'+id+'" src="'+u+'"/>' +
        '</a>' +
        '<span>' +cam.text +'</span>'+
        '</div>';
    });
    html += '</div>';
    var nel = $(html);
    el.append(nel);
    
    nel.toggle(isin);
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
    if (id === 'map-bison') {
        var url = 'http://www.bison-fute.gouv.fr/a31-luxembourg-metz-nancy,10271.html';
        return writeIframe(id,url,800,700,'',60,220);
    } else if (id === 'map-tomtom') {
        var w = 590 + 360;
		var url = 'http://routes.tomtom.com/map/?center=49.490%2C5.980&zoom=8&map=basic';
		//return '<div id="tomtomwrap"><div id="tomtomoffset"><iframe src="'+url+'" frameborder="0" scrolling="no" width="'+w+'" height="480"></iframe></div></div>';
		return writeIframe(id,url,w,480);
    }else if (id === 'map-custom') {
		var url = 'maps.html';
		//return '<div id="goowrap"><div id="goooffset"><iframe src="'+url+'" frameborder="0" scrolling="no" width="'+w+'" height="480"></iframe></div></div>';
		return writeIframe(id,url,590,480);
    } else if (id === 'map-cita') {
	   var url = 'http://www.cita.lu',w=600,h=444;
	   return writeIframe(id,url,w,h);
     } else if (id === 'map-tunnel') {
        return '<img src="http://tunnel.cita.lu/img/trajets-map.png" height="350"/>';
    } else if (id === 'map-google') {
       var url = 'gmap.html',w=630,h=380; //same as CSS #gmap
	   return writeIframe(id,url,w,h);
    }else if (id === 'map-ir57') {
		var w = 2000, h=2000;
		var url = 'http://www.inforoute57.fr';
		return writeIframe(id,url);
    } else if (id === 'map-rtl') {
		var url = 'http://www.rtl.lu/trafic/';
		return writeIframe(id,url,960,1050,'',340,600);
    } else if (id === 'map-mobilinfo') {
		var w=800, h=600;
		var url = 'http://www.mobilinfo.be/mobilinfo/';
		return writeIframe(id,url,w,h,'http://trafic.lesoir.be');
    } else if (id === 'map-wallonie') {
		var url = 'http://trafiroutes.wallonie.be/trafiroutes/maptempsreel/';
		return writeIframe(id,url,2000,2000,'',240,20);
    } else if (id === 'map-verkehrsinfo') {
		var w=800, h=670;
		var url = 'http://www.verkehrsinfo.de';
		return writeIframe(id,url,w,h);
    }  else if (id === 'map-swr3') {
		var w=800, h=670;
		var url = 'http://www.swr3.de/info/verkehr/stauanzeige/SWR3-Verkehrszentrum/-/id=64076/did=929404/urt9vu/index.html';
		return writeIframe(id,url,w,h);
    }else {
        return '';
    }
}
function writeIframe(id,url,w,h,page,left,top){
	w=w||800;
	h=h||600;
	page=page||url;
	var html='<div class="overview"><a target="_blank_'+id+'" href="'+page+'">Source</a></div>';
	var css = '';
	if (left){
		css += 'margin-left: -'+left+'px;';
	}
	if (top){
		css += 'margin-top: -'+top+'px;';
	}
	if (css){
		css = ' style="'+css+'"';
	}
	html+='<div class="mwrap"><div class="moffset"><iframe'+css+' id="if-'+id+'" src="'+url+'" frameborder="0" scrolling="no" width="'+w+'" height="'+h+'"></iframe></div></div>';
	return html;
}

function loadHtml(el, id){
    if (!el){
    	el = $('#' + id);
    }
    if (!el.attr('loaded')) {
        var html = getHtml(id);
        if (html) {
            el.html(html);
        }
        el.attr('loaded', 1);
    }
}

function i18n(){
	function _(id){
		$('#'+id).text(LANG[id]);
	}
	_('refresh');
	_('_info');
	_('_times');
	_('_cams');
	_('_maps');
    
}


$(function() {
  initPopup();
});

})( jQuery );