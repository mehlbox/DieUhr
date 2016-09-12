<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<body>
<?php
$file = $_SERVER['DOCUMENT_ROOT'].'message.txt';
$status = $_SERVER['DOCUMENT_ROOT'].'status.inf';



if (!empty($_POST['send']) && !empty($_POST['message'])) file_put_contents($file, $_POST['message']);

echo "<p>Text: ".file_get_contents($file)."</p>";

if (!empty($_POST['off'] )) file_put_contents($status, FALSE);

if (!empty($_POST['on'] )) file_put_contents($status, TRUE);

if (file_get_contents($status)) {
	echo "<p>Anzeige: EIN</p>";
} else {
	echo "<p>Anzeige: AUS</p>";
}

?>
 
<form action="index.php" method="get" >
 
<p>Text:
<input type="text" name="message" value="<?php echo file_get_contents($file); ?>" style="width:80vw;"/>
</p>

<p>
<input type="submit" name="send" value="senden"  formmethod="post" />
</p>
<p>
<input type="submit" name="on"  value="einschalten" formmethod="post" />
<input type="submit" name="off" value="ausschalten" formmethod="post" />
</p>
</form>

</body>
</html>

