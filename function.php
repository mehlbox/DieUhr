<?php
$mode   = $_SERVER['DOCUMENT_ROOT'].'/data/mode.txt';
$switch = $_SERVER['DOCUMENT_ROOT'].'/data/switch.txt';
$message= $_SERVER['DOCUMENT_ROOT'].'/data/message.txt';
$timer  = $_SERVER['DOCUMENT_ROOT'].'/data/timer.txt';

if (!empty($_REQUEST["message"])) {
	file_put_contents($message, $_REQUEST["message"]);
}
if (!empty($_REQUEST["mode"])) {
	file_put_contents($mode, $_REQUEST["mode"]);
}
if (!empty($_REQUEST["switch"])) {
	file_put_contents($switch, $_REQUEST["switch"]);
}
if (!empty($_REQUEST["timer"])) {
	file_put_contents($timer, $_REQUEST["timer"]);
}

if (!empty($_REQUEST["check"])) {
	if ( file_get_contents($mode) != $_COOKIE['mode'] || file_get_contents($timer) != $_COOKIE['timer'] || file_get_contents($message) != $_COOKIE['message'] ) {
		echo 'block'; // display block, buttons appear
	} else {
		echo 'none';
	}
}

if ( !empty($_REQUEST["switch"]) || ( !empty($_REQUEST["mode"]) && !empty($_REQUEST["message"]) && !empty($_REQUEST["timer"]) )) {
	echo shell_exec('bash '.$_SERVER['DOCUMENT_ROOT'].'/refresh.sh 2>&1');
}

?>
