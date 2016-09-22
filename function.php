<?php
$mode   = $_SERVER['DOCUMENT_ROOT'].'/data/mode.txt';
$switch = $_SERVER['DOCUMENT_ROOT'].'/data/switch.txt';
$message= $_SERVER['DOCUMENT_ROOT'].'/data/message.txt';
$timer  = $_SERVER['DOCUMENT_ROOT'].'/data/timer.txt';

if (!empty($_GET["message"])) {
	echo file_put_contents($message, $_REQUEST["message"]);
}
if (!empty($_GET["mode"])) {
	echo file_put_contents($mode, $_REQUEST["mode"]);
}
if (!empty($_GET["switch"])) {
	echo file_put_contents($switch, $_REQUEST["switch"]);
}
if (!empty($_GET["timer"])) {
	echo file_put_contents($timer, $_REQUEST["timer"]);
}

if (!empty($_GET["check"])) {
	if ( file_get_contents($mode) != $_COOKIE['mode'] || file_get_contents($timer) != $_COOKIE['timer'] || file_get_contents($message) != $_COOKIE['message'] ) {
		echo 'block'; // display block, buttons appear
	} else {
		echo 'none';
	}
}

if ( !empty($_GET["switch"]) ) {
	echo shell_exec('bash '.$_SERVER['DOCUMENT_ROOT'].'/refresh.sh 2>&1');
}

?>
