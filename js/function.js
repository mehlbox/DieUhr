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
		$("#error").show().html("Keine Verbindung");
	});
};


function checkDisplay() {	
	if ( local.tab == 'Live' ) {
		if ( remote.onOff == 'on' ) {
			$('#displayDate').hide();
			$('#displayText').html(remote.message).removeClass().addClass(remote.mode).show();
		} else {
			$('#displayText').removeClass().hide();
			$('#displayDate').show();
		}
	}

	if ( local.tab == 'Vorschau' ) {
		$('#displayDate').hide();
		$('#displayText').show().html(local.message).removeClass().addClass(local.mode);
		
	}
}

function chkButton() {
	if (local.message == remote.message && local.timer == remote.timer && local.mode == remote.mode) {
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
    d.setTime(d.getTime() + (30*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}