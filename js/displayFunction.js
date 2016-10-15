function timeloop() {
	$.ajax({
	url: "data.json",
	cache: false
	})
	.done(function(response) {
		remote = response;
		if (remote.onOff == undefined ) { // empty file
			temp.onOff = "off";
			temp.displayChange = 0;
			sendDisplay();
		}
		timerAction();
		timerDisplay(window.parent.local);
		if (display == 'Vorschau') {
			checkDisplay(window.parent.local);
		} else {
			checkDisplay(remote);
		}
	})
	setTimeout("timeloop()",1000);
};

function timerAction(){
	if (display == 'main') {
		//////////////////// Timeout
		if (remote.onOff == 'turnOn' && remote.timeout == "inf") { temp.onOff = 'on'; sendDisplay(); }
		if (remote.onOff == 'turnOn' && remote.timeout != "inf") { // command to turn on
			temp.onOff ='on';
			temp.countdownState = "stop";
			temp.timeoutState = "runing";
			temp.timeoutEndtime = setCountdown(remote.timeout);
			sendDisplay();
		}
		if (remote.onOff == 'turnOff') {
			temp.onOff ='off';
			temp.timeoutState = "stop";
			temp.timeoutEndtime = "";
			sendDisplay();
		}
		if (remote.timeoutState == "runing") {
			var t = getTimeRemaining(remote.timeoutEndtime);
			if (t.total <= 0) {
				temp.timeoutState = "stop";
				temp.timeoutEndtime = '';
				temp.onOff = "off";
				sendDisplay();
			}
		}
		if (remote.timeoutState != "stop" && remote.onOff == "off") {
			temp.timeoutState = "stop";
			temp.timeoutEndtime = '';
			sendDisplay();
		}
		///////////// Countdown
		if (remote.countdownState == 'start') { // command to turn on
			temp.timeoutState = "stop";
			temp.timeoutEndtime = '';
			temp.countdownState = "runing";
			temp.countdownEndtime = setCountdown(remote.countdown);
			sendDisplay();
		}
		if (remote.countdownState == "runing") {
			var t = getTimeRemaining(remote.countdownEndtime);
			if (t.total == 0) {
				countdownID = setTimeout(function() { // overtime after run out of countdown
					temp.countdownState = "stop";
					temp.countdownEndtime = '';
					temp.onOff = "off";
					sendDisplay();
				}, remote.countdownTimeout * 1000);
			}
		}
		if (remote.countdownState != "stop" && remote.onOff == "off") {
			temp.countdownState = "stop";
			temp.countdownEndtime = '';
			sendDisplay();
			clearTimeout(countdownID);
		}
	}
}

function timerDisplay(object) {
	//////////////////////////////// Timeout
	if (remote.onOff == 'on' && object.onOff == 'turnOn') {
		object.onOff = 'on';
		object.timeoutState = "runing";
		object.timeoutEndtime = setCountdown(remote.timeout);
	}

	if (object.timeoutState == "runing") {
		var t = getTimeRemaining(object.timeoutEndtime);
		if (t.total <= 0) {
			object.timeoutState = "stop";
			object.timeoutEndtime = '';
		}
	}
	if (remote.onOff == "off" && object.onOff != 'off') {
		object.onOff = 'off'
		object.timeoutState = "stop";
		object.timeoutEndtime = '';
	}
	
	/////////////////// Countdown
	if (remote.countdownState == 'runing' && object.countdownState != "runing") {
		object.timeoutState = "stop";
		object.timeoutEndtime = '';
		object.countdownState = "runing";
		object.countdownEndtime = setCountdown(remote.countdown);
	}

	if (remote.countdownState == 'stop' && object.countdownState != "stop") {
		object.countdownState = "stop";
		object.countdownEndtime = '';
	}
	
	if (remote.onOff == "off" && object.onOff != 'off') {
		object.onOff = 'off'
		object.countdownState = "stop";
		object.countdownEndtime = '';
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

function urlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return '';
    }
    else{
       return results[1] || 0;
    }
}

