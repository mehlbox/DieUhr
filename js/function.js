function sendDisplay(stream) {
	$.ajax({
	method: "POST",
	url: "function.php",
	data: { data: JSON.stringify(stream) }
	})
}

function checkDisplay() {
	$("#"+local.tab).siblings().removeClass();
	$("#"+local.tab).addClass("selected");

	if ( local.tab == 'Vorschau') {
		if (local.preUpperLine != local.upperLine) { // stop from keep writing text
			if (local.upperLine == 'Uhr') 		 	$('#printUpperLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>').css('font-size', local.clockSize);
			if (local.upperLine == 'Datum')			$('#printUpperLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>').css('font-size', local.dateSize);
			if (local.upperLine == 'Zeitgeber')   	$('#printUpperLine').html('<span class="cd_minutes"></span><span class="cd_seconds"></span>').css('font-size', local.countdownSize);
			if (local.upperLine == 'Textblock')   	$('#printUpperLine').html('<div class="textblock"></div>').css('font-size', local.textblockSize);
			if (local.upperLine == 'Laufschrift') 	$('#printUpperLine').html('<div class="marquee"></div>').css('font-size', local.marqueeSize);
			if (local.upperLine == 'Aus')		  	$('#printUpperLine').html('');
		local.preUpperLine = local.upperLine;
		}
		if (local.preLowerLine != local.lowerLine) { // stop from keep writing text
			if (local.lowerLine == 'Uhr') 		 	$('#printLowerLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>').css('font-size', local.clockSize);
			if (local.lowerLine == 'Datum')			$('#printLowerLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>').css('font-size', local.dateSize);
			if (local.lowerLine == 'Zeitgeber')   	$('#printLowerLine').html('<span class="cd_minutes"></span><span class="cd_seconds"></span>').css('font-size', local.countdownSize);
			if (local.lowerLine == 'Textblock')   	$('#printLowerLine').html('<div class="textblock"></div>').css('font-size', local.textblockSize);
			if (local.lowerLine == 'Laufschrift') 	$('#printLowerLine').html('<div class="marquee"></div>').css('font-size', local.marqueeSize).css('animation-duration', local.marqueeSpeed).css('-webkit-animation-duration', local.marqueeSpeed);
			if (local.lowerLine == 'Aus') 		  	$('#printLowerLine').html('');
		local.preLowerLine = local.lowerLine;
		}
		$('.textblock, .marquee').html(local.message);
		$('.marquee').css('animation-duration', local.marqueeSpeed).css('-moz-animation-duration', local.marqueeSpeed).css('-webkit-animation-duration', local.marqueeSpeed);
		updateCountdown(local);
	}
	if (local.tab == 'Live' && remote.onOff == 'on') {
		if (local.preUpperLine != remote.upperLine) { // stop from keep writing text
			if (remote.upperLine == 'Uhr') 		 	$('#printUpperLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>').css('font-size', remote.clockSize);
			if (remote.upperLine == 'Datum')		$('#printUpperLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>').css('font-size', remote.dateSize);
			if (remote.upperLine == 'Zeitgeber')   	$('#printUpperLine').html('<span class="cd_minutes"></span><span class="cd_seconds"></span>').css('font-size', remote.countdownSize);
			if (remote.upperLine == 'Textblock')   	$('#printUpperLine').html('<div class="textblock"></div>').css('font-size', remote.textblockSize);
			if (remote.upperLine == 'Laufschrift') 	$('#printUpperLine').html('<div class="marquee"></div>').css('font-size', remote.marqueeSize).css('animation-duration', remote.marqueeSpeed);
			if (remote.upperLine == 'Aus') 		  	$('#printUpperLine').html('');
		local.preUpperLine = remote.upperLine;
		}
		if (local.preLowerLine != remote.lowerLine) { // stop from keep writing text
			if (remote.lowerLine == 'Uhr') 		 	$('#printLowerLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>').css('font-size', remote.clockSize);
			if (remote.lowerLine == 'Datum')		$('#printLowerLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>').css('font-size', remote.dateSize);
			if (remote.lowerLine == 'Zeitgeber')   	$('#printLowerLine').html('<span class="cd_minutes"></span><span class="cd_seconds"></span>').css('font-size', remote.countdownSize);
			if (remote.lowerLine == 'Textblock')   	$('#printLowerLine').html('<div class="textblock"></div>').css('font-size', remote.textblockSize);
			if (remote.lowerLine == 'Laufschrift') 	$('#printLowerLine').html('<div class="marquee"></div>').css('font-size', remote.marqueeSize).css('animation-duration', remote.marqueeSpeed);
			if (remote.lowerLine == 'Aus') 		  	$('#printLowerLine').html('');
		local.preLowerLine = remote.lowerLine;
		}
		$('.textblock, .marquee').html(remote.message);
		$('.marquee').css('animation-duration', remote.marqueeSpeed).css('-moz-animation-duration', remote.marqueeSpeed).css('-webkit-animation-duration', remote.marqueeSpeed);
		updateCountdown(remote);
	}
	
	if (local.tab == 'Live' && remote.onOff == 'off') {
		$('#printUpperLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>').css('font-size', '100%');
		$('#printLowerLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>').css('font-size', '50%');
		local.preUpperLine = "";
		local.preLowerLine = "";
	}
	
	if (remote.onOff == 'on' && (remote.upperLine == 'Zeitgeber' || remote.lowerLine == 'Zeitgeber') ) {
		$('#countdownControl').show();
	} else {
		$('#countdownControl').hide();
	}
	updateClock();
	
	if (local.option == 'on') { 
		$("#option").show();
	} else {
		$("#option").hide();
	}
}

function checkOption() {
	//tab
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
	
	$("#marqueeSize").val(local.marqueeSize);
	$("#marqueeSpeed").val(local.marqueeSpeed);

	$("#message").val(local.message);
	
}

function chkButton() { // check if a change exist
	if (local.upperLine 		== remote.upperLine &&
		local.lowerLine 		== remote.lowerLine &&
		local.clockSize 		== remote.clockSize &&
		local.dateSize 			== remote.dateSize &&
		local.timeout 			== remote.timeout &&
		local.countdown 		== remote.countdown &&
		local.countdownSize 	== remote.countdownSize &&
		local.countdownTimeout 	== remote.countdownTimeout &&
		local.textblockSize		== remote.textblockSize &&
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

function chkOnOff(){
	if (remote.onOff == 'on') {
		$('#switch').removeClass("grayButton");
		$('#switch').css("background-color", "#99DD55");
	} 
	if (remote.onOff == 'off') {
		$('#switch').removeClass("grayButton");
		$('#switch').css("background-color", "#FF7755");
	}
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