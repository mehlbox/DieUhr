var kioskPollCounter = 0;
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
	$.ajax({
	url: "main",
	cache: false
	})
	.done(function(response) {
		$("#error").hide();
		applyRemoteState(response);
		checkOnOff();
		checkPage();
		checkProgVersion();
		syncDisplayFrames();
	})
	.fail(function() {
		$("#error").show().html("Keine Verbindung");
	})
	kioskPollCounter++;
	if (kioskPollCounter === 1 || kioskPollCounter % 5 === 0) {
		refreshKioskStatus();
	}
	setTimeout("timeloop()",1000);
};

function syncDisplayFrames() {
	var previewFrame = document.getElementById('display');
	if (previewFrame && previewFrame.contentWindow) {
		previewFrame.contentWindow.local = $.extend({}, local, { tab: 'Live' });
		previewFrame.contentWindow.remote = remote;
	}
}

function command(command) {
	$.ajax({
	method: "POST",
	url: "command",
	data: { command: command }
	})
}

function checkProgVersion() {
	if (remote.version != version) {
		setCookie('DieUhr', '');
		location.reload(true);
	}
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
		$("#error").hide();
		checkOnOff();
		checkPage();
	})
	.fail(function(xhr) {
		if (xhr.status === 409 && xhr.responseJSON) {
			applyRemoteState(xhr.responseJSON);
			$("#error").show().html("Konflikt: Ein anderer Client hat gerade aktualisiert.");
			checkOnOff();
			checkPage();
		}
	});
}

function checkPage() {
	if (remote.upperLine == 'countdown' || remote.lowerLine == 'countdown' || local.upperLine == 'countdown' || local.lowerLine == 'countdown') {
		$('#countdownControl').css('display', 'flex');
		$('#countdownOption').show();
	} else {
		$('#countdownControl').hide();
		$('#countdownOption').hide();
	}
	updateTimerFormState();
	
    if (remote.upperLine == 'textarea' || remote.lowerLine == 'textarea' || local.upperLine == 'textarea' || local.lowerLine == 'textarea') {
		$('#messageBox').show();
		$('#messageBoxControl').css('display', 'flex');
	} else {
		$('#messageBox').hide();
		$('#messageBoxControl').hide();
	}
}

function checkOption() {
	syncLineDropdowns();
	$("#timeout").val(local.timeout);

	$("#countdownMin").val(parseInt(local.countdown/60)*60); // get just the minutes in second
	$("#countdownSec").val(local.countdown%60);		// get just the seconds
	$("#countdownTimeout").val(local.countdownTimeout);

	$("#message").val(local.message);
	
}

function updateTimerFormState() {
	var isRunning = remote.countdownState === 'start';
	$("#countdownMin, #countdownSec, #countdownTimeout").prop("disabled", isRunning);
}

function getLineOptions() {
	return [
		{ value: 'clock', label: 'Uhrzeit' },
		{ value: 'date', label: 'Datum' },
		{ value: 'countdown', label: 'Timer' },
		{ value: 'textarea', label: 'Text' },
		{ value: 'off', label: 'Aus' }
	];
}

function renderLineSelect($select, excludedValue, selectedValue) {
	var options = getLineOptions();
	$select.empty();

	for (var i = 0; i < options.length; i++) {
		if (options[i].value === excludedValue) continue;
		$select.append($('<option></option>').val(options[i].value).text(options[i].label));
	}

	if ($select.find('option[value="' + selectedValue + '"]').length === 0) {
		selectedValue = $select.find('option:first').val();
	}
	$select.val(selectedValue);
	return selectedValue;
}

function syncLineDropdowns() {
	var options = getLineOptions();

	if (!local.upperLine) local.upperLine = 'clock';
	if (!local.lowerLine) local.lowerLine = 'textarea';

	if (local.upperLine === local.lowerLine) {
		for (var i = 0; i < options.length; i++) {
			if (options[i].value !== local.upperLine) {
				local.lowerLine = options[i].value;
				break;
			}
		}
	}

	local.upperLine = renderLineSelect($("#upperLine"), local.lowerLine, local.upperLine);
	local.lowerLine = renderLineSelect($("#lowerLine"), local.upperLine, local.lowerLine);
}

function checkOnOff(){
	var remaining = remote.timeoutTimestamp - getRemoteTimestampNow();
	if (remaining >= 0 && local.timeout != 'inf') $('#autoOff').show().html(showTimer(remaining));
	if (local.timeout == 'inf') $('#autoOff').show().html('&#8734;');
	
	if (remote.onOff == 'on') {
		$('#switch').removeClass("grayButton is-off").addClass("is-on");
	} 
	if (remote.onOff == 'off') {
		$('#switch').removeClass("grayButton is-on").addClass("is-off");
		$('#autoOff').hide();
	}
}

function showTimer(total){
	var seconds = Math.floor(total % 60);
	var minutes = Math.floor((total / 60) % 60);
	seconds = Math.abs(seconds);
	minutes = Math.abs(minutes);
	if (total<0) { minutes--; minutes = '-'+minutes }
	if (seconds<10) seconds = '0'+seconds
	return minutes+':'+seconds
}

