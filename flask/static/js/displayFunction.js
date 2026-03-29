function timeloop() {
	if (window.frameElement) {
	  // in frame
		if (local.tab == 'Live' || selectDisplay == 'Live') { 
			checkDisplay(remote);
			//console.log("frame remote");
		} else {
			checkDisplay(local);
			//console.log("frame local");
		}
		$('#error').hide();
	setTimeout("timeloop()",1000);
	} else {
	  // independent, not in frame
		$.ajax({
		url: "main",
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
	var payload = $.extend({}, temp);
	payload.baseVersion = remote.stateVersion || 0;
	temp = { };

	$.ajax({
	method: "POST",
	url: "main",
	data: { data: JSON.stringify(payload) }
	})
	.done(function(response) {
		remote = response;
	})
	.fail(function(xhr) {
		if (xhr.status === 409 && xhr.responseJSON) {
			remote = xhr.responseJSON;
		}
	});
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

			const html_code = {
				clock 		: '<span class="cl_hours"></span><span class="cl_minutes"></span>',
				date 		: '<span class="cl_day"></span><span class="cl_month"></span><span class="cl_year"></span>',
				countdown 	: '<span class="stopwatch"></span><span class="countdown"></span>',
				textarea 	: '<span id="textblock"></span>',
				off 		: ''
			}

			$('#printUpperLine').html(html_code[object.upperLine]);
			$('#printLowerLine').html(html_code[object.lowerLine]);
						
			$('#textblock').html(object.message);
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
