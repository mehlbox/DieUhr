function timeloop() {
	getDisplay(); // ajax
	chkOnOff();
	checkDisplay();
	chkButton();
	startClock();
	setTimeout("timeloop()",1000);
};

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
		remote = response;
	});
};


function checkDisplay() {	
	if ( local.tab == 'Live' ) {
		
		if ( remote.onOff == 'off' ) {
			document.getElementById('displayText').style.display = 'none';
		}
		if ( remote.onOff == 'on' ) {
			document.getElementById('displayText').style.display = 'block';
			document.getElementById('displayText').innerHTML = remote.message;
			document.getElementById('displayText').className = remote.mode;
		}
	}

	if ( local.tab == 'Vorschau' ) {
		document.getElementById('displayText').style.display = 'block';
		document.getElementById('displayText').innerHTML = local.message;
		document.getElementById('displayText').className = local.mode;
	}
}

function chkButton() {
	if (local.message == remote.message && local.timer == remote.timer && local.mode == remote.mode) {
		document.getElementById('bth').style.display = "none";
    } else {
		document.getElementById('bth').style.display = "block";
	}
}

function chkOnOff(){
	if (remote.onOff == 'on') {
		$('#switch').css("background-color", "#99DD55").css("border-radius", "25%").css("border", "solid 0.5vw black");
	} 
	if (remote.onOff == 'off') {
		$('#switch').css("background-color", "#FF7755").css("border-radius", "25%").css("border", "solid 0.5vw black");
	}
}
