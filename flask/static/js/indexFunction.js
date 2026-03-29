function timeloop() {
	$.ajax({
	url: "main",
	cache: false
	})
	.done(function(response) {
		$("#error").hide();
		remote = response;
		checkOnOff();
		checkPage();
		checkProgVersion();
		syncDisplayFrames();
	})
	.fail(function() {
		$("#error").show().html("Keine Verbindung");
	})
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
		remote = response;
		$("#error").hide();
		checkOnOff();
		checkPage();
	})
	.fail(function(xhr) {
		if (xhr.status === 409 && xhr.responseJSON) {
			remote = xhr.responseJSON;
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
	var remaining = remote.timeoutTimestamp - remote.timestamp;
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
