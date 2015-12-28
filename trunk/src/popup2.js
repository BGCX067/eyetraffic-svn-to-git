/**
 * popup2
 *
 * @author Ludovic Valente
 * @web pitaso.com
 * @web xeoos.fr
 */
//UTF8: é
(function( $ ) {
var isDebug = false, mapcams = false, /*lastCamId=0 ,*/ lastCamRoad='', values = [], prefs, tid, disabled=false;
moment.lang(lang);

function initPopup(){
    resizePopup();
    
    $('#refresh').click(updateData);
    //Click title open main
    $('.time-title').click(openmain);
    //Click cam open main
    $('.cam').click(openmain);
        
    i18n();
    startStatus();
}

function onNothing(){
}

function updateData(){
    if (disabled){
    	return ;
    }
    var animateClass='glyphicon-refresh-animate', el = $('#refresh');
    el.addClass(animateClass);
    window.setTimeout(function(){
	    req('updatetimes', onUpdateTimes, {single:true});
	    req('updatealerts', onUpdateAlerts, {chantiers:false});
	    req('updateflashs', onUpdateFlashs);

	    req('popupstatus', function(o){
	    	updateCams(o.cam);
	        window.setTimeout( function() {
	        	el.removeClass(animateClass);
	        }, 500 );
	    });
	    
    }, 100);
    
}

function openmain(){
	var url = chrome.extension.getURL('dashboard.html');
	//window.location.href = url;
	chrome.tabs.create({url:url});
}

function resizePopup(){
	$(window.document.body).height($('.panel-menu').height());
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
	        updateData();
	        tid = window.setInterval(updateData, 30000);
	    }, 200);
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

function onUpdateTimes(o){
    var badgeid = (prefs) ? prefs.badge.id : false;
    var t = o.time,text = '...';
    if (t){
    	text = t.text+' : '+t.time;
    }
    $('.time-title').html(text);
}

var xtplAlert;
function onUpdateAlerts(channel){
    var r = [], el = $('#alerts');
    if (channel && channel.item) {
        items = channel.item;
        if (!$.isArray(items)) {
            items = [items];
        }
        if (!xtplAlert) {
            xtplAlert = tplAlert;
        }
        $.each(items, function(i, item){
            r.push(formatAlert(item, xtplAlert));
        });
    } 
    var pb = $('#main .panel-body');
    if (r && r.length>0){
    	el.html(r.join(''));
    	pb.removeClass('hide-al');
    }else{
    	el.html(LANG.NOTRAFFICINFO);
    	pb.addClass('hide-al');
    }
}
function formatAlert(item, tpl){
	//title,description,pubDate
	var d = getMoment(item.pubDate);
    item.date = d.fromNow();
    item.description = item.description||'';
    item.title = item.title||'';
    var output = Mustache.render(tpl, item);
    //el.prepend(output);
    return output;
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
        	
        	html += '<div class="alert alert-warning" role="alert"><strong>'+title+'</strong> '+flash.html+'</div>';
        });
        el.html(html);
        pb.removeClass('hide-fi');
    } else {
        el.html('');
        pb.addClass('hide-fi');
    }
}

function req(message, cb, data){
    if (chrome.extension) {
        var o = data || {};
        o.message = message;
        chrome.extension.sendRequest(o, cb);
    }
}


function getUrlCam(id){
    return urlCam.replace('{0}', id).replace('{1}', (new Date()).getTime());
}

function getUrlMap(id){
    return urlMap.replace('{0}', id);
}

function updateCams(cam){
	prefetchcams();
	//Render default, if nothing 
	cam=cam||{};
	cam.road=cam.road||'A3';
	cam.dir=cam.dir||'in';
	
	//Same road do not need to render again
	if (lastCamRoad==cam.road) return;
	
	//lastCamId = cam.id;
    var i=0, r =[],s =[]; 
    
    //No dir
    var cams = $.extend(dcams[cam.road]['camsin'] ,dcams[cam.road]['camsout']);
    
    if (cams){
	    //$('#carousel-cam').destroy();
	    
	    if (!$('#carousel-cam').hasClass('carousel')){
		    //console.log('create carousel html');
		    $('#carousel-cam').addClass('carousel slide').attr('data-ride', 'carousel' ).append(
						  '<ol class="carousel-indicators"></ol>'+
						  '<div class="carousel-inner"></div>'+
						  '<a class="left carousel-control" href="#carousel-cam" data-slide="prev">'+
						    '<span class="glyphicon glyphicon-chevron-left"></span>'+
						  '</a>'+
						  '<a class="right carousel-control" href="#carousel-cam" data-slide="next">'+
						    '<span class="glyphicon glyphicon-chevron-right"></span>'+
						  '</a>'+
						'</div>'
			);
	    }
	    
	    lastCamRoad = cam.road;
	    $.each(cams, function(id,cam){
	    	//console.log('cam '+id);
	    	//var clsactive = (id==lastCamId)?'active':'';
	    	var clsactive = (i==0)?'active':'';
	    	var c = mapcams[id]; //.road
	    	var url = getUrlCam(id), text = lastCamRoad+ ' ' + cam.text;
	    	//console.log('url: '+url);
	    	//console.log('text: '+text);
	    	r.push('<li data-target="#carousel-cam" data-slide-to="'+i+'" class="'+clsactive+'"></li>');
	    	s.push('<div class="item '+clsactive+'">'+
					      '<img class="cam" src="'+url+'" alt="Camera">'+
					      '<div class="carousel-caption">'+text+'</div>'+
					   '</div>');
			i++;
	    });
	    $('#carousel-cam .carousel-indicators').html(r.join(''));
	    $('#carousel-cam .carousel-inner').html(s.join(''));
	    
	    //console.log('fill '+i+' rows');

	    //console.log('make carousel');
	    //console.log('lastCamRoad= '+lastCamRoad);
	    
	    var elc = $('#carousel-cam');
	    elc.carousel({
		  interval: 2000
		});
		
		elc.carousel('cycle');
		
		$(document).bind('keyup', function(e) {
	        if(e.which == 39 || e.which == 32){
	            elc.carousel('next');
	        }
	        else if(e.which == 37){
	            elc.carousel('prev');
	        }
	    });
	}
} 
function prefetchcams(){
	if (!mapcams){
		mapcams = {};
		$.each(dcams, function(road,o){
			$.each(o.camsin, function(id,cam){
				mapcams[id]=$.extend({id:id, road:road, dir:'camsin'}, cam);
			});
			$.each(o.camsout, function(id,cam){
				mapcams[id]=$.extend({id:id, road:road, dir:'camsout'}, cam);
			});
	});
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