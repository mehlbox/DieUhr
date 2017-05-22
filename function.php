<?php
$file  = $_SERVER['DOCUMENT_ROOT'].'/data.json';
if (!file_exists($file)) file_put_contents($file,'{"onOff":"off","displayChange":0}');;

$data = json_decode(file_get_contents($file), true); // data from file

if (!empty($_POST['data'])) {
	$newdata = json_decode($_POST['data'], true);		 	// received data
	if(!empty($newdata['timeoutTimestamp'])) 	$newdata['timeoutTimestamp']	= $newdata['timeoutTimestamp'] + $_SERVER['REQUEST_TIME'];
	if(!empty($newdata['message'])) 		$newdata['message'] 		= strip_tags ($newdata['message'],'<span><div><p>'); // clear html tags in message except the listed one.
	$data = array_merge($data, $newdata);				 	// merge date
	file_put_contents($file,json_encode($data));		 	// write date to file
	if($newdata['onOff'] == 'on' ) {
		shell_exec('echo $(date +%a" "%d.%m.%Y" "%H:%M:%S) Message:'.$newdata['message'].' by:'.gethostbyaddr($_SERVER['REMOTE_ADDR']).' '.$_SERVER['REMOTE_ADDR'].' >>'.$_SERVER['DOCUMENT_ROOT'].'/log.txt');
	}
	exit();
}

if (!empty($_POST['command'])) { // not all commands are tested
	header('Content-Type: text/plain');
	if ($_POST['command'] == 'refresh') echo shell_exec('bash export DISPLAY=":0" && xdotool key F5 2>&1');
	if ($_POST['command'] == 'stop') 	echo shell_exec('killall midori 2>&1');
	if ($_POST['command'] == 'start') 	echo shell_exec('xinit /var/www/startMidori.sh 2>&1');
	if ($_POST['command'] == 'reboot') 	echo shell_exec('reboot 2>&1');
	if ($_POST['command'] == 'delete') 	echo shell_exec('echo "{}" >'.$file);
	if ($_POST['command'] == 'linux') 	echo shell_exec('uname -a 2>&1');
	if ($_POST['command'] == 'user') 	echo shell_exec('whoami 2>&1');
	exit();
}
header('Content-Type: application/json');
$newdata['timestamp'] = $_SERVER['REQUEST_TIME'];
$data = array_merge($data, $newdata);
echo json_encode($data);
?>
