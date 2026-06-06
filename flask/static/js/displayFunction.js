var remoteTimestampBase = null;
var remoteTimestampSyncedAtMs = 0;

function syncRemoteClock(timestampSeconds) {
	var parsedTimestamp = parseInt(timestampSeconds, 10);
	if (isNaN(parsedTimestamp)) return;
	remoteTimestampBase = parsedTimestamp;
	remoteTimestampSyncedAtMs = Date.now();
	remote.timestamp = parsedTimestamp;
}

function getRemoteTimestampNow() {
	if (remoteTimestampBase === null) {
		var fallbackTimestamp = Math.round(Date.now() / 1000);
		remote.timestamp = fallbackTimestamp;
		return fallbackTimestamp;
	}

	var elapsedSeconds = Math.floor((Date.now() - remoteTimestampSyncedAtMs) / 1000);
	var currentTimestamp = remoteTimestampBase + elapsedSeconds;
	remote.timestamp = currentTimestamp;
	return currentTimestamp;
}

function applyRemoteState(nextRemote) {
	remote = nextRemote || { };
	syncRemoteClock(remote.timestamp);
	getRemoteTimestampNow();
	return remote;
}

function timeloop() {
	if (window.frameElement) {
	  // in frame
		getRemoteTimestampNow();
		if (selectDisplay == 'Live') {
			checkDisplay(remote);
		} else if (selectDisplay == 'Vorschau') {
			checkDisplay(local);
		} else if (local.tab == 'Live') { 
			checkDisplay(remote);
		} else {
			checkDisplay(local);
		}
		$('#error').hide();
	setTimeout("timeloop()",1000);
	} else {
	  // independent, not in frame
		$.ajax({
		url: "data",
		cache: false
		})
		.done(function(response) {
			applyRemoteState(response);
			checkDisplay(remote);
			$('#error').hide();
		})
		.fail(function() { // fall back if no conection
			if (!remote || remoteTimestampBase === null) {
				remote = remote || { };
				syncRemoteClock(Math.round(Date.now() / 1000));
			} else {
				getRemoteTimestampNow();
			}
			checkDisplay(remote);
			$('#error').show().html('Keine Verbindung zum Server ! Fernsteuerung nicht möglich.');
			console.error("Keine Verbindung zum Server!");
		})
	setTimeout("timeloop()",1000);
	}
	// Standalone display must stay read-only and never trigger auth-protected writes.
	if (window.frameElement) {
		checkTimeout();
	}
};

// Allow rich HTML in messages, but strip anything that can execute JavaScript
// (script/style/iframe/... elements, on* event handlers, javascript: URLs).
function sanitizeMessageHtml(value) {
	var raw = value == null ? '' : String(value);
	if (raw.indexOf('<') === -1) return raw;

	var doc = new DOMParser().parseFromString('<div id="dieuhr-msg">' + raw + '</div>', 'text/html');
	var container = doc.getElementById('dieuhr-msg');
	if (!container) return '';

	var blockedTags = { script: 1, style: 1, iframe: 1, object: 1, embed: 1, link: 1, meta: 1, base: 1, form: 1 };
	var elements = container.getElementsByTagName('*');
	for (var i = elements.length - 1; i >= 0; i--) {
		var el = elements[i];
		var tag = el.tagName.toLowerCase();
		if (blockedTags[tag]) {
			if (el.parentNode) el.parentNode.removeChild(el);
			continue;
		}
		for (var a = el.attributes.length - 1; a >= 0; a--) {
			var attr = el.attributes[a];
			var name = attr.name.toLowerCase();
			var compactValue = (attr.value || '').replace(/[\s\u0000-\u001f]+/g, '').toLowerCase();
			var isUrlAttr = (name === 'href' || name === 'src' || name === 'xlink:href' || name === 'formaction');
			if (name.indexOf('on') === 0 || (isUrlAttr && compactValue.indexOf('javascript:') === 0)) {
				el.removeAttribute(attr.name);
			}
		}
	}
	return container.innerHTML;
}

function showTimer(total){
	var isNegative = total < 0;
	var absoluteTotal = Math.abs(total);
	var minutes = Math.floor(absoluteTotal / 60);
	var seconds = absoluteTotal % 60;
	if (seconds < 10) seconds = '0' + seconds;
	return (isNegative ? '-' : '') + minutes + ':' + seconds;
}

function setCountdownOverdueState(isOverdue) {
	$('.countdown, .stopwatch').toggleClass('is-overdue', isOverdue);
}

function checkTimeout(){
	var remaining = remote.timeoutTimestamp - getRemoteTimestampNow();
	if (remote.onOff == 'on' && remaining <= 0 && remote.timeout != 'inf' ) {
		temp.onOff ='off';
		temp.countdownState = 'stop';
		temp.displayChange = remote.displayChange+1;
		sendDisplay();
	}
}

function sendDisplay() {
	var payload = $.extend({}, temp);
	payload.baseVersion = remote.stateVersion || 0;
	temp = { };

	$.ajax({
	method: "POST",
	url: "main",
	data: { data: JSON.stringify(payload) }
	})
	.done(function(response) {
		applyRemoteState(response);
	})
	.fail(function(xhr) {
		if (xhr.status === 409 && xhr.responseJSON) {
			applyRemoteState(xhr.responseJSON);
		}
	});
}

function urlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return '';
    }
    else{
       return results[1] || 0;
    }
}