function checkDisplay(object) {
	//console.log('Var: '+displayChange+'  Object: '+object.displayChange);
	if ( local.tab == 'Vorschau' || (local.tab == 'Live' && remote.onOff == 'on')) {
		//if (displayChange > object.displayChange) { displayChange = object.displayChange -2;}
		
		if (displayChange < object.displayChange) { // keep refresh action low --> only css
			displayChange = displayChange + 1;
			if (object.upperLine == 'Uhr') 		 	$('#printUpperLine').css('font-size', object.clockSize);
			if (object.upperLine == 'Datum')		$('#printUpperLine').css('font-size', object.dateSize);
			if (object.upperLine == 'Zeitgeber')   	$('#printUpperLine').css('font-size', object.countdownSize);
			if (object.upperLine == 'Textblock')   	$('#printUpperLine').css('font-size', object.textblockSize);
			if (object.upperLine == 'Laufschrift') 	$('#printUpperLine').css('font-size', object.marqueeSize);
			if (object.upperLine == 'Textblock' && object.textblockBorder != 'none') $('#printLowerLine').css('margin', '1vw');

			if (object.lowerLine == 'Uhr') 		 	$('#printLowerLine').css('font-size', object.clockSize);
			if (object.lowerLine == 'Datum')		$('#printLowerLine').css('font-size', object.dateSize);
			if (object.lowerLine == 'Zeitgeber')   	$('#printLowerLine').css('font-size', object.countdownSize);
			if (object.lowerLine == 'Textblock')   	$('#printLowerLine').css('font-size', object.textblockSize);
			if (object.lowerLine == 'Laufschrift') 	$('#printLowerLine').css('font-size', object.marqueeSize);
			if (object.lowerLine == 'Textblock' && object.textblockBorder != 'none') $('#printLowerLine').css('margin', '1vw');
			var afterSpan = '1';
		}
		if (displayChange < object.displayChange) { // keep refresh action low --> write all
			displayChange = object.displayChange;
			if (object.upperLine == 'Uhr') 		 	$('#printUpperLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>');
			if (object.upperLine == 'Datum')		$('#printUpperLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>');
			if (object.upperLine == 'Zeitgeber')   	$('#printUpperLine').html('<span id="stopwatch" style="height:'+object.countdownSize+'; left:0; right:'+object.countdownSize+'; position:absolute;"><img src="svg/stopwatch.svg" height="100%" /></span><span class="cd_minutes"></span><span class="cd_seconds"></span>');
			if (object.upperLine == 'Textblock' && object.textblockBorder == 'none') 		$('#printUpperLine').html('<span id="textblock"></span>');
			if (object.upperLine == 'Textblock' && object.textblockBorder == 'wedding1') 	$('#printUpperLine').html('<span style="font-weight: bold; border:solid 0.5vw red; border-radius: 10vw; padding:2vw 4vw; background: #FFDDDD; color:black; text-shadow: 0vw 0vw 1vw red; box-shadow: 0 0 5vw #FF9999;"><span style="color:red;">❤</span> <span id="textblock"></span> <span style="color:red;">❤</span></span>');
			if (object.upperLine == 'Textblock' && object.textblockBorder == 'wedding2') 	$('#printUpperLine').html('<span style="font-weight: bold; border:solid 0.5vw red;                      padding:2vw 4vw; background: #FFDDDD; color:black; text-shadow: 0vw 0vw 1vw red; box-shadow: 0 0 5vw #FF9999;"><span style="color:red;">❤</span> <span id="textblock"></span> <span style="color:red;">❤</span></span>');
			if (object.upperLine == 'Laufschrift') 	$('#printUpperLine').html('<div class="marquee"></div>');
			if (object.upperLine == 'Aus')		  	$('#printUpperLine').html('');
			if (object.upperLine == undefined)		$('#printUpperLine').html('#no data');

			if (object.lowerLine == 'Uhr') 		 	$('#printLowerLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>');
			if (object.lowerLine == 'Datum')		$('#printLowerLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>');
			if (object.lowerLine == 'Zeitgeber')   	$('#printLowerLine').html('<span id="stopwatch" style="height:'+object.countdownSize+'; left:0; right:'+object.countdownSize+'; position:absolute;"><img src="svg/stopwatch.svg" height="100%" /></span><span class="cd_minutes"></span><span class="cd_seconds"></span>');
			if (object.lowerLine == 'Textblock' && object.textblockBorder == 'none') 		$('#printLowerLine').html('<span id="textblock"></span>');
			if (object.lowerLine == 'Textblock' && object.textblockBorder == 'wedding1') 	$('#printLowerLine').html('<span style="font-weight: bold; border:solid 0.5vw red; border-radius: 10vw; padding:2vw 4vw; background: #FFDDDD; color:black; text-shadow: 0vw 0vw 1vw red; box-shadow: 0 0 5vw #FF9999;"><span style="color:red;">❤</span> <span id="textblock"></span> <span style="color:red;">❤</span></span>');
			if (object.lowerLine == 'Textblock' && object.textblockBorder == 'wedding2') 	$('#printLowerLine').html('<span style="font-weight: bold; border:solid 0.5vw red;                      padding:2vw 4vw; background: #FFDDDD; color:black; text-shadow: 0vw 0vw 1vw red; box-shadow: 0 0 5vw #FF9999;"><span style="color:red;">❤</span> <span id="textblock"></span> <span style="color:red;">❤</span></span>');
			if (object.lowerLine == 'Laufschrift') 	$('#printLowerLine').html('<div class="marquee"></div>');
			if (object.lowerLine == 'Aus') 		  	$('#printLowerLine').html('');
		}
		
		if (afterSpan == '1') {
			$('#textblock, .marquee').html(object.message);
			$('.marquee').css('animation-duration', object.marqueeSpeed).css('-moz-animation-duration', object.marqueeSpeed).css('-webkit-animation-duration', object.marqueeSpeed);
		}
		if (object.upperLine == 'Zeitgeber' || object.lowerLine == 'Zeitgeber') updateCountdown(window.parent.local);
		if (object.upperLine == 'Uhr' || object.lowerLine == 'Uhr' || object.upperLine == 'Datum' || object.lowerLine == 'Datum') updateClock();
	}
	
	if (local.tab == 'Live' && remote.onOff == 'off') {
		$('#printUpperLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>').css('font-size', '100%');
		$('#printLowerLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>').css('font-size', '50%');
		updateClock();
	}
}


