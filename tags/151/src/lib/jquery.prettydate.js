/*
 * jQuery pretty date plug-in 1.0.1
 * 
 * http://bassistance.de/jquery-plugins/jquery-plugin-prettydate/
 * 
 * Based on John Resig's prettyDate http://ejohn.org/blog/javascript-pretty-date
 *
 * Copyright (c) 2009 Jörn Zaefferer
 *
 * $Id: jquery.validate.js 6096 2009-01-12 14:12:04Z joern.zaefferer $
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function() {

$.prettyDate = {
	
	template: function(source, params) {
		if ( arguments.length == 1 ) 
			return function() {
				var args = $.makeArray(arguments);
				args.unshift(source);
				return $.prettyDate.template.apply( this, args );
			};
		if ( arguments.length > 2 && params.constructor != Array  ) {
			params = $.makeArray(arguments).slice(1);
		}
		if ( params.constructor != Array ) {
			params = [ params ];
		}
		$.each(params, function(i, n) {
			source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
		});
		return source;
	},
	
	now: function() {
		return new Date();
	},
	
	// Takes an ISO time and returns a string representing how
	// long ago the date represents.
	format: function(time, lang) {
		var date;
		if (typeof time === 'string'){
			date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," "));
		}else{
			date=time;
		}
		 
			var diff = ($.prettyDate.now().getTime() - date.getTime()) / 1000,
			day_diff = Math.floor(diff / 86400);
			
		if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
			return;
		
		var messages = $.prettyDate.messages[lang||'en'];
		return day_diff == 0 && (
				diff < 60 && messages.now ||
				diff < 120 && messages.minute ||
				diff < 3600 && messages.minutes(Math.floor( diff / 60 )) ||
				diff < 7200 && messages.hour ||
				diff < 86400 && messages.hours(Math.floor( diff / 3600 ))) ||
			day_diff == 1 && messages.yesterday ||
			day_diff < 7 && messages.days(day_diff) ||
			day_diff < 31 && messages.weeks(Math.ceil( day_diff / 7 ));
	},
	
	messages:{}
	
};
$.prettyDate.messages.fr = {
	now: "maintenant",
	minute: "il y a 1 minute",
	minutes: $.prettyDate.template("il y a {0} minutes"),
	hour: "il y a 1 heure",
	hours: $.prettyDate.template("il y a {0} heures"),
	yesterday: "Hier",
	days: $.prettyDate.template("il y a {0} jours"),
	weeks: $.prettyDate.template("il y a {0} semaines")
};
$.prettyDate.messages.en = {
	now: "just now",
	minute: "1 minute ago",
	minutes: $.prettyDate.template("{0} minutes ago"),
	hour: "1 hour ago",
	hours: $.prettyDate.template("{0} hours ago"),
	yesterday: "Yesterday",
	days: $.prettyDate.template("{0} days ago"),
	weeks: $.prettyDate.template("{0} weeks ago")
};

$.prettyDate.messages.de = {
	now: "gerade eben",
	minute: "vor einer Minute",
	minutes: $.prettyDate.template("vor {0} Minuten"),
	hour: "vor einer Stunde",
	hours: $.prettyDate.template("vor {0} Stunden"),
	yesterday: "Gestern",
	days: $.prettyDate.template("vor {0} Tagen"),
	weeks: $.prettyDate.template("vor {0} Wochen")
}

$.fn.prettyDate = function(options) {
	options = $.extend({
		value: function() {
			return $(this).attr("title");
		},
		interval: 10000,
		lang:'en'
	}, options);
	var elements = this;
	function format() {
		elements.each(function() {
			var date = $.prettyDate.format(options.value.apply(this), lang||options.lang);
			if ( date && $(this).text() != date )
				$(this).text( date );
		});
	}
	format();
	if (options.interval)
		setInterval(format, options.interval);
	return this;
};

})();