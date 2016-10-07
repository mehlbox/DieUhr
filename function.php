<?php
$file   = $_SERVER['DOCUMENT_ROOT'].'/data.json';

if (!empty($_POST["data"])) {
	$data 	 = json_decode(file_get_contents($file), true); // data from file
	$newdata = json_decode($_POST["data"], true);		 // sent data
	if(!empty($newdata["message"])) $newdata["message"] = strip_tags ($newdata["message"],"<span>"); // clear html tags in message
	$data = array_merge($data, $newdata);				 // merge date
	file_put_contents($file,json_encode($data));		 // write date to file
}

if (!empty($_GET["command"])) {
	if ($_GET["command"] == 'refresh') 	echo shell_exec('bash export DISPLAY=":0" && xdotool key F5 2>&1');
	if ($_GET["command"] == 'reboot') 	echo shell_exec('reboot 2>&1');
	if ($_GET["command"] == 'delete') 	echo shell_exec('echo "{}" >'.$_SERVER['DOCUMENT_ROOT'].'/data.json');
	if ($_GET["command"] == 'version') 	echo shell_exec('uname -a 2>&1');
	if ($_GET["command"] == 'user') 	echo shell_exec('whoami 2>&1');
}
?>
