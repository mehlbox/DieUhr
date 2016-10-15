<?php
$file  = $_SERVER['DOCUMENT_ROOT'].'/data.json';

if (!empty($_POST["data"])) {
	$data 	 = json_decode(file_get_contents($file), true); // data from file
	$newdata = json_decode($_POST["data"], true);		 // sent data
	if(!empty($newdata["message"])) $newdata["message"] = strip_tags ($newdata["message"],"<span><div><p>"); // clear html tags in message except the listed one.
	$data = array_merge($data, $newdata);				 // merge date
	file_put_contents($file,json_encode($data));		 // write date to file
	if($newdata[onOff] == 'on' ) {
		shell_exec('echo $(date) "'.json_encode($data).'" >>'.$_SERVER['DOCUMENT_ROOT'].'/log.txt');
	}
}

if (!empty($_POST["time"])) {
	echo $_SERVER['REQUEST_TIME'];
}

if (!empty($_POST["command"])) { // not tested in real life
	if ($_POST["command"] == 'refresh') 	echo shell_exec('bash export DISPLAY=":0" && xdotool key F5 2>&1');
	if ($_POST["command"] == 'stop') 	echo shell_exec('killall midori 2>&1');
	if ($_POST["command"] == 'start') 	echo shell_exec('xinit /var/www/startMidori.sh 2>&1');
	if ($_POST["command"] == 'reboot') 	echo shell_exec('reboot 2>&1');
	if ($_POST["command"] == 'delete') 	echo shell_exec('echo "{}" >'.$file);
	if ($_POST["command"] == 'linux') 	echo shell_exec('uname -a 2>&1');
	if ($_POST["command"] == 'user') 	echo shell_exec('whoami 2>&1');
}

?>
