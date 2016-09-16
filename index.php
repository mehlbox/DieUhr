<?php
$status  = $_SERVER['DOCUMENT_ROOT'].'/data/status.inf';
$preview = $_SERVER['DOCUMENT_ROOT'].'/data/preview.inf';
$mode    = $_SERVER['DOCUMENT_ROOT'].'/data/mode.inf';

if (!empty($_POST['mode'] )) file_put_contents($mode, $_POST['mode'] ); // modus

if (file_get_contents($mode) == 'wedding') {
	$file = $_SERVER['DOCUMENT_ROOT'].'/data/wedding.txt';
} else {
	$file = $_SERVER['DOCUMENT_ROOT'].'/data/message.txt';
}

if (!empty($_POST['status_off']  )) file_put_contents($status, FALSE);
if (!empty($_POST['status_on']   )) file_put_contents($status, TRUE);
if (!empty($_POST['preview_off'] )) file_put_contents($preview, FALSE);
if (!empty($_POST['preview_on']  )) file_put_contents($preview, TRUE);

if (!empty($_POST['save'])) file_put_contents($file, $_POST['message']); // speichern
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
	font-size: 5vw;
}
div {
	background-color: #DDDDDD;
	padding: 1vw
	margin: 1vw;
}
div div{
	background-color: #000000;
}
input {
	font-size: 5vw;
	padding: 2vw;
	margin: 1vw;
}
.box, .boxw{
	float: left;
	margin: 1vw;
	padding: 2vw;
	border: solid 2px #737373;
	-webkit-border-radius: 3vw;
	-webkit-box-shadow: #B3B3B3 1vw 1vw 1vw;
	box-sizing: border-box;
	
}
.box {
	width: 46vw;
}
.boxw {
	width: 94vw;
}
#clock {
    height:45vw;
    width: 80vw;
	margin: auto;
    background-color: black;
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
<form method="post" >
<?php if (file_get_contents($mode) != 'wedding') { ?>
	<div class="boxw">Ansicht:
		<div id="clock">
		<span class="the_clock">
			<span class='cl_hours'></span><span class='cl_minutes'></span>
		</span>
<?php
if ((file_get_contents($status) || file_get_contents($preview)) && file_get_contents($mode) == 'marquee') {
	echo "<div class='marquee'>".file_get_contents($file)."</div>";
}

if ((file_get_contents($status) || file_get_contents($preview)) && file_get_contents($mode) == 'textblock') {
	echo "<div class='simple'>".file_get_contents($file)."</div>";
}

if (!file_get_contents($status) && !file_get_contents($preview)) {
	echo "<span class='the_date'><span class='cl_day'></span><span class='cl_month'></span><span class='cl_year'></span></span>";
}
?>
		</div>
		</br>
<?php
if (file_get_contents($preview)) {
        echo '
		<div style="background-color: #99DD55; border: 0; padding: 1vmin;"><input type="submit" name="preview_off" value="umschalten" />Vorschau</div>';
} else {
        echo '
		<div style="background-color: #FF7755; border: 0; padding: 1vmin;"><input type="submit" name="preview_on"  value="umschalten" />Live Anzeige</div>';
} ?>	
	</div>	
<?php } ?>

<?php if (file_get_contents($mode) != 'wedding') { ?>
	<div class="boxw">Eingabe:
			<textarea name="message"><?php echo $formtext; ?></textarea>
			<input type="submit" name="save"  value="speichern" />
			<input type="submit" name="del"   value="löschen" />
			<input type="submit" name="reset" value="Das Lied ..." />
	</div>
<?php } else { ?>
	<div class="boxw">Ansicht nicht verfügbar.
	</div>
	<div class="boxw">Namen Brautpaar:
			<textarea name="message"><?php echo $formtext; ?></textarea>
			<input type="submit" name="save"  value="speichern" />
			<input type="submit" name="del"   value="löschen" />
	</div>
<?php } ?>

	<div class="box">Modus:
		<div style="background-color: #999999; border: 0; padding: 1vmin;">
			<select name="mode" style="font-size: 5vw; border: 0; padding: 1vmin; margin: 2%; width: 95%;">
				<option value="marquee"        <?php if (file_get_contents($mode) == 'marquee')        echo 'selected="selected"'; ?> >Laufschrift</option>
				<option value="textblock"      <?php if (file_get_contents($mode) == 'textblock')      echo 'selected="selected"'; ?> >Textblock</option>
				<option value="wedding"        <?php if (file_get_contents($mode) == 'wedding')        echo 'selected="selected"'; ?> >Hochzeit</option>
				<!--<option value="largetextblock" <?php if (file_get_contents($mode) == 'largetextblock') echo 'selected="selected"'; ?> >Text + keine Uhr</option>-->
			</select>
			<input type="submit" value="OK" />
		</div>
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
</form>
</body>
</html>
<!--
<?php echo shell_exec('bash '.$_SERVER['DOCUMENT_ROOT'].'/refresh.sh 2>&1'); ?>
-->
