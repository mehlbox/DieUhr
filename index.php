<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>DieUhr</title>
<link href="design.css" rel="stylesheet">
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/clock.js"></script>
<script type="text/javascript" src="js/function.js"></script>
</head>
<body>
<form method="post" action="">
	<div class="button" style="float: right;">
		<button id="switch" type="button" ><img src="svg/OnOff.svg" ></button>
	</div>
	<div class="button" style="float: right; margin-right: 2vw;">
		<button id= "refresh" type="submit" style="background-color:#FFFF66; "><img src="svg/refresh.svg" ></button>
	</div>
<ul id="tab" class="tabrow">
  <li><input type="button" name="Vorschau" value="Vorschau"/></li>
  <li><input type="button" name="Live"     value="Live"/></li>
</ul>
	<div class="boxw" style="margin-top: 0;">
		<div id="clock">
		<span class="the_clock">
			<span class="cl_hours"></span><span class="cl_minutes"></span>
		</span>
		<div id="displayText"></div>
			<span class='the_date'>
				<span class='cl_day'></span><span class='cl_month'></span><span class='cl_year'></span>
			</span>

		</div>	
	</div>	
	<div class="boxw">
		<div style="margin:0; padding:0 1vw; float: left;">
			<select id="mode" style="width: 43.5vw;">
				<option value="textblock" >Textblock</option>
				<option value="marquee"   >Laufschrift</option>
			</select>
			<select id="timer" style="width: 20vw;">
				<option value="60"  >1 Min</option>
				<option value="180" >3 Min</option>
				<option value="300" >5 Min</option>
				<option value="600" >10Min</option>
				<option value="inf" >&#8734;</option> //infinity
			</select>
			<select id="symbol" style="width: 20vw;" >
				<option value="">&#10047;&#10084;&#10017;</option>
				<option value="&#10047;" >&#10047;</option>
				<option value="&#10049;" >&#10049;</option>
				<option value="&#10084;" >&#10084;</option>
				<option value="&#10082;" >&#10082;</option>
				
				<option value="&#10017;" >&#10017;</option>
				<option value="&#10032;" >&#10032;</option>
				<option value="&#10038;" >&#10038;</option>
				<option value="&#10039;" >&#10039;</option>
				
				<option value="&#937;"  >&#937; </option>
				<option value="&#9986;" >&#9986;</option>
				<option value="&#9990;" >&#9990;</option>
				<option value="&#9993;" >&#9993;</option>
				
				<option value="&#10003;">&#10003;</option>
				<option value="&#10007;">&#10007;</option>
				<option value="&#8635;" >&#8635; </option>
				<option value="&#10132;">&#10132;</option>
			</select>		
		</div>
		<textarea id="message" name="message" ></textarea>

		<div class="button" style="float: left;">
			<button id="new" type="button" style="background-color:#FFFF66;"><img src="svg/doc.svg"></button>
		</div>
		<!--div class="button" style="float: left;">
			<button type="button" style="background-color:#FFFF66" ><img src="svg/save.svg"></button>
		</div-->
		<div id="del" class="button" style="float: left;">
			<button type="button" style="background-color:#FFFF66;"><img src="svg/delete.svg"></button>
		</div>
		<div id="bth" style="margin:0; padding:0;">
		<div class="button" style="float: left;">
			<button id="revert" type="button" style="background-color:#FF7755;"><img src="svg/back.svg" ></button>
		</div>
		<div class="button" style="float: left;">
			<button id="confirm" type="button" style="background-color:#99DD55;"><img src="svg/done.svg"></button>
		</div>
		</div>
	</div>
	<div id="error"></div>
</form>
<script>

//empty cookies

var local = {
	tab:	"Vorschau",
	mode:	"textblock",
	timer:	"300",
	message:"Das Lied Nr.: ",
	onOff:  ""
};

var temp = {
	tab:	"",
	mode:	"",
	timer:	"",
	message:"",
	onOff:  ""
};

var remote = {
	tab:	"",
	mode:	"",
	timer:	"",
	message:"",
	onOff:  ""
};
getDisplay(remote);

$("input[name='Vorschau']").parent().addClass("selected"); // set tab

$("#message").val(local.message); // set message



//$("*").click(function() {console.log(JSON.stringify(local));})
//console.log($("input[name='Vorschau']"));



$("#tab input").click(function(){ // tab buttons
	local.tab = $(this).val();
	$("#tab").children("li").removeClass("selected");
	$(this).parent().addClass("selected");
});

$('#switch').click(function(){ // toggel on off switch
	$('#switch').css("background-color", "#BBBBBB").css("border-radius", "50%").css("border", "solid 1vw gray");
	temp = remote;
	if (remote.onOff == 'on') {
		temp.onOff ='off';
	} else {
		temp.onOff ='on';
	} 
	sendDisplay(temp);
});


$("#mode").change(function(){ // dropdown mode
	local.mode = $("#mode option:selected").val();
});

$("#timer").change(function(){ // dropdown timer
	local.timer = $( "#timer option:selected" ).val();
});

$("#symbol").change(function(){ // dropdown symbol
	local.message = $("#message").val() + $( "#symbol option:selected" ).text();
	$("#message").val(local.message);
});

$('#message').bind('keyup',function(){ //textarea
	local.message = $("#message").val();
});

$('#new').click(function(){ // template button
	local.message = "Das Lied Nr.: ";
	$("#message").val(local.message);
});

$('#del').click(function(){ // trash button
	local.message = "";
	$("#message").val(local.message);
});

$("#confirm").click(function(){ //confirm button
	local.onOff = remote.onOff;
	sendDisplay(local);
});

$("#revert").click(function(){ //revert button
	$.ajax({
	url: "data.json",
	cache: false
	})
	.done(function(response) {
		local = response;
		$("#message").val(local.message);
		$("#timer").val(local.timer);
		$("#mode").val(local.mode);
	});
});



timeloop();
</script>
</body>
</html>
