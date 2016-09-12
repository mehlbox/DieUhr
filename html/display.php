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
    height: 85vmin;
    width: 100vmax;
    position:absolute;
	margin: auto;
    background-color: black;
    top: 0; left: 0; bottom: 0; right: 0;	
	font-family:Verdana,sans-serif;color:#FFFFFF;
	text-align:center;
	display:block;
	font-size: 45vmin;	
}
.the_clock {
	font-size:100%;
}
.the_date {
	font-size:40%;
}
.the_message {
	font-size:40%;
}
</style>
</head>
<body onload="startClock(true)">
	<div id="clock">
		<span class="the_clock">
			<span class='cl_hours'></span><span class='cl_minutes'></span>
		</span>
<?php
$file   = $_SERVER['DOCUMENT_ROOT'].'message.txt';
$status = $_SERVER['DOCUMENT_ROOT'].'status.inf' ;

if (file_get_contents($status)) {
	echo "<span class='the_message'><marquee scrollamount='20'>".file_get_contents($file)."</marquee></span>";
} else {
	echo "<span class='the_date'><span class='cl_day'></span><span class='cl_month'></span><span class='cl_year'></span></span>";
}
?>
	</div>
</body>
</html>

