<?php
$file   = $_SERVER['DOCUMENT_ROOT'].'/data/message.txt';
$status = $_SERVER['DOCUMENT_ROOT'].'/data/status.inf' ;

if ($_GET['timeout']) {
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
 0%   { text-indent: 100% }
 100% { text-indent: -200% }
}
.marquee {
 font-size: 60%;
 overflow: hidden;
 white-space: nowrap;
 -webkit-animation: marquee 10s linear infinite;}
</style>
</head>
<body onload="startClock(true)">
	<div id="clock">
		<span class="the_clock">
			<span class='cl_hours'></span><span class='cl_minutes'></span>
		</span>
<?php
if (file_get_contents($status)) {
	echo "<div class='marquee'>".file_get_contents($file)."</div>";
} else {
	echo "<span class='the_date'><span class='cl_day'></span><span class='cl_month'></span><span class='cl_year'></span></span>";
}
?>
	</div>
</body>
</html>
