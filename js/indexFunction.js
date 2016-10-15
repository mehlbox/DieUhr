function timeloop() {
	$.ajax({
	url: "data.json",
	cache: false
	})
	.done(function(response) {
		$("#error").hide();
		remote = response;
		checkOnOff();
		checkPage();
		checkButton();
	})
	.fail(function() {
		$("#error").show();
	})
	setTimeout("timeloop()",1000);
};

function sendDisplay() {
	$.ajax({
	method: "POST",
	url: "function.php",
	data: { data: JSON.stringify(temp) }
	})
	temp = { };
}

function targetDisplay(display) {
	if (local.tab != display) {
		local.tab = display;
		displayChange = 0;
		$('#wrapC').html('<iframe id="display" src="display.html?display='+display+'" width="100%" height="100%" scrolling="no" frameborder="0"></iframe>');
	}
}

function checkPage() {
	$("#"+local.tab).siblings().removeClass();
	$("#"+local.tab).addClass("selected");
	
	if (local.upperLine == 'Zeitgeber' || local.lowerLine == 'Zeitgeber' || remote.upperLine == 'Zeitgeber' || remote.lowerLine == 'Zeitgeber') {
		$('#countdownControl').show();
	} else {
		$('#countdownControl').hide();
	}
	
	if (local.option == 'on') {
		$("#option").show();
	} else {
		$("#option").hide();
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
		local.timeout 			== remote.timeout &&
		local.countdown 		== remote.countdown &&
		local.countdownSize 	== remote.countdownSize &&
		local.countdownTimeout 	== remote.countdownTimeout &&
		local.textblockSize		== remote.textblockSize &&
		local.textblockBorder	== remote.textblockBorder &&
		local.marqueeSize		== remote.marqueeSize &&
		local.marqueeSpeed		== remote.marqueeSpeed &&
		local.message 			== remote.message)
	{
		$('#bth').hide();
		$("#confirm").removeClass("grayButton");
    } else {
		$('#bth').show();
	}
}

function checkOnOff(){
	if (local.onOff == 'on') {
		var t = getTimeRemaining(local.timeoutEndtime);
		if (t.seconds<10) t.seconds = '0'+t.seconds;
		if (t.total>0) $('#autoOff').show().html(t.minutes+':'+t.seconds);
	}
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

function getTimeRemaining(endtime) {
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	return {
		'total': t,
		'minutes': minutes,
		'seconds': seconds
	};
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