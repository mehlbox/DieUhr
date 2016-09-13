<?php
$file   = $_SERVER['DOCUMENT_ROOT'].'/data/message.txt';
$status = $_SERVER['DOCUMENT_ROOT'].'/data/status.inf';
header( "refresh:120;url=/" );
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<body style="background-color: #EEEEEE; font-size: 5vmin;">
<?php if (!empty($_POST['send']) && !empty($_POST['message'])) file_put_contents($file, $_POST['message']); ?>
<div style="background-color: #DDDDDD;">gespeicherter Text:
	<div style="font-size: 5vmin; background-color: #5599FF; border: 0; padding: 1vmin;"> <?php echo file_get_contents($file); ?>
	</div>
</div>
<?php if (!empty($_POST['off'] )) file_put_contents($status, FALSE);
      if (!empty($_POST['on']  )) file_put_contents($status, TRUE); ?>
</br>
<?php if (!empty($_POST['del'])) $formtext = ""; else $formtext = file_get_contents($file); ?>
<form action="/" method="post" >
	<div style="background-color: #DDDDDD;">Eingabe:</br>
		<input type="text" name="message" value="<?php echo $formtext; ?>" style="width:97%; font-size: 7vmin; background-color: #FFFF66;  border: 2pt solid #000000; padding: 1vmin;"/>
	<div>
		<input type="submit" name="send" value="speichern" style="font-size: 5vmin; padding: 2vmin;"/>
		<input type="submit" name="del"  value="löschen"   style="font-size: 5vmin; padding: 2vmin;"/>
	</div>
	</div>
	</br>

<div style="background-color: #DDDDDD;">Anzeige:
<?php
if (file_get_contents($status)) {
        echo '<div style="background-color: #99FF55; border: 0; padding: 1vmin; ">EIN</div>';
} else {
        echo '<div style="background-color: #FF9955; border: 0; padding: 1vmin; ">AUS</div>';
} ?>
   <div>
      <input type="submit" name="on"  value="einschalten" style="font-size: 5vmin; padding: 2vmin;"/>
      <input type="submit" name="off" value="ausschalten" style="font-size: 5vmin; padding: 2vmin;"/>
   </div>
</div>
</br>
<input type="submit" value="aktualisieren" style="font-size: 5vmin; padding: 2vmin;"/>
</form>
</body>
</html>
<!--
<?php echo shell_exec('bash '.$_SERVER['DOCUMENT_ROOT'].'/refresh.sh 2>&1'); ?>
-->
