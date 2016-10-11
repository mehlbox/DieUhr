$("#error").hide();
$("#bth").hide();
$("#countdownControl").hide();

var local  = { }
var temp   = { }
var remote = { }

try {
	local = JSON.parse(getCookie('DieUhr'));
	if (local.version != "1") { // empty old cookie
		setCookie('DieUhr', '');
		location.reload(true);
	}
}

catch(err) {
	local = {
		version:	"1",
		tab:		"Vorschau",
		upperLine:	"Uhr",
		lowerLine:	"Textblock",
		clockSize:	"100%",
		dateSize:	"50%",
		timeout:	"300",
		countdown:			"300",
		countdownSize:		"50%",
		countdownTimeout:	"300",
		textblockSize:		"30%",
		marqueeSize:	"50%",
		marqueeSpeed:	"15s",
		message:	"Das Lied Nr.: "
		
	}
	setCookie('DieUhr', JSON.stringify(local));
	location.reload(true);
}
displayChange = 0;
local.displayChange = 2;
checkOption();
changeDisplay(local.tab);

function timeloop() {
	$.ajax({
	url: "data.json",
	cache: false
	})
	.done(function(response) {
		$("#error").hide();
		remote = response;
		chkOnOff();
		checkDisplayC(local.tab);
		chkButton();
	})
	.fail(function() {
		$("#error").show();
	});

	setTimeout("timeloop()",1000);
};
timeloop();


$("#tab input").click(function(){ // tab buttons
	local.tab = $(this).val();
	changeDisplay(local.tab)
	setCookie('DieUhr', JSON.stringify(local));
	checkDisplayC(local.tab);
});

$('#switch').click(function(){ // on off switch
	$(this).addClass("grayButton");
	if (remote.onOff == 'on') {
		temp.onOff ='off';
	} else {
		temp.onOff ='on';
		temp.displayChange = remote.displayChange+2;
	} 
	sendDisplay(temp);
	temp = { };
	setCookie('DieUhr', JSON.stringify(local));
});

$("#upperLine").change(function(){ // dropdown menu upperLine
	local.upperLine = $("#upperLine option:selected").val();
	local.displayChange = local.displayChange+2;
	local.tab = 'Vorschau';
	changeDisplay(local.tab);
	setCookie('DieUhr', JSON.stringify(local));
	checkDisplayC(local.tab);
});

$("#lowerLine").change(function(){ // dropdown menu lowerLine
	local.lowerLine = $("#lowerLine option:selected").val();
	local.displayChange = local.displayChange+2;
	local.tab = 'Vorschau';
	changeDisplay(local.tab);
	setCookie('DieUhr', JSON.stringify(local));
	checkDisplayC(local.tab);
});

$("#symbol").change(function(){ // dropdown menu symbol
	local.message = $("#message").val() + $( "#symbol option:selected" ).val();
	$("#symbol option:selected").prop("selected", false)
	$("#symbol option[value='']").prop("selected", true)
	$("#message").val(local.message);
	setCookie('DieUhr', JSON.stringify(local));
	checkDisplayC(local.tab);
});

$("#moreOption").click(function(){ // button option
	if (local.option == 'on') {
		local.option = 'off';
	} else {
		local.option = 'on';
	}
	setCookie('DieUhr', JSON.stringify(local));
	checkDisplayC(local.tab);
});

$("#clockSize").change(function(){ // dropdown menu clockSize
	local.clockSize = $( "#clockSize option:selected" ).val();
	setCookie('DieUhr', JSON.stringify(local));
		temp.clockSize = local.clockSize;
		temp.displayChange = remote.displayChange+1;
		local.displayChange = local.displayChange+1;
		sendDisplay(temp);
		temp = { };
	checkDisplayC(local.tab);
});

$("#dateSize").change(function(){ // dropdown menu dateSize
	local.dateSize = $( "#dateSize option:selected" ).val();
	setCookie('DieUhr', JSON.stringify(local));
		temp.dateSize = local.dateSize;
		temp.displayChange = remote.displayChange+1;
		local.displayChange = local.displayChange+1;
		sendDisplay(temp);
		temp = { };
	checkDisplayC(local.tab);
});

$("#timeout").change(function(){ // dropdown menu timeout
	local.timeout = $( "#timeout option:selected" ).val();
	setCookie('DieUhr', JSON.stringify(local));
		temp.timeout = local.timeout;
		sendDisplay(temp);
		temp = { };
	checkDisplayC(local.tab);
});

$("#countdownMin").change(function(){ // dropdown menu countdown minute
	local.countdown = parseInt($( "#countdownMin option:selected" ).val()) + parseInt($( "#countdownSec option:selected" ).val());
	setCookie('DieUhr', JSON.stringify(local));
		temp.countdown = local.countdown;
		sendDisplay(temp);
		temp = { };
	checkDisplayC(local.tab);
});

$("#countdownSec").change(function(){ // dropdown menu countdown second
	local.countdown = parseInt($( "#countdownMin option:selected" ).val()) + parseInt($( "#countdownSec option:selected" ).val());
	setCookie('DieUhr', JSON.stringify(local));
		temp.countdown = local.countdown;
		sendDisplay(temp);
		temp = { };
	checkDisplayC(local.tab);
});

