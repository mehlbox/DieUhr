function displayCheck() {	
var xhttp;
var chkOnOff
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
		chkOnOff = xhttp.responseText;
		if (chkOnOff == 'on') {
			document.getElementById('displayText').style.display = 'block';
			loadTxt('message', 'displayText');
			loadClass('mode',  'displayText');
		} else {
			document.getElementById('displayText').style.display = 'none';
		}
		setCookie('switch', chkOnOff);
    }
  };
  xhttp.open("GET", "data/switch.txt", true);
  xhttp.send();
  startClock();
  setTimeout("displayCheck()",1000);
}

function chkOnOff(){

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
}