// clock //////////////////////////////////

function printClock(std, min) {
		var minutes = (min<10?"0":"") + min;
		var hours = (std<10?"0":"") + std;
		$(".cl_minutes").html(":"+minutes);
		$(".cl_hours").html(hours);
}

function printDate(day, month, year) {
	switch(dateFormat) {
		case "dd.mm.yyyy":
			$(".cl_day").html(day);
			$(".cl_month").html("."+month);
			$(".cl_year").html("."+year);
			break;
		case "dd.mm.yy":
			$(".cl_day").html(day);
			$(".cl_month").html("."+month);
			//make it a string
			year +="";
			year = year.substring(2,4);
			$(".cl_year").html("."+year);	
			break;
		case "dd.mon.yyyy":
			$(".cl_day").html(day);
			$(".cl_month").html(". "+getNameMonth(month));
			$(".cl_year").html(" "+year);
			break;
	
		default:
			break;
	}
}

function getNameMonth(month) {
	months = new Array();
	months = ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
	return months[month-1];
}

function updateClock(){
	var Datum = new Date();
	var std = Datum.getHours();
	var min = Datum.getMinutes();
	var day = Datum.getDate();
	var month = Datum.getMonth()+1;
	var year = Datum.getFullYear();
	printClock(std, min);
	printDate(day, month, year);
}
	
// Countdown ///////////////////////////
function setCountdown(sec) {
	return new Date(Date.parse(new Date()) + (sec*1000));
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

function updateCountdown(object) {
	if (object.countdownState == 'runing') {
		var t = getTimeRemaining(object.countdownEndtime);
		if (t.total<0) {
			$('.cd_minutes, .cd_seconds').css("color", "#FF3333");
			t.minutes++;
			t.seconds = t.seconds*(-1);
			t.minutes = t.minutes*(-1);
			if (t.seconds==0) t.minutes++;
			if (t.seconds<10) t.seconds = '0'+t.seconds
			$('.cd_minutes').html('-' + t.minutes + ':');
			$('.cd_seconds').html(t.seconds);
		} else {
			$('.cd_minutes, .cd_seconds').css("color", "#FFFFFF");
			if (t.seconds<10) t.seconds = '0'+t.seconds
			$('.cd_minutes').html(t.minutes + ':');
			$('.cd_seconds').html(t.seconds);
		}
	} else {
		var tempSec = object.countdown%60;
			$('.cd_minutes, .cd_seconds').css("color", "#FFFFFF");
			$('.cd_minutes').html(parseInt(object.countdown/60) + ':');
			if (tempSec<10) tempSec = '0'+tempSec
			$('.cd_seconds').html(tempSec);
	}
}
