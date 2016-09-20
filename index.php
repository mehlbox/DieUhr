<?php
$modeF    = $_SERVER['DOCUMENT_ROOT'].'/data/mode.inf';
$schalterF  = $_SERVER['DOCUMENT_ROOT'].'/data/schalter.inf';
$messageF = $_SERVER['DOCUMENT_ROOT'].'/data/message.txt';

// for new clients
if (empty($_COOKIE['mode'])) { setcookie('mode', 'marquee', time()+(3600*24)); $_COOKIE['mode'] = 'marquee'; }                    
if (empty($_COOKIE['tab']))  { setcookie('tab', 'Vorschau', time()+(3600*24)); $_COOKIE['tab']  = 'Vorschau';}                           

								$schalter  = file_get_contents($schalterF);  // on, off, send again
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

if (!empty($_POST['symbol'] )) { //new message
	$message = $message.$_POST['symbol'];
	setcookie('message', $message, time()+(3600*24));
}

if (!empty($_POST['mode'] )) { // switch text kind
	$mode = $_POST['mode'];
	setcookie('mode', $mode, time()+(3600*24));
}

if (!empty($_POST['save']) && $schalter != 'ausschalten' ) { // message has been saved already. nothing to do.

}

if (!empty($_POST['schalter'] )) { // turn on off
	$schalter = $_POST['schalter'];
	file_put_contents($schalterF, $schalter);
	$output = shell_exec('bash '.$_SERVER['DOCUMENT_ROOT'].'/refresh.sh 2>&1');
}

if (!empty($_POST['settings'] )) {
	if ($_POST['settings'] == 'übernehmen' ) {
		file_put_contents($modeF,    $mode);
		file_put_contents($messageF, $message);
	}
	if ($_POST['settings'] == 'verwerfen' ) {
		$mode    = file_get_contents($modeF);
		$message = file_get_contents($messageF);
		setcookie('mode',    $mode,    time()+(3600*24));
		setcookie('message', $message, time()+(3600*24));
	}
}

if (!empty($_POST['tab'] )) { // switch tab
	$tab = $_POST['tab'];
	setcookie('tab', $tab, time()+(3600*24));
}

?>



<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<?php echo '<meta http-equiv="X-UA-Compatible" content="IE=11">'; //Use IE and this setting for dev for old browser?>
<title>DieUhr</title>
<script type="text/javascript" src="js/clock.js"></script>
<script type="text/javascript" src="js/jquery.js"></script>
<link href="design.css" rel="stylesheet">
<style type="text/css">
body {
	
}
</style>
</head>
<body onload="startClock(true)">
<form method="post" action="">
	<div class="button"><?php
	if ($schalter == 'ausschalten') {
		echo '<button type="sumit" name="schalter" value="einschalten" style="background-color:#FF7755;">';
	} else {
		echo '<button type="sumit" name="schalter" value="ausschalten" style="background-color:#99DD55;">';
	} ?>
	<img src="OnOff.svg" ></button></div>
<?php
if ((file_get_contents($modeF) != $mode || file_get_contents($messageF) != $message)) {
echo '
	<div class="button">
	<button type="sumit" name="settings" value="übernehmen" style="background-color:#99DD55;"><img src="done.svg"></button>
	</div>
	<div class="button">
	<button type="sumit" name="settings" value="verwerfen"  style="background-color:#FF7755;"><img src="remove.svg" ></button>
	</div>'; } ?>
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

if (file_get_contents($schalterF) != 'ausschalten' && $tab == 'Live' && file_get_contents($modeF) == 'marquee')   echo '<div class="marquee">'.file_get_contents($messageF).'</div>';
if (file_get_contents($schalterF) != 'ausschalten' && $tab == 'Live' && file_get_contents($modeF) == 'textblock') echo '<div class="simple">'. file_get_contents($messageF).'</div>';
if (file_get_contents($schalterF) != 'ausschalten' && $tab == 'Live' && file_get_contents($modeF) == 'wedding')   echo '<div class="simple">Ansicht nicht verfügbar!</div>';

if (file_get_contents($schalterF) == 'ausschalten' && $tab == 'Live' ) {
	echo "<span class='the_date'>
			<span class='cl_day'></span><span class='cl_month'></span><span class='cl_year'></span>
		  </span>";
}
?>
		</div>	
	</div>	
	<div class="boxw" <?php if (file_get_contents($messageF) != $message ) echo 'style="outline: solid 0.5vw red"'; ?>>Eingabe:
			<div style="margin:0; padding:0; float: right;">
				<select name="symbol" style="margin:0; padding:0; width: 25vw;" onchange="if(this.value != 0) this.form.submit();">
				
				<option value="" >Symbole</option>
				<option value="&#10047;" >&#10047;</option>
				<option value="&#10049;" >&#10049;</option>
				<option value="&#10084;" >&#10084;</option>
				<option value="&#10082;" >&#10082;</option>
				
				<option value="&#10017;" >&#10017;</option>
				<option value="&#10032;" >&#10032;</option>
				<option value="&#10038;" >&#10038;</option>
				<option value="&#10039;" >&#10039;</option>
				
				<option value="&#937;"  >&#937;</option>
				<option value="&#9986;" >&#9986;</option>
				<option value="&#9990;" >&#9990;</option>
				<option value="&#9993;" >&#9993;</option>
				
				<option value="&#10003;">&#10003;</option>
				<option value="&#10007;">&#10007;</option>
				<option value="&#8635;" >&#8635;</option>
				<option value="&#10132;">&#10132;</option>

				</select>
			</div>
			<textarea name="message" rows="" cols=""><?php echo $message; ?></textarea>
			<input type="submit" name="save"  value="speichern" />
			<input type="submit" name="del"   value="löschen" />
			<input type="submit" name="reset" value="Das Lied ..." />
	</div>
	<div class="box" <?php if (file_get_contents($modeF) != $mode ) echo 'style="outline: solid 0.5vw red"'; ?>>Modus:
			<select name="mode" onchange="if(this.value != 0) this.form.submit();">
				<option value="marquee"   <?php if ($mode == 'marquee')   echo 'selected="selected"'; ?> >Laufschrift</option>
				<option value="textblock" <?php if ($mode == 'textblock') echo 'selected="selected"'; ?> >Textblock</option>
				<option value="wedding"   <?php if ($mode == 'wedding')   echo 'selected="selected"'; ?> >Hochzeit</option>
			</select>
	</div>
	<div class="box" <?php //if (file_get_contents($modeF) != $mode ) echo 'style="outline: solid 0.5vw red"'; ?>>Dauer:
			<select name="timer" onchange="if(this.value != 0) this.form.submit();">
				<option value="1" <?php //if ($timer == '1') echo 'selected="selected"'; ?> >eine Minute</option>
				<option value="3" <?php //if ($timer == '3') echo 'selected="selected"'; ?> >3 Minuten</option>
				<option value="5" <?php //if ($timer == '5') echo 'selected="selected"'; ?> >5 Minuten</option>
				<option value="10"<?php //if ($timer == '10') echo 'selected="selected"'; ?> >10 Minuten</option>
				<option value="keep"   <?php //if ($timer == 'keep') echo 'selected="selected"'; ?> >Dauerhaft</option>
			</select>
	</div>
	<?php if (!empty($output)) echo '<div class="ebox"><b>Error:</b></br>'.$output.'</div>' ; ?>
</form>
</body>
</html>
