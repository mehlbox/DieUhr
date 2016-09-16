<?php
$mode = $_SERVER['DOCUMENT_ROOT'].'/data/mode.inf';
$file = $_SERVER['DOCUMENT_ROOT'].'/data/wedding.txt';
$formtext = file_get_contents($file);
if (file_get_contents($mode) != 'wedding') header("Location: display.php");
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
	<script type="text/javascript" src="js/clock.js"></script>
	<script type="text/javascript" src="js/jquery.js"></script>
<style>
body {
	background: black;
}
.wrap {
    background: black;
    height: 600px;
    width: 1150px;
    margin:0px auto;
    position:absolute;
    top:50%;
    left:50%;
    margin-top:-300px;
    margin-left:-575px;
}
</style>
</head>
<body onload="startClock(true)">
    <div class="wrap" id="clock" style="font-family:Verdana,sans-serif;color:#FFFFFF;">
		<div class="clockTop"> 
			<span style="font-size:300px;line-height:300px;text-align:center;display:block;" class="the_clock">
				<span class='cl_hours'></span><span class='cl_minutes'></span>
			</span>
			<span style="font-size:100px;line-height:100px;text-align:center;display:block;"><font color="#FF0000">&#10084;</font> <?php echo $formtext; ?> <font color="#FF0000">&#10084;</font></span>
			<span style="font-size:150px;line-height:150px;text-align:center;display:block;" class="the_date">
				<span class='cl_day'></span><span class='cl_month'></span><span class='cl_year'></span>
			</span>
		</div>
	</div>
</body>
</html>

