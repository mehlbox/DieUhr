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
<script type="text/javascript">
function formSubmit() {
    document.getElementById("test").submit();
}
</script>
<style>
body {
	background-color: #FFFFFF;
	font-size: 5vw;
}
div {
	background-color: #EAEAEA;
	padding: 1vw
	margin: 1vw;
	-webkit-border-radius: 2vw;
}
input, select {
	font-size: 5vw;
	padding: 2vw;
	margin: 1vw;
	border: solid 0.1vw #000000;
	-webkit-border-radius: 2vw;
	-webkit-box-shadow: #555555 0.5vw 0.5vw 0.5vw;
	background-image: -webkit-linear-gradient(top, #C5C5C5, #fdfdfd);
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
	-webkit-border-radius: 0;
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
	background-color: #000000;
	-webkit-border-radius: 0;
}
.simple {
	font-size: 25%;
	line-height: 1em;
	height: 2em;
	position: relative;
	overflow: hidden;
	white-space: pre;
	background-color: #000000;
	-webkit-border-radius: 0;
}
textarea {
	width: 95%;
	font-size: 5vw;
	background-color:#FFFF66; 
	border: 0.3vw solid #000000;
	padding: 1vw;
	margin: 1vw;
}
</style>
</head>
<body onload="startClock(true)">
<form method="post" >
<?php if (file_get_contents($mode) != 'wedding') { ?>
	<div class="boxw"><?php if (file_get_contents($preview)) { echo 'Vorschau:'; } else { echo 'Live Ansicht:'; } ?>
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
<?php
if (file_get_contents($preview)) {
        echo '<input type="submit" name="preview_off" value="zur Live Ansicht wechseln" style="width: 87vw;" />';
} else {
        echo '<input type="submit" name="preview_on"  value="zur Vorschau wechseln"     style="width: 87vw;" />';
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
	<div class="boxw">Vorschau nicht verfügbar.
	</div>
	<div class="boxw">Namen Brautpaar:
			<textarea name="message"><?php echo $formtext; ?></textarea>
			<input type="submit" name="save"  value="speichern" />
			<input type="submit" name="del"   value="löschen" />
	</div>
<?php } ?>

	<div class="box">Anzeigemodus:
			<select name="mode" style="width: 39vw;" onchange="if(this.value != 0) this.form.submit();">
				<option value="marquee"        <?php if (file_get_contents($mode) == 'marquee')        echo 'selected="selected"'; ?> >Laufschrift</option>
				<option value="textblock"      <?php if (file_get_contents($mode) == 'textblock')      echo 'selected="selected"'; ?> >Textblock</option>
				<option value="wedding"        <?php if (file_get_contents($mode) == 'wedding')        echo 'selected="selected"'; ?> >Hochzeit</option>
				<!--<option value="largetextblock" <?php if (file_get_contents($mode) == 'largetextblock') echo 'selected="selected"'; ?> >Text + keine Uhr</option>-->
			</select>
	</div>
	<div class="box">Status:
<?php
if (file_get_contents($status)) {
        echo '
		<div style="background-color: #99DD55; padding: 1vw; text-align:center;">EIN</br>
		<input type="submit" name="status_off" value="ausschalten" style="width: 37vw;" /></div>';
} else {
        echo '
		<div style="background-color: #FF7755; padding: 1vw; text-align:center;">AUS</br>
		<input type="submit" name="status_on"  value="einschalten" style="width: 37vw;" /></div>';
} ?>
	</div>
</form>
</body>
</html>
<!--
<?php echo shell_exec('bash '.$_SERVER['DOCUMENT_ROOT'].'/refresh.sh 2>&1'); ?>
-->
