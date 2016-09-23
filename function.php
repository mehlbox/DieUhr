<?php
$file   = $_SERVER['DOCUMENT_ROOT'].'/data.json';

if (!empty($_POST["data"])) {
	file_put_contents($file,$_POST["data"]);
}

if ( !empty($_POST["switch"]) ) {
	shell_exec('bash '.$_SERVER['DOCUMENT_ROOT'].'/refresh.sh 2>&1');
}
?>
