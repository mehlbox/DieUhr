function timeloop() {
	if (window.frameElement) {
	  // in frame
		if (local.tab == 'Live' || selectDisplay == 'Live') { 
			checkDisplay(remote);
		} else {
			checkDisplay(local);
		}
		$('#error').hide();
	setTimeout("timeloop()",1000);
	} else {
	  // independent, not in frame
		$.ajax({
		url: "function.php",
		cache: false
		})
		.done(function(response) {
			remote = response;
			checkDisplay(remote);
			$('#error').hide();
		})
		.fail(function() { // fall back if no conection
			remote.timestamp = Math.round(new Date / 1000);
			remote.onOff = "off";
			remote.displayChange = 0;
			checkDisplay(remote);
			$('#error').show().html('Keine Verbindung zum Server ! Fernsteuerung nicht möglich.');
			console.error("Keine Verbindung zum Server!");
		})
	setTimeout("timeloop()",1000);
	}
	checkTimeout();
};

function showTimer(total){
	var seconds = Math.floor(total % 60);
	var minutes = Math.floor((total / 60) % 60);
	seconds = Math.abs(seconds);
	minutes = Math.abs(minutes);
	if (total<0) { minutes--; minutes = '-'+minutes }
	if (seconds<10) seconds = '0'+seconds
	return minutes+':'+seconds
}

function checkTimeout(){
	var remaining = remote.timeoutTimestamp - remote.timestamp;
	if (remote.onOff == 'on' && remaining <= 0 && remote.timeout != 'inf' ) {
		temp.onOff ='off';
		temp.countdownState = 'stop';
		temp.displayChange = remote.displayChange+1;
		sendDisplay();
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
	if (local.displayChange == undefined) local.displayChange = 1;
	if (remote.displayChange == undefined) remote.displayChange = 2;
	if ( local.tab == 'Vorschau' || (local.tab == 'Live' && remote.onOff == 'on')) {
		if (displayChange != object.displayChange) { // keep refresh action low
			//console.log('Var: '+displayChange+'  Object: '+object.displayChange+' '+local.tab);
			displayChange = object.displayChange;

			if (object.upperLine == 'clock') 	$('#printUpperLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>');
			if (object.upperLine == 'date')		$('#printUpperLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>');
			if (object.upperLine == 'countdown')$('#printUpperLine').html('<div class="stopwatch" style="background-size:'+object.countdownSize+';"></div><span class="countdown"></span>');
			if (object.upperLine == 'textarea' && object.textblockBorder == 'none') 		$('#printUpperLine').html('<span id="textblock"></span>');
			if (object.upperLine == 'textarea' && object.textblockBorder == 'wedding1') 	$('#printUpperLine').html('<span class="wedding1"><span style="color:red;">❤</span> <span id="textblock"></span> <span style="color:red;">❤</span></span>');
			if (object.upperLine == 'textarea' && object.textblockBorder == 'wedding2') 	$('#printUpperLine').html('<span class="wedding2"><span style="color:red;">❤</span> <span id="textblock"></span> <span style="color:red;">❤</span></span>');
			if (object.upperLine == 'marquee') 	$('#printUpperLine').html('<div class="marquee"></div>');
			if (object.upperLine == 'off')		$('#printUpperLine').html('');
			

			if (object.lowerLine == 'clock') 	$('#printLowerLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>');
			if (object.lowerLine == 'date')		$('#printLowerLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>');
			if (object.lowerLine == 'countdown')$('#printLowerLine').html('<div class="stopwatch" style="background-size:20vw;"></div><span class="countdown"></span>');
			if (object.lowerLine == 'textarea' && object.textblockBorder == 'none') 		$('#printLowerLine').html('<span id="textblock"></span>');
			if (object.lowerLine == 'textarea' && object.textblockBorder == 'wedding1') 	$('#printLowerLine').html('<span class="wedding1"><span style="color:red;">❤</span> <span id="textblock"></span> <span style="color:red;">❤</span></span>');
			if (object.lowerLine == 'textarea' && object.textblockBorder == 'wedding2') 	$('#printLowerLine').html('<span class="wedding2"><span style="color:red;">❤</span> <span id="textblock"></span> <span style="color:red;">❤</span></span>');
			if (object.lowerLine == 'marquee') 	$('#printLowerLine').html('<div class="marquee"></div>');
			if (object.lowerLine == 'off') 		$('#printLowerLine').html('');
			
			/*
			if (object.upperLine == 'clock') 	$('#printUpperLine').css('font-size', object.clockSize);
			if (object.upperLine == 'date')		$('#printUpperLine').css('font-size', object.dateSize);
			if (object.upperLine == 'countdown')$('#printUpperLine').css('font-size', object.countdownSize);
			if (object.upperLine == 'textarea') $('#printUpperLine').css('font-size', object.textblockSize);
			if (object.upperLine == 'marquee') 	$('#printUpperLine').css('font-size', object.marqueeSize);
			if (object.upperLine == 'textarea' && object.textblockBorder != 'none') $('#printUpperLine').css('margin', '1vw');

			if (object.lowerLine == 'clock') 	$('#printLowerLine').css('font-size', object.clockSize);
			if (object.lowerLine == 'date')		$('#printLowerLine').css('font-size', object.dateSize);
			if (object.lowerLine == 'countdown')$('#printLowerLine').css('font-size', object.countdownSize);
			if (object.lowerLine == 'textarea') $('#printLowerLine').css('font-size', object.textblockSize);
			if (object.lowerLine == 'marquee') 	$('#printLowerLine').css('font-size', object.marqueeSize);
			if (object.lowerLine == 'textarea' && object.textblockBorder != 'none') $('#printLowerLine').css('margin', '1vw');
			*/
			
			$('#textblock, .marquee').html(object.message);
			$('.marquee').css('animation-duration', object.marqueeSpeed).css('-moz-animation-duration', object.marqueeSpeed).css('-webkit-animation-duration', object.marqueeSpeed);
		}
		if (object.upperLine == 'countdown' || object.lowerLine == 'countdown') {
		var total = remote.timeoutTimestamp - remote.timestamp - remote.countdownTimeout
			if (remote.countdownState == 'start') {
				$('.countdown').html(showTimer(total));
				if(total<0) {
					$('.countdown').css('color', '#EE0000');
				} else {
					$('.countdown').css('color', '#FFFFFF');
				}
			} else {
				$('.countdown').html(showTimer(remote.countdown)).css('color', '#FFFFFF');
			}
		}
	}
	
	if (local.tab == 'Live' && remote.onOff == 'off') {
		if (displayChange != object.displayChange) { // keep refresh action low
			displayChange = object.displayChange;		
			$('#printUpperLine').html('<span class="cl_hours"></span><span class="cl_minutes"></span>');//.css('font-size', '100%');
			$('#printLowerLine').html('<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>');//.css('font-size', '50%');
		}
	}
	updateClock();
	$('#center').bigtext({ maxfontsize: 600 }); //auto font-size
	//if (object.upperLine == 'marquee') 	$('#printUpperLine').css('font-size', object.marqueeSize); //overwrite auto font-size
	//if (object.lowerLine == 'marquee') 	$('#printLowerLine').css('font-size', object.marqueeSize); //overwrite auto font-size
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
			year +=""; //make it a string
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
	var Datum 	= new Date(remote.timestamp * 1000);
	var std 	= Datum.getHours();
	var min 	= Datum.getMinutes();
	var day 	= Datum.getDate();
	var month 	= Datum.getMonth()+1;
	var year 	= Datum.getFullYear();
	printClock(std, min);
	printDate(day, month, year);
}
