var local  = { }
var temp   = { }
var remote = { }
var version = "1.1.0";
var displayChange 	= 0;
var offStateSessionKey = "DieUhrBeforeOff";
var messageDraft = "";

try {
	local = JSON.parse(getCookie('DieUhr'));
}

catch(err) {
	console.log('reset settings');
	local = {
		upperLine:			"clock",
		lowerLine:			"textarea",
		timeout:			"300",
		countdown:			"300",
		countdownTimeout:	"300",
		message:			"Das Lied Nr.: "
		
	}
	setCookie('DieUhr', JSON.stringify(local));
	temp.version = version;
	sendDisplay();
}

checkOption();
messageDraft = local.message || "";

function saveStateBeforeOff() {
	try {
		sessionStorage.setItem(offStateSessionKey, JSON.stringify(local));
	} catch (err) {
		console.log("could not save off-state snapshot", err);
	}
}

function restoreStateAfterOff() {
	try {
		var raw = sessionStorage.getItem(offStateSessionKey);
		if (!raw) return false;
		var saved = JSON.parse(raw);
		if (!saved || typeof saved !== "object") return false;
		local = $.extend({}, local, saved);
		return true;
	} catch (err) {
		console.log("could not restore off-state snapshot", err);
		return false;
	}
}

function pushLiveState(options) {
	options = options || {};
	setCookie('DieUhr', JSON.stringify(local));
	temp.upperLine = local.upperLine;
	temp.lowerLine = local.lowerLine;
	temp.countdown = local.countdown;
	temp.countdownTimeout = local.countdownTimeout;
	temp.message = local.message;
	temp.displayChange = (remote.displayChange || 0) + 1;
	temp.onOff = options.onOff || 'on';
	if (options.countdownState !== undefined) temp.countdownState = options.countdownState;
	if (options.timeoutTimestamp !== undefined) temp.timeoutTimestamp = options.timeoutTimestamp;
	sendDisplay();
}

function updateTextPreview() {
	if(local.upperLine == 'marquee' || local.upperLine == 'textarea' || local.lowerLine == 'marquee' || local.lowerLine == 'textarea') {
		$('#display').contents().find('#textblock, .marquee').html(messageDraft);
	}
}

function pushTextMessage() {
	local.message = messageDraft;
	setCookie('DieUhr', JSON.stringify(local));
	temp.message = messageDraft;
	temp.displayChange = (remote.displayChange || 0) + 1;
	sendDisplay();
}

$('#switch').click(function(){ // on off switch
	$(this).addClass("grayButton");
	if (remote.onOff == 'on') {
		saveStateBeforeOff();
		local.upperLine = 'clock';
		local.lowerLine = 'date';
		syncLineDropdowns();
		pushLiveState({ onOff: 'off', countdownState: 'stop', timeoutTimestamp: local.timeout });
	} else {
		restoreStateAfterOff();
		syncLineDropdowns();
		checkOption();
		messageDraft = local.message || "";
		pushLiveState({ onOff: 'on', countdownState: 'stop', timeoutTimestamp: local.timeout });
	} 
	checkPage();
});

$("#upperLine").change(function(){ // dropdown menu upperLine
	local.upperLine = $("#upperLine option:selected").val();
	syncLineDropdowns();
	local.displayChange++;
	pushLiveState();
});

$("#lowerLine").change(function(){ // dropdown menu lowerLine
	local.lowerLine = $("#lowerLine option:selected").val();
	syncLineDropdowns();
	local.displayChange++;
	pushLiveState();
});

$("#moreOption").click(function(){ // button option
	$("#option").toggle();
});

$("#clockSize").change(function(){ // dropdown menu clockSize
	local.clockSize = $( "#clockSize option:selected" ).val();
	local.displayChange++;
	pushLiveState();
});

$("#dateSize").change(function(){ // dropdown menu dateSize
	local.dateSize = $( "#dateSize option:selected" ).val();
	local.displayChange++;
	pushLiveState();
});

$("#timeout").change(function(){ // dropdown menu timeout
	local.timeout = $( "#timeout option:selected" ).val();
	pushLiveState({ timeoutTimestamp: local.timeout });
});

$("#countdownMin").change(function(){ // dropdown menu countdown minute
	local.countdown = parseInt($( "#countdownMin option:selected" ).val()) + parseInt($( "#countdownSec option:selected" ).val());
	pushLiveState();
});

$("#countdownSec").change(function(){ // dropdown menu countdown second
	local.countdown = parseInt($( "#countdownMin option:selected" ).val()) + parseInt($( "#countdownSec option:selected" ).val());
	pushLiveState();
});

$("#countdownSize").change(function(){ // dropdown menu countdownSize
	local.countdownSize = $( "#countdownSize option:selected" ).val();
	local.displayChange++;
	pushLiveState();
});

$("#countdownTimeout").change(function(){ // dropdown menu countdownTimeout
	local.countdownTimeout = $( "#countdownTimeout option:selected" ).val();
	pushLiveState();
});

$("#textblockSize").change(function(){ // dropdown menu textblockSize
	local.textblockSize = $( "#textblockSize option:selected" ).val();
	local.displayChange++;
	pushLiveState();
});

$("#textblockBorder").change(function(){ // dropdown menu textblockBorder
	local.textblockBorder = $( "#textblockBorder option:selected" ).val();
	local.displayChange  = local.displayChange+1;
	pushLiveState();
});

$("#marqueeSize").change(function(){ // dropdown menu marqueeSize
	local.marqueeSize = $( "#marqueeSize option:selected" ).val();
	local.displayChange++;
	pushLiveState();
});

$("#marqueeSpeed").change(function(){ // dropdown menu marqueeSpeed
	local.marqueeSpeed = $( "#marqueeSpeed option:selected" ).val();
	local.displayChange++;
	pushLiveState();
});

$('#message').bind('keyup',function(){ // textarea
	messageDraft = $("#message").val();
	updateTextPreview();
});

$('#new').click(function(){ // template button
	messageDraft = "Das Lied Nr.: ";
	$("#message").val(messageDraft);
	updateTextPreview();
});

$('#del').click(function(){ // trash button
	messageDraft = "";
	$("#message").val(messageDraft);
	updateTextPreview();
});

$('#confirmText').click(function(){ // send text only
	pushTextMessage();
});

$('#stop').click(function(){ // stop button
	pushLiveState({ countdownState: 'stop', timeoutTimestamp: local.timeout });
});

$('#start').click(function(){ // start button
	var startDuration = parseInt(local.countdown) + parseInt(local.countdownTimeout);
	pushLiveState({ countdownState: 'start', timeoutTimestamp: startDuration });
});


$("*").change(function(event){ // all
	event.stopPropagation();
	setCookie('DieUhr', JSON.stringify(local));
	checkPage();
});

$('#resetUnit').click(function(){
	setCookie('DieUhr', '');
	location.reload(true);
	command('delete');
});

timeloop();
