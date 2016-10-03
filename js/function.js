function sendDisplay(stream) {
	$.ajax({
	method: "POST",
	url: "function.php",
	data: { data: JSON.stringify(stream) }
	})
}

function getDisplay(){
	$.ajax({
	url: "data.json",
	cache: false
	})
	.done(function(response) {
		$("#error").hide();
		remote = response;
		chkOnOff();
		checkDisplay();
		chkButton();
	})
	.fail(function() {
		$("#error").show();
	});
};

function checkDisplay() {
	$("#"+local.tab).siblings().removeClass();
	$("#"+local.tab).addClass("selected");
	if ( remote.onOff == 'on' && local.tab == 'Live' && remote.mode != 'onlytext') {
		$('#displayTime').show();
		$('#displayDate').hide();
		$('#displayText').html(remote.message).removeClass().addClass(remote.mode).show();
		if (remote.mode == 'countdown') {
			updateCountdown(remote);
		} else { 
			updateClock();
		}
	}
	if ( remote.onOff == 'on' && local.tab == 'Live' && remote.mode == 'onlytext') {
		$('#displayTime').hide();
		$('#displayDate').hide();
		$('#displayText').html(remote.message).removeClass().addClass(remote.mode).show();
	}
	if ( remote.onOff == 'off' && local.tab == 'Live') {
		$('#displayTime').show();
		$('#displayText').removeClass().hide();
		$('#displayDate').show();
		updateClock();
	}

	if ( local.tab == 'Vorschau' && local.mode != 'onlytext') {
		$('#displayTime').show();
		$('#displayDate').hide();
		$('#displayText').show().html(local.message).removeClass().addClass(local.mode);
		if (local.mode == 'countdown') {
			updateCountdown(local);
		} else { 
			updateClock();
		}
	}
	if ( local.tab == 'Vorschau' && local.mode == 'onlytext') {
		$('#displayTime').hide();
		$('#displayDate').hide();
		$('#displayText').show().html(local.message).removeClass().addClass(local.mode);
	}
	
	if (local.mode == 'countdown') {
			$('#symbol').hide();
			$('#countdownMin').show();
			$('#countdownSec').show();
	} else { 
			$('#symbol').show();
			$('#countdownMin').hide();
			$('#countdownSec').hide();
	}
	
	if (local.tab == 'Setup') {
		$('.boxw').hide();
		$('#boxSetup').show();
	} else {
		$('.boxw').show();
		$('#boxSetup').hide();
	}
}

function chkButton() { // buttons to hide
	if (local.message == remote.message &&
		local.timeout == remote.timeout &&
		local.countdownTimeout == remote.countdownTimeout &&
		local.mode == remote.mode &&
		local.countdown == remote.countdown) {
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