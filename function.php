<?php
$file   = $_SERVER['DOCUMENT_ROOT'].'/data.json';

if (!empty($_POST["data"])) {
	$data = json_decode(file_get_contents($file), true); // data from file
	$newdata = json_decode($_POST["data"], true);		 // sent data
	if(!empty($newdata["message"])) $newdata["message"] = strip_tags ($newdata["message"],"<span>"); // clear html tags
	$data = array_merge($data, $newdata);				 // merge date
	file_put_contents($file,json_encode($data));		 // write date to file
}

if (!empty($_GET["admin"])) {
	if ($_GET["admin"] == 'refresh') echo shell_exec('bash '.$_SERVER['DOCUMENT_ROOT'].'/refresh.sh 2>&1');
}
?>
