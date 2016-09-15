<?php
$file   = $_SERVER['DOCUMENT_ROOT'].'/data/message.txt';
$status = $_SERVER['DOCUMENT_ROOT'].'/data/status.inf';
$marquee = $_SERVER['DOCUMENT_ROOT'].'/data/marquee.inf';
$preview = $_SERVER['DOCUMENT_ROOT'].'/data/preview.inf';


if (!empty($_POST['save'])) file_put_contents($file, $_POST['message']); // speichern

if (!empty($_POST['status_off'] )) file_put_contents($status, FALSE);
if (!empty($_POST['status_on']  )) file_put_contents($status, TRUE);
if (!empty($_POST['marquee_off'] )) file_put_contents($marquee, FALSE);
if (!empty($_POST['marquee_on']  )) file_put_contents($marquee, TRUE);
if (!empty($_POST['preview_off'] )) file_put_contents($preview, FALSE);
if (!empty($_POST['preview_on']  )) file_put_contents($preview, TRUE);

$formtext = file_get_contents($file);
if (!empty($_POST['reset'])) $formtext = "Das Lied Nr.: ";
if (!empty($_POST['del'])) $formtext = "";

header( "refresh:120;url=/" );
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<script type="text/javascript" src="js/clock.js"></script>
<script type="text/javascript" src="js/jquery.js"></script>
<style>
body {
	background-color: #FFFFFF;
	font-size: 5vmin;
}
div {
	background-color: #DDDDDD;
	padding: 1vmin
	margin: 1vmin;
}
div div{
	background-color: #000000;
}
input {
	font-size: 5vmin;
	padding: 2vmin;
	margin: 1vmin;
}
.box {
	float: left;
	width: 48%;
	margin-right: 2%;
	margin-top: 2%;
	padding: 2%;
	box-sizing: border-box;
}
.boxw {
	float: left;
	width: 94%;
	margin-right: 2%;
	margin-top: 2%;
	padding: 2%;

}
#clock {
    height:45vw;
    width: 80vw;
	margin: auto;
    background-color: black;
    top: 0; left: 0; bottom: 0; right: 0;
	font-family:Verdana,sans-serif;color:#FFFFFF;
	text-align:center;
	display:block;
	font-size: 21vw;
}
.the_clock {
	font-size:100%;
}
.the_date {
	font-size:50%;
}
@-webkit-keyframes marquee {
 0%   { text-indent: 100vw }
 100% { text-indent: -300vw }
}
.marquee {
	font-size: 60%;
	position: relative;
	overflow: hidden;
	white-space: nowrap;
	-webkit-animation: marquee 15s linear infinite;
}
.simple {
	font-size: 25%;
	line-height: 1em;
	height: 2em;
	position: relative;
	overflow: hidden;
	white-space: pre;
}
textarea {
	width: 95%;
	font-size: 5vmin;
	background-color:#FFFF66; 
	border: 2pt solid #000000;
	padding: 1vmin;
	margin: 1vmin;
}
</style>
</head>
<body onload="startClock(true)">
<form action="/" method="post" >
	<div class="boxw">
		<div id="clock">
		<span class="the_clock">
			<span class='cl_hours'></span><span class='cl_minutes'></span>
		</span>
<?php
if ((file_get_contents($status) || file_get_contents($preview)) && file_get_contents($marquee)) {
	echo "<div class='marquee'>".file_get_contents($file)."</div>";
}

if ((file_get_contents($status) || file_get_contents($preview)) && !file_get_contents($marquee)) {
	echo "<div class='simple'>".file_get_contents($file)."</div>";
}

if (!file_get_contents($status) && !file_get_contents($preview)) {
	echo "<span class='the_date'><span class='cl_day'></span><span class='cl_month'></span><span class='cl_year'></span></span>";
}
?>
		</div>
		Anzeige Modus:
<?php
if (file_get_contents($preview)) {
        echo '
		<div style="background-color: #99DD55; border: 0; padding: 1vmin;"><input type="submit" name="preview_off" value="umschalten" />Vorschau</div>';
} else {
        echo '
		<div style="background-color: #FF7755; border: 0; padding: 1vmin;"><input type="submit" name="preview_on"  value="umschalten" />Live Anzeige</div>';
} ?>
	
	
	
	</div>
	<div class="box">Status:
<?php
if (file_get_contents($status)) {
        echo '
		<div style="background-color: #99FF55; border: 0; padding: 1vmin; ">EIN</br>
		<input type="submit" name="status_off" value="ausschalten" /></div>';
} else {
        echo '
		<div style="background-color: #FF9955; border: 0; padding: 1vmin; ">AUS</br>
		<input type="submit" name="status_on"  value="einschalten" /></div>';
} ?>
	</div>
	<div class="box">Animation:
<?php
if (file_get_contents($marquee)) {
        echo '
		<div style="background-color: #9999FF; border: 0; padding: 1vmin;">Laufschrift</br>
		<input type="submit" name="marquee_off" value="umschalten" /></div>';
} else {
        echo '
		<div style="background-color: #9999DD; border: 0; padding: 1vmin;">Statisch</br>
		<input type="submit" name="marquee_on"  value="umschalten" /></div>';
} ?>
	</div>
	<div class="box">Meine Ansicht:
		<div style="background-color: #999999; border: 0; padding: 1vmin;">
		</br>
		<input type="submit" value="aktualisieren" />
		</div>
	</div>
	<div class="boxw">Eingabe:
			<textarea name="message"><?php echo $formtext; ?></textarea>
			<input type="submit" name="save"  value="speichern" />
			<input type="submit" name="reset" value="zurücksetzen" />
			<input type="submit" name="del"   value="löschen" />
	</div>
</form>
</body>
</html>
<!--
<?php echo shell_exec('bash '.$_SERVER['DOCUMENT_ROOT'].'/refresh.sh 2>&1'); ?>
-->
