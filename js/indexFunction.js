function timeloop() {
	$.ajax({
	url: "function.php",
	cache: false
	})
	.done(function(response) {
		$("#error").hide();
		remote = response;
		checkOnOff();
		checkPage();
		checkButton();
		checkProgVersion();
		window.frames[0].local 	= local;
		window.frames[0].remote = remote;
		if (decodeURIComponent(urlParam('d')) != '') window.frames[1].remote = remote;
	})
	.fail(function() {
		$("#error").show().html("Keine Verbindung");
	})
	setTimeout("timeloop()",1000);
};

function command(command) {
	$.ajax({
	method: "POST",
	url: "function.php",
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
	$.ajax({
	method: "POST",
	url: "function.php",
	data: { data: JSON.stringify(temp) }
	})
	temp = { };
}

function targetDisplay(displaySelect) {
	if (local.tab != displaySelect) {
		local.tab = displaySelect;
		displayChange = local.displayChange+1;
	}
}

function checkPage() {
	$("#"+local.tab).siblings().removeClass();
	$("#"+local.tab).addClass("selected");
	
	if (remote.upperLine == 'countdown' || remote.lowerLine == 'countdown' || local.upperLine == 'countdown' || local.lowerLine == 'countdown') {
		$('#countdownControl').show();
	} else {
		$('#countdownControl').hide();
	}
	
    if (remote.upperLine == 'textarea' || remote.lowerLine == 'textarea' || local.upperLine == 'textarea' || local.lowerLine == 'textarea') {
		$('#messageBox').show();
		$('#messageBoxControl').show();
	} else {
		$('#messageBox').hide();
		$('#messageBoxControl').hide();
	}
}

function checkOption() {
	$("#upperLine").val(local.upperLine);
	$("#lowerLine").val(local.lowerLine);
	$("#clockSize").val(local.clockSize);
	$("#dateSize").val(local.dateSize);
	$("#timeout").val(local.timeout);

	$("#countdownMin").val(parseInt(local.countdown/60)*60); // get just the minutes in second
	$("#countdownSec").val(local.countdown%60);		// get just the seconds
	$("#countdownSize").val(local.countdownSize);
	$("#countdownTimeout").val(local.countdownTimeout);

	$("#textblockSize").val(local.textblockSize);
	$("#textblockBorder").val(local.textblockBorder);
	
	$("#marqueeSize").val(local.marqueeSize);
	$("#marqueeSpeed").val(local.marqueeSpeed);

	$("#message").val(local.message);
	
}

function checkButton() { // check if a change exist
	if (local.upperLine 		== remote.upperLine &&
		local.lowerLine 		== remote.lowerLine &&
		
		local.clockSize 		== remote.clockSize &&
		local.dateSize 			== remote.dateSize &&
		
		local.textblockSize		== remote.textblockSize &&
		local.textblockBorder	== remote.textblockBorder &&
		
		local.marqueeSize		== remote.marqueeSize &&
		local.marqueeSpeed		== remote.marqueeSpeed &&
		
		local.countdown 		== remote.countdown &&
		local.countdownSize 	== remote.countdownSize &&
		local.countdownTimeout 	== remote.countdownTimeout &&

		local.message 			== remote.message)
	{
		$('#bth').hide();
		$("#confirm").removeClass("grayButton");
    } else {
		$('#bth').show();
	}
}

function checkOnOff(){
	var remaining = remote.timeoutTimestamp - remote.timestamp;
	if (remaining >= 0 && local.timeout != 'inf') $('#autoOff').show().html(showTimer(remaining));
	if (local.timeout == 'inf') $('#autoOff').show().html('&#8734;');
	
	if (remote.onOff == 'on') {
		$('#switch').removeClass("grayButton");
		$('#switch').css("background-color", "#99DD55");
	} 
	if (remote.onOff == 'off') {
		$('#switch').removeClass("grayButton");
		$('#switch').css("background-color", "#FF7755");
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