function checkDisplay(object) {
	if (local.displayChange == undefined) local.displayChange = 1;
	if (remote.displayChange == undefined) remote.displayChange = 2;

	var activeTab = local.tab;
	if (selectDisplay == 'Vorschau' || selectDisplay == 'Live') {
		activeTab = selectDisplay;
	}
	
	if ( activeTab == 'Vorschau' || (activeTab == 'Live' && remote.onOff == 'on')) {
		
		if (displayChange != object.displayChange) { // keep refresh action low
			//console.log('Var: '+displayChange+'  Object: '+object.displayChange+' '+local.tab);
			displayChange = object.displayChange;

			const html_code = {
				clock 		: '<span class="cl_hours"></span><span class="cl_minutes"></span>',
				date 		: '<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>',
				countdown 	: '<span class="countdown-line"><span class="stopwatch"></span><span class="countdown"></span></span>',
				textarea 	: '<span id="textblock"></span>',
				off 		: ''
			}

			$('#printUpperLine').html(html_code[object.upperLine]);
			$('#printLowerLine').html(html_code[object.lowerLine]);
						
			$('#textblock').html(sanitizeMessageHtml(object.message));
		}
		if (object.upperLine == 'countdown' || object.lowerLine == 'countdown') {
		var total = remote.timeoutTimestamp - getRemoteTimestampNow() - remote.countdownTimeout
			if (remote.countdownState == 'start') {
				$('.countdown').html(showTimer(total));
				setCountdownOverdueState(total < 0);
			} else {
				$('.countdown').html(showTimer(remote.countdown));
				setCountdownOverdueState(false);
			}
		}
	}
	
	if (activeTab == 'Live' && remote.onOff == 'off') {
		if (displayChange != object.displayChange) { // keep refresh action low
			displayChange = object.displayChange;		
			$('#printUpperLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>');//.css('font-size', '100%');
			$('#printLowerLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>');//.css('font-size', '50%');
		}
	}
	updateClock();

	var renderedUpperType = object.upperLine;
	var renderedLowerType = object.lowerLine;
	if (activeTab == 'Live' && remote.onOff == 'off') {
		renderedUpperType = 'clock';
		renderedLowerType = 'date';
	}

	fitDisplay(renderedUpperType, renderedLowerType);
}

function fitDisplay(upperType, lowerType) {
	var $center = $('#center');
	var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1080;
	var hasUpperLine = upperType != 'off';
	var hasLowerLine = lowerType != 'off';
	var isClockDate = (upperType == 'clock' && lowerType == 'date');
	var isDateClock = (upperType == 'date' && lowerType == 'clock');

	$center.removeClass('layout-time-date layout-date-time layout-single-upper layout-single-lower');

	if (isClockDate) {
		$center.addClass('layout-time-date');
		fitLine('#printUpperLine', Math.floor(viewportHeight * 0.68));
		fitLine('#printLowerLine', Math.floor(viewportHeight * 0.24));
		return;
	}

	if (isDateClock) {
		$center.addClass('layout-date-time');
		fitLine('#printUpperLine', Math.floor(viewportHeight * 0.3));
		fitLine('#printLowerLine', Math.floor(viewportHeight * 0.62));
		return;
	}

	if (hasUpperLine && !hasLowerLine) {
		$center.addClass('layout-single-upper');
		fitLine('#printUpperLine', Math.floor(viewportHeight * 0.9));
		return;
	}

	if (!hasUpperLine && hasLowerLine) {
		$center.addClass('layout-single-lower');
		fitLine('#printLowerLine', Math.floor(viewportHeight * 0.9));
		return;
	}

	fitLine('#printUpperLine', Math.floor(viewportHeight * 0.44));
	fitLine('#printLowerLine', Math.floor(viewportHeight * 0.44));
}

function fitLine(selector, maxfontsize) {
	if (!$(selector).children().length) return;

	$(selector).bigtext({ maxfontsize: Math.max(1, maxfontsize) });
	clampLineToWidth(selector);
}

function clampLineToWidth(selector) {
	var el = $(selector).get(0);
	if (!el) return;

	var attempt = 0;
	while (el.scrollWidth > el.clientWidth && attempt < 20) {
		var $targets = $(selector).find('.bigtext-line');
		if (!$targets.length) {
			$targets = $(selector).children();
		}

		$targets.each(function() {
			var fontSize = parseFloat($(this).css('font-size'));
			if (!isNaN(fontSize) && fontSize > 1) {
				$(this).css('font-size', (fontSize * 0.96) + 'px');
			}
		});

		attempt++;
	}
}


// clock //////////////////////////////////

function printClock(std, min) {
		var minutes = (min<10?"0":"") + min;
		var hours = (std<10?"0":"") + std;
		$(".cl_minutes").html(":"+minutes);
		$(".cl_hours").html(hours);
}

function printDate(day, month, year) {
	switch(dateFormat) {
		case "dd.mm.yyyy":
			$(".cl_day").html(day);
			$(".cl_month").html("."+month);
			$(".cl_year").html("."+year);
			break;
		case "dd.mm.yy":
			$(".cl_day").html(day);
			$(".cl_month").html("."+month);
			year +=""; //make it a string
			year = year.substring(2,4);
			$(".cl_year").html("."+year);	
			break;
		case "dd.mon.yyyy":
			$(".cl_day").html(day);
			$(".cl_month").html(". "+getNameMonth(month));
			$(".cl_year").html("&nbsp;"+year);
			break;
	
		default:
			break;
	}
}

function getNameMonth(month) {
	months = new Array();
	months = ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
	return months[month-1];
}

function updateClock(){
	var Datum 	= new Date(getRemoteTimestampNow() * 1000);
	var std 	= Datum.getHours();
	var min 	= Datum.getMinutes();
	var day 	= Datum.getDate();
	var month 	= Datum.getMonth()+1;
	var year 	= Datum.getFullYear();
	printClock(std, min);
	printDate(day, month, year);
}
