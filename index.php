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

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>DieUhr</title>
<script type="text/javascript" src="js/clock.js"></script>
<script type="text/javascript" src="js/jquery.js"></script>
<style type="text/css">
body {
	background-color: #DDDDDD;
	font-size: 5vw;
	font-family:Verdana,sans-serif;
}
div div {
	padding: 2vw 1vw;
	margin: 2vw 1vw;
}
input, select {
	font-size: 5vw;
	padding: 2vw;
	margin: 1vw;
}
textarea {
	width: 95%;
	font-size: 5vw;
	background-color:#FFFF66; 
	border: 0.3vw solid #000000;
	padding: 1vw;
	margin: 1vw;
}
.box, .boxw{
	float: left;
	margin: 3vw 0 0 1.5vw;
	padding: 2vw;
	box-sizing: border-box;
	background-color: #FFFFFF;
	background-image: -webkit-linear-gradient(top, #FFFFFF, #AAAAAA);
	background-image: -moz-linear-gradient(top, #FFFFFF, #AAAAAA);
	background-image: -ms-linear-gradient(top, #FFFFFF, #AAAAAA);
	background-image: -o-linear-gradient(top, #FFFFFF, #AAAAAA);
	background-image: linear-gradient(top, #FFFFFF, #AAAAAA);
	-webkit-box-shadow: 1vw 1vw 1vw 0 #999999;
	-moz-box-shadow: 1vw 1vw 1vw 0 #999999;
    box-shadow: 1vw 1vw 1vw 0 #999999;
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
	color:#FFFFFF;
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
	0%   { text-indent:  100vw }
	100% { text-indent: -300vw }
}
.marquee {
	font-size: 60%;
	position: relative;
	overflow: hidden;
	white-space: nowrap;
	background-color: #000000;
	-webkit-animation: marquee 15s linear infinite;
	-moz-animation: marquee 15s linear infinite;
	animation: marquee 15s linear infinite;
}
.simple {
	font-size: 25%;
	line-height: 1em;
	height: 2em;
	position: relative;
	overflow: hidden;
	white-space: pre;
	background-color: #000000;
}

.tabrow {
  margin: 0;
  overflow: hidden;
}
.tabrow li {
  border-radius: 3vw 3vw 0 0;
  margin: 3vw 3vw 0 0;
  border:solid 1px #CCCCCC;
  background: #CCCCCC;
  display: inline-block;
  -webkit-box-shadow: 1vw 1vw 1vw 0 #999999;
  -moz-box-shadow: 1vw 1vw 1vw 0 #999999;
  box-shadow: 1vw 1vw 1vw 0 #999999;
}
.tabrow input {
  background: transparent;
  margin: 0 2vw;
  padding: 2vw;
  border:0;
  
}
.tabrow li.selected {
 border:solid 1px #FFFFFF;
 background: #FFFFFF;
}

.ref a{
  float: right;
  font-size: 2em;
  display: block;
  text-decoration: none;
  background-color: #f7f7f7;
  color: #000000;
  width: 12vw;
  height: 12vw;
  line-height: 12vw;
  text-align: center;
  border-radius: 20%;
  -webkit-box-shadow: 0.5vw 0.5vw 0.5vw 0 #999999;
  -moz-box-shadow: 0.5vw 0.5vw 0.5vw 0 #999999;
  box-shadow: 0.5vw 0.5vw 0.5vw 0 #999999;
  margin-right: 3vw;
}
</style>
</head>
<body onload="startClock(true)">
	<div class="ref"><a href="">&#8635</a>
    </div>
<form method="post" action="">
<ul class="tabrow">
  <li <?php if (file_get_contents($preview) ) echo 'class="selected"'; ?>><input type="submit" name="preview_on"  value="Vorschau" /></li>
  <li <?php if (!file_get_contents($preview)) echo 'class="selected"'; ?>><input type="submit" name="preview_off" value="Live"     /></li>
</ul>

<?php if (file_get_contents($mode) != 'wedding') { ?>
	<div class="boxw" style="margin-top: 0;">
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
	</div>	
<?php } ?>

<?php if (file_get_contents($mode) != 'wedding') { ?>
	<div class="boxw">Eingabe:
			<textarea name="message" rows="" cols=""><?php echo $formtext; ?></textarea>
			<input type="submit" name="save"  value="speichern" />
			<input type="submit" name="del"   value="löschen" />
			<input type="submit" name="reset" value="Das Lied ..." />
	</div>
<?php } else { ?>
	<div class="boxw" style="margin-top: 0;">
		<div id="clock">
			<div class='simple'>Ansicht nicht verfügbar.</div>
		</div>
	</div>
	<div class="boxw">Namen Brautpaar:
			<textarea name="message" rows="" cols=""><?php echo $formtext; ?></textarea>
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
		<div style="background-color: #99DD55; text-align: center;">EIN
		<input type="submit" name="status_off" value="ausschalten" style="width: 36vw;" /></div>';
} else {
        echo '
		<div style="background-color: #FF7755; text-align: center;">AUS
		<input type="submit" name="status_on"  value="einschalten" style="width: 36vw;" /></div>';
} ?>
	</div>
</form>
</body>
</html>
<?php echo '<!--'.shell_exec('bash '.$_SERVER['DOCUMENT_ROOT'].'/refresh.sh 2>&1').'-->'; ?>
