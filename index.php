<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>DieUhr</title>
<link href="design.css" rel="stylesheet">
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/clock.js"></script>
</head>
<body onload="startClock(true)">
<form method="post" action="">
	<div class="button" style="float: right;">
		<button id="switch" type="button" onclick="onOff()"><img src="svg/OnOff.svg" ></button>
	</div>
	<div class="button" style="float: right; margin-right: 2vw;">
		<button type="sumit" style="background-color:#FFFF66; "><img src="svg/refresh.svg" ></button>
	</div>
<ul class="tabrow">
  <li id="preview"><input type="button" name="tab" value="Vorschau" onclick="setTab('preview')" /></li>
  <li id="live"   ><input type="button" name="tab" value="Live"     onclick="setTab('live')" /></li>
</ul>
	<div class="boxw" style="margin-top: 0;">
		<div id="clock">
		<span class="the_clock">
			<span class="cl_hours"></span><span class="cl_minutes"></span>
		</span>
<div id="displayText"></div>
			<span class='the_date'>
				<span class='cl_day'></span><span class='cl_month'></span><span class='cl_year'></span>
			</span>

		</div>	
	</div>	
	<div class="boxw">
		<div style="margin:0; padding:0 1vw; float: left;">
			<select id="mode" name="mode" style="width: 43.5vw;" onchange="dropDown('mode')">
				<option value="marquee"   >Laufschrift</option>
				<option value="textblock" >Textblock</option>
			</select>
			<select id="timer" name="timer" style="width: 20vw;" onchange="dropDown('timer')">
				<option value="60"  >1 Min</option>
				<option value="180" >3 Min</option>
				<option value="300" >5 Min</option>
				<option value="600" >10Min</option>
				<option value="inf" >&#8734;</option> //infinity
			</select>
			<select id="symbol" name="symbol" style="width: 20vw;" onchange="addSymbol()">
				<option value="" >&#10047;&#10084;&#10017;</option>
				<option value="&#10047;" >&#10047;</option>
				<option value="&#10049;" >&#10049;</option>
				<option value="&#10084;" >&#10084;</option>
				<option value="&#10082;" >&#10082;</option>
				
				<option value="&#10017;" >&#10017;</option>
				<option value="&#10032;" >&#10032;</option>
				<option value="&#10038;" >&#10038;</option>
				<option value="&#10039;" >&#10039;</option>
				
				<option value="&#937;"  >&#937; </option>
				<option value="&#9986;" >&#9986;</option>
				<option value="&#9990;" >&#9990;</option>
				<option value="&#9993;" >&#9993;</option>
				
				<option value="&#10003;">&#10003;</option>
				<option value="&#10007;">&#10007;</option>
				<option value="&#8635;" >&#8635; </option>
				<option value="&#10132;">&#10132;</option>
			</select>		
		</div>
		<textarea id="message" name="message" rows="" cols="" onchange="setCookie('message', this.value)"></textarea>

		<div class="button" style="float: left;">
			<button type="button" style="background-color:#FFFF66;" onclick="setText('message', 'message', 'Das Lied Nr: ')"><img src="svg/doc.svg"></button>
		</div>
		<div class="button" style="float: left;">
			<button type="button" style="background-color:#FFFF66" onclick=""><img src="svg/save.svg"></button>
		</div>
		<div class="button" style="float: left;">
			<button type="button" style="background-color:#FFFF66;" onclick="setText('message', 'message', '')"><img src="svg/delete.svg"></button>
		</div>
		<div id="bth" style="margin:0; padding:0;">
		<div class="button" style="float: left;">
			<button type="button" style="background-color:#FF7755;" onclick="reLoadVar()"><img src="svg/back.svg" ></button>
		</div>
		<div class="button" style="float: left;">
			<button type="button" style="background-color:#99DD55;" onclick="saveAll()"><img src="svg/done.svg"></button>
		</div>
		</div>
	</div>
	<div id="error"></div>
</form>
<script type="text/javascript" src="js/function.js"></script>
<script>
chkOnOff();

if (getCookie('tab')    == '') 	setCookie('tab',    'preview');
if (getCookie('mode')   == '') 	setCookie('mode',   'textblock');
if (getCookie('timer')  == '') 	setCookie('timer',  '180');

var tab = getCookie('tab');
	$('#'+tab).addClass("selected");

var mode = getCookie('mode');
	$("#mode").val(mode).change();
	
var timer = getCookie('timer');
	$("#timer").val(timer).change();

var message = getCookie('message');
	setText('message', 'message', message);
checkDisplay();
</script>
</body>
</html>