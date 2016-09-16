<?php
$file   = $_SERVER['DOCUMENT_ROOT'].'/data/message.txt';
$status = $_SERVER['DOCUMENT_ROOT'].'/data/status.inf' ;
$mode   = $_SERVER['DOCUMENT_ROOT'].'/data/mode.inf';

if (file_get_contents($mode) == 'wedding') header("Location: hochzeit.php");

if (!empty($_GET['timeout'])) {
	file_put_contents($status, FALSE);
	header("Location: display.php");
}

if (file_get_contents($status)) {
	header( "refresh:120;url=display.php?timeout=1" );
} else {
	header( "refresh:600;url=display.php" );
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<script type="text/javascript" src="js/clock.js"></script>
	<script type="text/javascript" src="js/jquery.js"></script>
<style>
body {
	background: green;
}
#clock {
    height:100vmin;
    width: 100vmax;
    position:absolute;
	margin: auto;
    background-color: black;
    top: 0; left: 0; bottom: 0; right: 0;
	font-family:Verdana,sans-serif;color:#FFFFFF;
	text-align:center;
	display:block;
	font-size: 50vmin;
}
.the_clock {
	font-size:100%;
}
.the_date {
	font-size:50%;
}
@-webkit-keyframes marquee {
 0%   { text-indent: 100vw }
 100% { text-indent: -300vw }
}
.marquee {
	font-size: 60%;
	position: relative;
	overflow: hidden;
	white-space: nowrap;
	-webkit-animation: marquee 15s linear infinite;
}
.simple {
	font-size: 25%;
	line-height: 1em;
	height: 2em;
	position: relative;
	overflow: hidden;
	white-space: pre;
}
</style>
</head>
<body onload="startClock(true)">
	<div id="clock">
		<span class="the_clock">
			<span class='cl_hours'></span><span class='cl_minutes'></span>
		</span>
<?php
if (file_get_contents($status) && file_get_contents($mode) == 'marquee') {
	echo "<div class='marquee'>".file_get_contents($file)."</div>";
}

if (file_get_contents($status) && file_get_contents($mode) == 'textblock') {
	echo "<div class='simple'>".file_get_contents($file)."</div>";
}

if (!file_get_contents($status)) {
	echo "<span class='the_date'><span class='cl_day'></span><span class='cl_month'></span><span class='cl_year'></span></span>";
}
?>
	</div>
</body>
</html>
