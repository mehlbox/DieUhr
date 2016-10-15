$("#error").hide();
$("#bth").hide();
$("#countdownControl").hide();

var local  = { }
var temp   = { }
var remote = { }
var version = "1.0.3";

try {
	local = JSON.parse(getCookie('DieUhr'));
	console.log('Version '+local.version)
	if (local.version != version) { // empty old cookie
		console.log('empty cookie')
		setCookie('DieUhr', '');
		location.reload(true);
	}
}

catch(err) {
	console.log('reset settings');
	local = {
		version:	version,
		upperLine:	"Uhr",
		lowerLine:	"Textblock",
		clockSize:	"100%",
		dateSize:	"50%",
		timeout:	"300",
		countdown:			"300",
		countdownSize:		"50%",
		countdownTimeout:	"300",
		textblockSize:		"30%",
		textblockBorder:	"none",
		marqueeSize:	"50%",
		marqueeSpeed:	"15s",
		message:	"Das Lied Nr.: "
		
	}
	setCookie('DieUhr', JSON.stringify(local));
}
displayChange = 0;
local.displayChange = 2;
checkOption();
local.tab ="none";
targetDisplay('Vorschau');

$("#tab input").click(function(){ // tab buttons
	targetDisplay($(this).val());
});

$('#switch').click(function(){ // on off switch
	$(this).addClass("grayButton");
	if (remote.onOff == 'on') {
		local.onOff = 'turnOff';
		temp.onOff 	= 'turnOff';
	} else {
		local.onOff = 'turnOn';
		temp.onOff 	= 'turnOn';
		temp.displayChange = remote.displayChange+2;
	} 
	sendDisplay();
});

$("#upperLine").change(function(){ // dropdown menu upperLine
	local.upperLine = $("#upperLine option:selected").val();
	local.displayChange = local.displayChange+2;
	targetDisplay('Vorschau');
});

$("#lowerLine").change(function(){ // dropdown menu lowerLine
	local.lowerLine = $("#lowerLine option:selected").val();
	local.displayChange = local.displayChange+2;
	targetDisplay('Vorschau');
});

$("#symbol").change(function(){ // dropdown menu symbol
	local.message = $("#message").val() + $( "#symbol option:selected" ).val();
	$("#message").val(local.message);
	$("#symbol option:selected").prop("selected", false)
	$("#symbol option[value='']").prop("selected", true)
	if(local.upperLine == 'Laufschrift' || local.upperLine == 'Textblock' || local.lowerLine == 'Laufschrift' || local.lowerLine == 'Textblock') {
		if (local.tab == 'Live') { local.tab = 'Vorschau'; checkPage(); }
		$('#display').contents().find('#textblock, .marquee').html(local.message);
	}
	targetDisplay('Vorschau');
});

$("#moreOption").click(function(){ // button option
	if (local.option == 'on') {
		local.option = 'off';
	} else {
		local.option = 'on';
	}
});

$("#clockSize").change(function(){ // dropdown menu clockSize
	local.clockSize = $( "#clockSize option:selected" ).val();
	local.displayChange = local.displayChange+1;
});

$("#dateSize").change(function(){ // dropdown menu dateSize
	local.dateSize = $( "#dateSize option:selected" ).val();
	local.displayChange = local.displayChange+1;
});

$("#timeout").change(function(){ // dropdown menu timeout
	local.timeout = $( "#timeout option:selected" ).val();
	temp.timeout = local.timeout;
	sendDisplay();
});

$("#countdownMin").change(function(){ // dropdown menu countdown minute
	local.countdown = parseInt($( "#countdownMin option:selected" ).val()) + parseInt($( "#countdownSec option:selected" ).val());
	temp.countdown = local.countdown;
	sendDisplay();
});

$("#countdownSec").change(function(){ // dropdown menu countdown second
	local.countdown = parseInt($( "#countdownMin option:selected" ).val()) + parseInt($( "#countdownSec option:selected" ).val());
	temp.countdown = local.countdown;
	sendDisplay();
});

$("#countdownSize").change(function(){ // dropdown menu countdownSize
	local.countdownSize = $( "#countdownSize option:selected" ).val();
	local.displayChange = local.displayChange+2;
	targetDisplay('Vorschau');
});

$("#countdownTimeout").change(function(){ // dropdown menu countdownTimeout
	local.countdownTimeout = $( "#countdownTimeout option:selected" ).val();
	temp.countdownTimeout = local.countdownTimeout;
	sendDisplay();
});

