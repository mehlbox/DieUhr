<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<body style="background-color: #EEEEEE; font-size: 5vw;">
<?php
$file = $_SERVER['DOCUMENT_ROOT'].'message.txt';
$status = $_SERVER['DOCUMENT_ROOT'].'status.inf';



if (!empty($_POST['send']) && !empty($_POST['message'])) file_put_contents($file, $_POST['message']);

echo '<div style="background-color: #DDDDDD;">gespeicherter Text: <div style="font-size: 5vw; background-color: #5599FF; border: 0; padding: 1vw;">'.file_get_contents($file).'</div></div>';

if (!empty($_POST['off'] )) file_put_contents($status, FALSE);

if (!empty($_POST['on'] )) file_put_contents($status, TRUE);

echo '</br>';
echo '<div style="background-color: #DDDDDD;">Anzeige: ';
if (file_get_contents($status)) {
	echo '<div style="background-color: #99FF55; border: 0; padding: 1vw; ">EIN</div>';
} else {
	echo '<div style="background-color: #FF9955; border: 0; padding: 1vw; ">AUS</div>';
}
echo '</div>';
echo '</br>';

if (!empty($_POST['del'])) $formtext = ""; else $formtext = file_get_contents($file);
?>
 
<form action="index.php" method="get" >
	<div style="background-color: #DDDDDD;">Eingabe:</br>
		<input type="text" name="message" value="<?php echo $formtext; ?>" style="width:97%; font-size: 7vw; background-color: #FFFF66;  border: 2pt solid #000000; padding: 1vw;"/>
	</div>
	</br>
	<div>
		<input type="submit" name="send" value="senden"  formmethod="post" style="font-size: 5vw; padding: 2vw;"/>
		<input type="submit" name="del"  value="löschen" formmethod="post" style="font-size: 5vw; padding: 2vw;"/>
	</div>
	</br>
	<div>
		<input type="submit" name="on"  value="einschalten" formmethod="post" style="font-size: 5vw; padding: 2vw;"/>
		<input type="submit" name="off" value="ausschalten" formmethod="post" style="font-size: 5vw; padding: 2vw;"/>
	</div>
</form>
</body>
</html>

