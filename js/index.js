var local  = { }
var temp   = { }
var remote = { }
var version = "1.0.8";
var displayChange 	= 0;

try {
	local = JSON.parse(getCookie('DieUhr'));
}

catch(err) {
	console.log('reset settings');
	local = {
		upperLine:	"clock",
		lowerLine:	"textarea",
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
	temp.version = version;
	sendDisplay();
}

checkOption();
targetDisplay('Vorschau');

$("#tab input").click(function(){ // tab buttons
	targetDisplay($(this).val());
	checkPage();
});

$('#switch').click(function(){ // on off switch
	$(this).addClass("grayButton");
	if (remote.onOff == 'on') {
		temp.onOff 	= 'off';
		temp.countdownState = 'stop';
		temp.displayChange = remote.displayChange+1;
	} else {
		temp.onOff 	= 'on';
		targetDisplay('Live');
		temp.countdownState = 'stop';
		temp.timeoutTimestamp = remote.timeout
		temp.displayChange = remote.displayChange+1;
	} 
	sendDisplay();
});

$("#upperLine").change(function(){ // dropdown menu upperLine
	local.upperLine = $("#upperLine option:selected").val();
	local.displayChange++;
	targetDisplay('Vorschau');
});

$("#lowerLine").change(function(){ // dropdown menu lowerLine
	local.lowerLine = $("#lowerLine option:selected").val();
	local.displayChange++;
	targetDisplay('Vorschau');
});

$("#symbol").change(function(){ // dropdown menu symbol
	local.message = $("#message").val() + $( "#symbol option:selected" ).val();
	$("#message").val(local.message);
	$("#symbol option:selected").prop("selected", false)
	$("#symbol option[value='']").prop("selected", true)
	targetDisplay('Vorschau');
	if(local.upperLine == 'marquee' || local.upperLine == 'textarea' || local.lowerLine == 'marquee' || local.lowerLine == 'textarea') {
		$('#display').contents().find('#textblock, .marquee').html(local.message);
	}
});

$("#moreOption").click(function(){ // button option
	$("#option").toggle();
});

$("#clockSize").change(function(){ // dropdown menu clockSize
	local.clockSize = $( "#clockSize option:selected" ).val();
	local.displayChange++;
});

$("#dateSize").change(function(){ // dropdown menu dateSize
	local.dateSize = $( "#dateSize option:selected" ).val();
	local.displayChange++;
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
	local.displayChange++;
	targetDisplay('Vorschau');
});

$("#countdownTimeout").change(function(){ // dropdown menu countdownTimeout
	local.countdownTimeout = $( "#countdownTimeout option:selected" ).val();
	temp.countdownTimeout = local.countdownTimeout;
	sendDisplay();
});

$("#textblockSize").change(function(){ // dropdown menu textblockSize
	local.textblockSize = $( "#textblockSize option:selected" ).val();
	local.displayChange++;
	targetDisplay('Vorschau');
});

$("#textblockBorder").change(function(){ // dropdown menu textblockBorder
	local.textblockBorder = $( "#textblockBorder option:selected" ).val();
	local.displayChange  = local.displayChange+1;
	targetDisplay('Vorschau');
});

$("#marqueeSize").change(function(){ // dropdown menu marqueeSize
	local.marqueeSize = $( "#marqueeSize option:selected" ).val();
	local.displayChange++;
	targetDisplay('Vorschau');
});

$("#marqueeSpeed").change(function(){ // dropdown menu marqueeSpeed
	local.marqueeSpeed = $( "#marqueeSpeed option:selected" ).val();
	local.displayChange++;
	targetDisplay('Vorschau');
});

$('#message').bind('keyup',function(){ // textarea
	local.message = $("#message").val();
	targetDisplay('Vorschau');
	if(local.upperLine == 'marquee' || local.upperLine == 'textarea' || local.lowerLine == 'marquee' || local.lowerLine == 'textarea') {
		$('#display').contents().find('#textblock, .marquee').html(local.message);
	}
});

$('#new').click(function(){ // template button
	local.message = "Das Lied Nr.: ";
	targetDisplay('Vorschau');
	$("#message").val(local.message);
	if(local.upperLine == 'marquee' || local.upperLine == 'textarea' || local.lowerLine == 'marquee' || local.lowerLine == 'textarea') {
		$('#display').contents().find('#textblock, .marquee').html(local.message);
	}
});

$('#del').click(function(){ // trash button
	local.message = "";
	$("#message").val(local.message);
	targetDisplay('Vorschau');
	if(local.upperLine == 'marquee' || local.upperLine == 'textarea' || local.lowerLine == 'marquee' || local.lowerLine == 'textarea') {
		$('#display').contents().find('#textblock, .marquee').html(local.message);
	}
});

$('#stop').click(function(){ // stop button
	temp.countdownState = 'stop';
	temp.timeoutTimestamp = remote.timeout;
	console.log(remote.timeout)
	sendDisplay();
});

$('#start').click(function(){ // start button
	temp.timeoutTimestamp = parseInt(remote.countdown) + parseInt(remote.countdownTimeout);
	temp.countdownState = 'start';
	sendDisplay();
});

$("#confirm").click(function(){ //confirm button
	$(this).addClass("grayButton");
	temp.upperLine 			= local.upperLine;
	temp.lowerLine 			= local.lowerLine;
	
	temp.clockSize 			= local.clockSize;
	temp.dateSize 			= local.dateSize;
	
	temp.textblockSize		= local.textblockSize;
	temp.textblockBorder	= local.textblockBorder;
	
	temp.marqueeSize		= local.marqueeSize;
	temp.marqueeSpeed		= local.marqueeSpeed;
	
	temp.countdown 			= local.countdown;
	temp.countdownSize 		= local.countdownSize;
	temp.countdownTimeout 	= local.countdownTimeout;

	temp.message 			= local.message;
	temp.displayChange 		= remote.displayChange+1;
	temp.onOff 				= 'on';
	
	if (local.upperLine == 'countdown' || local.lowerLine == 'countdown') { // countdown confirmed
		if (temp.countdownState == 'stop') temp.timeoutTimestamp = local.timeout; // start normal timeout if countdown is stopped
	} else { // is not countdown
		temp.timeoutTimestamp = local.timeout; // start normal timeout
		temp.countdownState = 'stop'; // stop countdown
	}
	sendDisplay();
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
		local.displayChange++;
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
	command('delete');
});

timeloop();