function refreshKioskStatus() {
	$.ajax({
		url: "/api/kiosks",
		cache: false
	})
	.done(function(response) {
		var items = (response && response.items) ? response.items : [];
		renderKioskStatus(items.length ? items[0] : null);
	})
	.fail(function() {
		renderKioskStatus(null);
		$("#kioskHint").text("Kiosk-Status konnte nicht geladen werden.");
	});
}

function renderKioskStatus(kiosk) {
	var $button = $("#requestKioskScreenshot");
	var $restartButton = $("#restartKioskChromium");
	var $state = $("#kioskState");
	var $meta = $("#kioskMeta");
	var $badge = $("#kioskBadge");
	var $hint = $("#kioskHint");
	var $shot = $("#kioskScreenshot");
	var $empty = $("#kioskScreenshotEmpty");
	var $resolution = $("#kioskScreenshotResolution");
	var $frame = $(".kiosk-shot-frame");
	var $loading = $("#kioskScreenshotLoading");
	var screenshotPending = false;
	var screenshotButtonLabel = "Neu holen";

	if (!kiosk) {
		currentKioskId = "";
		$button.prop("disabled", true);
		$button.text(screenshotButtonLabel);
		$restartButton.prop("disabled", true);
		$state.text("Offline");
		$meta.text("Warte auf Verbindung");
		$badge.removeClass("is-online is-offline is-pending").addClass("is-unknown").text("Unbekannt");
		$hint.text("Noch kein Kiosk verbunden.");
		$shot.hide().attr("src", "");
		$empty.show();
		$resolution.hide().text("").attr("aria-hidden", "true");
		$frame.removeClass("is-loading");
		$loading.attr("aria-hidden", "true");
		return;
	}

	currentKioskId = kiosk.id || "";
	$button.prop("disabled", !currentKioskId);
	$restartButton.prop("disabled", !currentKioskId);

	var badgeClass = "is-unknown";
	var badgeLabel = "Unbekannt";
	if (kiosk.pendingActionType === "restart-browser") {
		badgeClass = "is-pending";
		badgeLabel = "Neustart läuft";
	} else if (kiosk.pendingScreenshotRequestId) {
		badgeClass = "is-pending";
		badgeLabel = "Screenshot läuft";
		screenshotPending = true;
	} else if (kiosk.online) {
		badgeClass = "is-online";
		badgeLabel = "Online";
	} else {
		badgeClass = "is-offline";
		badgeLabel = "Offline";
	}

	$badge.removeClass("is-online is-offline is-pending is-unknown").addClass(badgeClass).text(badgeLabel);
	$state.text(kiosk.online ? "Verbunden" : "Keine Verbindung");
		$button.text(screenshotPending ? "Screenshot läuft" : screenshotButtonLabel);
	$button.prop("disabled", !currentKioskId || screenshotPending);

	var metaParts = [];
	if (kiosk.name && kiosk.name !== kiosk.id) metaParts.push(kiosk.name);
	if (kiosk.hostname) metaParts.push(kiosk.hostname);
	if (kiosk.serviceState) metaParts.push("Service: " + kiosk.serviceState);
	if (kiosk.ageSeconds !== null && kiosk.ageSeconds !== undefined) metaParts.push("Zuletzt " + formatRelativeAge(kiosk.ageSeconds));
	$meta.text(metaParts.length ? metaParts.join(" | ") : "Keine Statusdaten");

	if (kiosk.pendingActionType === "restart-browser") {
		$hint.text("Chromium-Neustart angefordert. Warte auf den Pi-Agenten.");
	} else if (kiosk.currentUrl) {
		$hint.text(kiosk.currentUrl);
	} else {
		$hint.text("Kein Browser-Ziel gemeldet.");
	}

	$frame.toggleClass("is-loading", screenshotPending);
	$loading.attr("aria-hidden", screenshotPending ? "false" : "true");

	if (kiosk.screenshotUrl) {
		$shot.attr("src", kiosk.screenshotUrl + (kiosk.screenshotUrl.indexOf("?") === -1 ? "?" : "&") + "t=" + (kiosk.lastScreenshotAt || 0));
		$shot.show();
		$empty.hide();
		if (kiosk.resolution) {
			$resolution.text(kiosk.resolution).show().attr("aria-hidden", "false");
		} else {
			$resolution.hide().text("").attr("aria-hidden", "true");
		}
	} else {
		$shot.hide().attr("src", "");
		$empty.show();
		$resolution.hide().text("").attr("aria-hidden", "true");
	}
}

function formatRelativeAge(seconds) {
	if (seconds < 2) return "gerade eben";
	if (seconds < 60) return "vor " + seconds + "s";
	if (seconds < 3600) return "vor " + Math.floor(seconds / 60) + "m";
	return "vor " + Math.floor(seconds / 3600) + "h";
}

function setCookie(cname, cvalue) {
    var d = new Date();
	cvalue = cvalue.replace(/;/g,"\\semi");
    d.setTime(d.getTime() + (30*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
	var cvalue;
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
			cvalue = c.substring(name.length,c.length);
			cvalue = cvalue.replace(/\\semi/g,";");
            return cvalue;
        }
    }
    return "";
}