$("#countdownSize").change(function(){ // dropdown menu countdownSize
	local.countdownSize = $( "#countdownSize option:selected" ).val();
	setCookie('DieUhr', JSON.stringify(local));
		temp.countdownSize = local.countdownSize;
		temp.displayChange = remote.displayChange+2;
		local.displayChange = local.displayChange+2;
		sendDisplay(temp);
		temp = { };
	checkDisplayC(local.tab);
});

$("#countdownTimeout").change(function(){ // dropdown menu countdownTimeout
	local.countdownTimeout = $( "#countdownTimeout option:selected" ).val();
	setCookie('DieUhr', JSON.stringify(local));
		temp.countdownTimeout = local.countdownTimeout;
		sendDisplay(temp);
		temp = { };
	checkDisplayC(local.tab);
});

$("#textblockSize").change(function(){ // dropdown menu textblockSize
	local.textblockSize = $( "#textblockSize option:selected" ).val();
	setCookie('DieUhr', JSON.stringify(local));
		temp.textblockSize = local.textblockSize;
		temp.displayChange = remote.displayChange+1;
		local.displayChange = local.displayChange+1;
		sendDisplay(temp);
		temp = { };
	checkDisplayC(local.tab);
});

$("#marqueeSize").change(function(){ // dropdown menu marqueeSize
	local.marqueeSize = $( "#marqueeSize option:selected" ).val();
	setCookie('DieUhr', JSON.stringify(local));
		temp.marqueeSize = local.marqueeSize;
		temp.displayChange = remote.displayChange+1;
		local.displayChange = local.displayChange+1;
		sendDisplay(temp);
		temp = { };
	checkDisplayC(local.tab);
});

$("#marqueeSpeed").change(function(){ // dropdown menu marqueeSpeed
	local.marqueeSpeed = $( "#marqueeSpeed option:selected" ).val();
	setCookie('DieUhr', JSON.stringify(local));
		temp.marqueeSpeed = local.marqueeSpeed;
		temp.displayChange = remote.displayChange+1;
		local.displayChange = local.displayChange+1;
		sendDisplay(temp);
		temp = { };
	checkDisplayC(local.tab);
});

$('#message').bind('keyup',function(){ // textarea
	local.message = $("#message").val();
	if(local.upperLine == 'Laufschrift' || local.upperLine == 'Textblock' || local.lowerLine == 'Laufschrift' || local.lowerLine == 'Textblock') {
		if (local.tab == 'Live') { local.tab = 'Vorschau'; checkDisplayC(local.tab); }
		$('#display').contents().find('.textblock, .marquee').html(local.message);
	}
	setCookie('DieUhr', JSON.stringify(local));
});

$('#new').click(function(){ // template button
	local.message = "Das Lied Nr.: ";
	$("#message").val(local.message);
	local.tab = 'Vorschau';
	setCookie('DieUhr', JSON.stringify(local));
	checkDisplayC(local.tab);
});

$('#del').click(function(){ // trash button
	local.message = "";
	$("#message").val(local.message);
	local.tab = 'Vorschau';
	if(local.upperLine == 'Laufschrift' || local.upperLine == 'Textblock' || local.lowerLine == 'Laufschrift' || local.lowerLine == 'Textblock') {
		if (local.tab == 'Live') { local.tab = 'Vorschau'; checkDisplayC(local.tab); }
		$('#display').contents().find('.textblock, .marquee').html(local.message);
	}
	setCookie('DieUhr', JSON.stringify(local));
	checkDisplayC(local.tab);
});

$('#reset').click(function(){ // reset button
	temp.countdownState = "start";
	temp.displayChange = remote.displayChange+1;
	local.displayChange = local.displayChange+1;
	sendDisplay(temp);
	temp = { };
	setCookie('DieUhr', JSON.stringify(local));
	checkDisplayC(local.tab);
});

$('#startStop').click(function(){ // startStop button
	if (remote.countdownState == undefined ) remote.countdownState = 'stop';
	if (remote.countdownState == "stop" ) {
		temp.countdownState = "start";
		sendDisplay(temp);
		temp = { };
	}
	if (remote.countdownState != 'stop') {
		temp.countdownState = "stop";
		sendDisplay(temp);
		temp = { };
	}
	setCookie('DieUhr', JSON.stringify(local));
	checkDisplayC(local.tab);
});

$("#confirm").click(function(){ //confirm button
	$(this).addClass("grayButton");
	temp = local;
	delete temp.tab;
	delete temp.option;
	delete temp.countdownState;
	delete temp.countdownEndtime;
	temp.onOff ='on';
	temp.displayChange = remote.displayChange+2;
	sendDisplay(temp);
	temp = { };
	local.displayChange = local.displayChange+2;
	if (local.tab != 'Live') {
		local.tab = 'Live';
		changeDisplay(local.tab);
	}
	setCookie('DieUhr', JSON.stringify(local));
	checkDisplayC(local.tab);
});

$("#revert").click(function(){ //revert button
	$(this).addClass("grayButton");
	$.ajax({
	url: "data.json",
	cache: false
	})
	.done(function(response) {
		$("#revert").removeClass("grayButton");
		$.extend(local,response);
		local.tab = 'Vorschau';
		changeDisplay(local.tab);
		checkOption();
		setCookie('DieUhr', JSON.stringify(local));
		checkDisplayC(local.tab);
	});
});