function checkDisplay() {	
	var tab   = getCookie('tab');
	var onOff = getCookie('switch');
	if ( tab == 'live' ) {
		if ( onOff == 'off' ) {
			document.getElementById('displayText').style.display = 'none';
		}
		if ( onOff == 'on' ) {
			document.getElementById('displayText').style.display = 'block';
			loadTxt('message', 'displayText');
			loadClass('mode', 'displayText');
		}
	}

	if ( tab == 'preview' ) {
		document.getElementById('displayText').style.display = 'block';
		document.getElementById('displayText').innerHTML = getCookie('message');
		document.getElementById('displayText').className = getCookie('mode');
	}
	startClock();
	chkButt();
}

function chkButt() {
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById('bth').style.display = xhttp.responseText;
    }
  };
  xhttp.open("GET", "function.php?check=1", true);
  xhttp.send();
}

function addSymbol() {
	var e = document.getElementById('symbol');
	var cvalue = e.options[e.selectedIndex].value;
	var data = getCookie('message') + cvalue;
	setText('message', 'message', data)
	checkDisplay();
}

function dropDown(cname){
	var e = document.getElementById(cname);
	var cvalue = e.options[e.selectedIndex].value;
	setCookie(cname, cvalue)
	checkDisplay();
}

function setTab(tab){
	$('#'+tab).addClass("selected");
	$('#'+tab).siblings().removeClass("selected");
	setCookie('tab', tab);
	checkDisplay();
}

function onOff(){
	var state = getCookie('switch')
	if (state == 'on') {
		$('#switch').css("background-color", "#FF7755");
		state = 'off';
	} else {
		$('#switch').css("background-color", "#99DD55");
		state = 'on';
	}
	setCookie('switch', state);
	saveVar('switch');
	checkDisplay();
}

function saveAll() {
  var xhttp;
  var message = getCookie('message');
  var timer = getCookie('timer');
  var mode  = getCookie('mode');
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
		   document.getElementById('error').innerHTML = xhttp.responseText;
      }
  };
  xhttp.open('GET', 'function.php?message='+message+'&timer='+timer+'&mode='+mode, true);
  xhttp.send();
  checkDisplay();
}


function saveVar(cname) {
  var xhttp;
  var cvalue
  cvalue = getCookie(cname);
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
	   if (this.readyState == 4 && this.status == 200) {
		   var dump = xhttp.responseText;
      }
  };
  xhttp.open('GET', 'function.php?'+cname+'='+cvalue, true);
  xhttp.send();
}

function setText(cname, id, data) {
    document.getElementById(id).value = data;
	setCookie(cname, data);
}

function loadClass(cname, id) {
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById(id).className = xhttp.responseText;
    }
  };
  xhttp.open("GET", "data/"+cname+".txt", true);
  xhttp.send();
}

function loadTxt(cname, id) {
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById(id).innerHTML = xhttp.responseText;
    }
  };
  xhttp.open("GET", "data/"+cname+".txt", true);
  xhttp.send();
}

function reLoadVar() {
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById('message').value = xhttp.responseText;
	  setCookie('message', xhttp.responseText, 1)
    }
  };
  xhttp.open("GET", "data/message.txt", true);
  xhttp.send();
  checkDisplay();
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

function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
	checkDisplay();
}