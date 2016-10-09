function sendDisplay(stream) {
	$.ajax({
	method: "POST",
	url: "function.php",
	data: { data: JSON.stringify(stream) }
	})
}

function checkDisplayS(string) {
	if (string == 'Live')		checkDisplay(remote);
	if (string == 'Vorschau') 	checkDisplay(local);
}

function checkDisplay(object) {
	$("#"+local.tab).siblings().removeClass();
	$("#"+local.tab).addClass("selected");

	if ( local.tab == 'Vorschau' || (local.tab == 'Live' && remote.onOff == 'on')) {
		if (object.preUpperLine != object.upperLine) { // stop from keep writing text
			if (object.upperLine == 'Uhr') 		 	$('#printUpperLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>').css('font-size', object.clockSize);
			if (object.upperLine == 'Datum')		$('#printUpperLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>').css('font-size', object.dateSize);
			if (object.upperLine == 'Zeitgeber')   	$('#printUpperLine').html('<span style="height:30vw; width:30vw; margin-left:-35vw; position:absolute;"><img src="svg/stopwatch.svg" height="'+object.countdownSize+'" width="'+object.countdownSize+'"/></span><span class="cd_minutes"></span><span class="cd_seconds"></span>').css('font-size', object.countdownSize);
			if (object.upperLine == 'Textblock')   	$('#printUpperLine').html('<div class="textblock"></div>').css('font-size', object.textblockSize);
			if (object.upperLine == 'Laufschrift') 	$('#printUpperLine').html('<div class="marquee"></div>').css('font-size', object.marqueeSize);
			if (object.upperLine == 'Aus')		  	$('#printUpperLine').html('');
		object.preUpperLine = object.upperLine;
		}
		if (object.preLowerLine != object.lowerLine) { // stop from keep writing text
			if (object.lowerLine == 'Uhr') 		 	$('#printLowerLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>').css('font-size', object.clockSize);
			if (object.lowerLine == 'Datum')		$('#printLowerLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>').css('font-size', object.dateSize);
			if (object.lowerLine == 'Zeitgeber')   	$('#printLowerLine').html('<span style="height:30vw; width:30vw; margin-left:-35vw; position:absolute;"><img src="svg/stopwatch.svg" height="'+object.countdownSize+'" width="'+object.countdownSize+'"/></span><span class="cd_minutes"></span><span class="cd_seconds"></span>').css('font-size', object.countdownSize);
			if (object.lowerLine == 'Textblock')   	$('#printLowerLine').html('<div class="textblock"></div>').css('font-size', object.textblockSize);
			if (object.lowerLine == 'Laufschrift') 	$('#printLowerLine').html('<div class="marquee"></div>').css('font-size', object.marqueeSize).css('animation-duration', object.marqueeSpeed).css('-webkit-animation-duration', object.marqueeSpeed);
			if (object.lowerLine == 'Aus') 		  	$('#printLowerLine').html('');
		object.preLowerLine = object.lowerLine;
		}
		$('.textblock, .marquee').html(object.message);
		$('.marquee').css('animation-duration', object.marqueeSpeed).css('-moz-animation-duration', object.marqueeSpeed).css('-webkit-animation-duration', object.marqueeSpeed);
		updateCountdown(object);
	}
	
	if (local.tab == 'Live' && remote.onOff == 'off') {
		$('#printUpperLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>').css('font-size', '100%');
		$('#printLowerLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>').css('font-size', '50%');
		object.preUpperLine = "";
		object.preLowerLine = "";
	}
	
	if (object.upperLine == 'Zeitgeber' || object.lowerLine == 'Zeitgeber') {
		$('#countdownControl').show();
	} else {
		$('#countdownControl').hide();
	}
	updateClock();
	
	if (local.option == 'on') { // this just exists local
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