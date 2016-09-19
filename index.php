<?php
$modeF    = $_SERVER['DOCUMENT_ROOT'].'/data/mode.inf';
$statusF  = $_SERVER['DOCUMENT_ROOT'].'/data/status.inf';
$messageF = $_SERVER['DOCUMENT_ROOT'].'/data/message.txt';

if (!empty($_GET['notaus'])) {
	file_put_contents($statusF, 'ausschalten');
	header("location: index.php");
}

// for new clients
if (empty($_COOKIE['mode'])) { setcookie('mode', 'marquee', time()+(3600*24)); $_COOKIE['mode'] = 'marquee'; }                    
if (empty($_COOKIE['tab']))  { setcookie('tab', 'Vorschau', time()+(3600*24)); $_COOKIE['tab']  = 'Vorschau';}                           


								$status  = file_get_contents($statusF);  // on, off, send again
								$mode    = $_COOKIE['mode'];
								$tab     = $_COOKIE['tab'];     // selected tab
if (isset($_COOKIE['message'])){$message = $_COOKIE['message'];} else {$message = NULL;} // message only if exists

if (!empty($_POST['del'])) { //empty textarea
	$_POST['message'] = NULL;
	$message = NULL;
	setcookie('message', NULL, time()-3600);
}  

if (!empty($_POST['reset'])) { //reset textarea
	$_POST['message'] = 'Das Lied Nr.: ';
}

if (!empty($_POST['message'] )) { //new message
	$message = $_POST['message'];
	setcookie('message', $message, time()+(3600*24));
}

if (!empty($_POST['mode'] )) { // switch text kind
	$mode = $_POST['mode'];
	setcookie('mode', $mode, time()+(3600*24));
}

if (!empty($_POST['save']) && $status != 'ausschalten' ) { // message has been saved anyway. actual function is to turn on again if not off
	$status = 'einschalten';
	file_put_contents($statusF, $status);
	file_put_contents($messageF, $message);
	file_put_contents($modeF, $mode);
}

if (!empty($_POST['status'] )) { // turn on off
	$status = $_POST['status'];
	if ($status == 'erneut senden') $status = 'einschalten';
	file_put_contents($statusF, $status);
	if ($status == 'einschalten') { // save new stuff when turning on
		file_put_contents($modeF, $mode);
		file_put_contents($messageF, $message);
	}
}

if (!empty($_POST['tab'] )) { // switch tab
	$tab = $_POST['tab'];
	setcookie('tab', $tab, time()+(3600*24));
}

if ((file_get_contents($modeF) != $mode || file_get_contents($messageF) != $message) && file_get_contents($statusF) == 'einschalten')  { // check if live vs preview is different
	$status = 'erneut senden';
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<?php //<meta http-equiv="X-UA-Compatible" content="IE=8"> //Use IE and this setting for dev for old browser?>
<title>DieUhr</title>
<script type="text/javascript" src="js/clock.js"></script>
<script type="text/javascript" src="js/jquery.js"></script>
<link href="design.css" rel="stylesheet">
<style type="text/css">
body {
	overflow: hidden;
}
</style>
</head>
<body onload="startClock(true)">
	<div class="button"><a href="?notaus=1" style="background-color:#FF7755;">&#x2B58</a></div> <!--off-->
	<div class="button"><a href="">&#x27F3</a></div> <!--refresh-->
<form method="post" action="">
<ul class="tabrow">
  <li <?php if ($tab == 'Vorschau') echo 'class="selected"'; ?>><input type="submit" name="tab" value="Vorschau" /></li>
  <li <?php if ($tab == 'Live')     echo 'class="selected"'; ?>><input type="submit" name="tab" value="Live"     /></li>
</ul>
	<div class="boxw" style="margin-top: 0;">
		<div id="clock">
	<?php if ( ($tab == 'Vorschau' && $mode != 'wedding') || ( (file_get_contents($modeF) != 'wedding' || file_get_contents($statusF) == 'ausschalten' ) && $tab == 'Live' )) {
echo '	<span class="the_clock">
			<span class="cl_hours"></span><span class="cl_minutes"></span>
		</span>' ;} ?>
<?php
if ($tab == 'Vorschau' && $mode == 'marquee')   echo '<div class="marquee">'.$message.'</div>';
if ($tab == 'Vorschau' && $mode == 'textblock') echo '<div class="simple">' .$message.'</div>';
if ($tab == 'Vorschau' && $mode == 'wedding')   echo '<div class="simple">Ansicht nicht verfügbar!</div>';

if (file_get_contents($statusF) != 'ausschalten' && $tab == 'Live' && file_get_contents($modeF) == 'marquee')   echo '<div class="marquee">'.file_get_contents($messageF).'</div>';
if (file_get_contents($statusF) != 'ausschalten' && $tab == 'Live' && file_get_contents($modeF) == 'textblock') echo '<div class="simple">'. file_get_contents($messageF).'</div>';
if (file_get_contents($statusF) != 'ausschalten' && $tab == 'Live' && file_get_contents($modeF) == 'wedding')   echo '<div class="simple">Ansicht nicht verfügbar!</div>';

if (file_get_contents($statusF) == 'ausschalten' && $tab == 'Live' ) {
	echo "<span class='the_date'>
			<span class='cl_day'></span><span class='cl_month'></span><span class='cl_year'></span>
		  </span>";
}
?>
		</div>	
	</div>	
	<div class="boxw">Eingabe:
			<textarea name="message" rows="" cols=""><?php echo $message; ?></textarea>
			<input type="submit" name="save"  value="speichern" />
			<input type="submit" name="del"   value="löschen" />
			<input type="submit" name="reset" value="Das Lied ..." />
	</div>
	<div class="box">Anzeigemodus:
			<select name="mode" onchange="if(this.value != 0) this.form.submit();">
				<option value="marquee"        <?php if ($mode == 'marquee')        echo 'selected="selected"'; ?> >Laufschrift</option>
				<option value="textblock"      <?php if ($mode == 'textblock')      echo 'selected="selected"'; ?> >Textblock</option>
				<option value="wedding"        <?php if ($mode == 'wedding')        echo 'selected="selected"'; ?> >Hochzeit</option>
			</select>
	</div>
	<div class="box">Status:
<?php
if ($status == 'einschalten') {
        echo '
		<div style="background-color: #99DD55; text-align: center;">EIN
		<input type="submit" name="status" value="ausschalten" /></div>';
} else if ($status == 'ausschalten'){
        echo '
		<div style="background-color: #FF7755; text-align: center;">AUS
		<input type="submit" name="status"  value="einschalten" /></div>';
} else {
		echo '
		<div style="background-color: #FFFF66; text-align: center;">nicht aktuell
		<input type="submit" name="status"  value="erneut senden" /></div>';
} ?>
	</div>
	<?php $output = shell_exec('bash '.$_SERVER['DOCUMENT_ROOT'].'/refresh.sh 2>&1');
	if (!empty($output)) echo '
	<div class="boxw" style="color: red; font-size: 3vw;">
		<b>Error:</b></br>
		'.$output ; ?>
	</div>
</form>
</body>
</html>