$("#textblockSize").change(function(){ // dropdown menu textblockSize
	local.textblockSize = $( "#textblockSize option:selected" ).val();
	local.displayChange = local.displayChange+1;
	targetDisplay('Vorschau');
});

$("#textblockBorder").change(function(){ // dropdown menu textblockBorder
	local.textblockBorder = $( "#textblockBorder option:selected" ).val();
	local.displayChange  = local.displayChange+2;
	targetDisplay('Vorschau');
});

$("#marqueeSize").change(function(){ // dropdown menu marqueeSize
	local.marqueeSize = $( "#marqueeSize option:selected" ).val();
	local.displayChange = local.displayChange+1;
	targetDisplay('Vorschau');
});

$("#marqueeSpeed").change(function(){ // dropdown menu marqueeSpeed
	local.marqueeSpeed = $( "#marqueeSpeed option:selected" ).val();
	local.displayChange = local.displayChange+1;
	targetDisplay('Vorschau');
});

$('#message').bind('keyup',function(){ // textarea
	local.message = $("#message").val();
	if(local.upperLine == 'Laufschrift' || local.upperLine == 'Textblock' || local.lowerLine == 'Laufschrift' || local.lowerLine == 'Textblock') {
		if (local.tab == 'Live') targetDisplay('Vorschau');
		$('#display').contents().find('#textblock, .marquee').html(local.message);
	}
});

$('#new').click(function(){ // template button
	local.message = "Das Lied Nr.: ";
	$("#message").val(local.message);
	if(local.upperLine == 'Laufschrift' || local.upperLine == 'Textblock' || local.lowerLine == 'Laufschrift' || local.lowerLine == 'Textblock') {
		if (local.tab == 'Live') { targetDisplay('Vorschau'); }
		$('#display').contents().find('#textblock, .marquee').html(local.message);
	}
});

$('#del').click(function(){ // trash button
	local.message = "";
	$("#message").val(local.message);
	if(local.upperLine == 'Laufschrift' || local.upperLine == 'Textblock' || local.lowerLine == 'Laufschrift' || local.lowerLine == 'Textblock') {
		if (local.tab == 'Live') { targetDisplay('Vorschau'); }
		$('#display').contents().find('#textblock, .marquee').html(local.message);
	}
});

$('#reset').click(function(){ // reset button
	temp.countdownState = "start";
	temp.displayChange = remote.displayChange+1;
	sendDisplay();
	local.displayChange = local.displayChange+1;
});

$('#startStop').click(function(){ // startStop button
	if (remote.countdownState == undefined ) remote.countdownState = 'stop';
	
	if (remote.countdownState == "stop" ) {
		temp.countdownState = "start";
		sendDisplay();
	}
	if (remote.countdownState != 'stop') {
		temp.countdownState = "stop";
		sendDisplay();
	}
});

$("#confirm").click(function(){ //confirm button
	$(this).addClass("grayButton");
	temp.upperLine 			= local.upperLine;
	temp.lowerLine 			= local.lowerLine;
	temp.clockSize 			= local.clockSize;
	temp.dateSize 			= local.dateSize;
	temp.timeout 			= local.timeout;
	temp.countdown 			= local.countdown;
	temp.countdownSize 		= local.countdownSize;
	temp.countdownTimeout 	= local.countdownTimeout;
	temp.textblockSize		= local.textblockSize;
	temp.textblockBorder	= local.textblockBorder;
	temp.marqueeSize		= local.marqueeSize;
	temp.marqueeSpeed		= local.marqueeSpeed;	
	temp.message 			= local.message;
	temp.onOff 				= 'turnOn';
	temp.displayChange 		= remote.displayChange+2;
	sendDisplay();
	local.displayChange = local.displayChange+2;
	targetDisplay('Live');
});

$("#revert").click(function(){ //revert button
	$(this).addClass("grayButton");
	$.ajax({
	url: "data.json",
	cache: false
	})
	.done(function(response) {
		$("#revert").removeClass("grayButton");
		response.displayChange = undefined;
		$.extend(local,response); //merge object
		local.displayChange = local.displayChange+2;
		targetDisplay('Vorschau');
		checkOption();
	});
});

$("*").change(function(){ // all
	event.stopPropagation();
	setCookie('DieUhr', JSON.stringify(local));
	checkPage();
});

$('#resetUnit').click(function(){ // resetUnit button
	setCookie('DieUhr', '');
	location.reload(true);
});

$('#resetDisplay').click(function(){ // resetDisplay button
	$.ajax({
	method: "POST",
	url: "function.php",
	data: { command: 'delete' }
	})
});

timeloop();