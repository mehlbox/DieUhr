<?php if (!empty($_GET["d"])) $desktop = TRUE; ?>
<!DOCTYPE html>
<html>
	<meta charset="UTF-8">
	<title>DieUhr</title>
	<link href="index.css" rel="stylesheet"/>
	<?php if ($desktop) echo '<link href="desktop.css" rel="stylesheet"/>'; ?>
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/indexFunction.js"></script>
</head>
<body>
<?php if ($desktop) { echo '
	<div class="box">Vorschau:
		<div id="wrapD">
			<iframe id="display" src="/display.html?selectDisplay=Vorschau" width="100%" height="100%" scrolling="no" frameborder="0"></iframe>
		</div>
	</div>
	<div class="box">Live:
		<div id="wrapD">
			<iframe id="display2" src="/display.html?selectDisplay=Live"    width="100%" height="100%" scrolling="no" frameborder="0"></iframe>
		</div>
	</div>
'; } else { echo '
	<div class="onOff" style="float: right;">
		<button id="switch" type="button" ><img src="svg/OnOff.svg" alt="On/Off" width="90%" /></button>
	</div>
	<div style="float: right;">
		<span id="autoOff"></span>
	</div>
	<ul id="tab" class="tabrow">
	  <li id="Vorschau"><input type="button" name="Vorschau" value="Vorschau"/></li>
	  <li id="Live">    <input type="button" name="Live"     value="Live"/></li>
	</ul>
	<div class="boxw">
		<div id="wrapC"><iframe id="display" src="display.html" width="100%" height="100%" scrolling="no" frameborder="0"></iframe></div>
	</div>
';} ?>
	<div id="error"></div>
	<div class="boxw">
		<div style="margin-top:-2vw;">
			<button id="moreOption" class="smallButton" type="button" style="background-color:#C3DF79; float:right;">
				<img src="svg/plus.svg" alt="mehr" width="85%" />
			</button>
			<table>
				<tr>
					<td>Oben:</td>
					<td>Unten:</td>
					<td></td>
				</tr>
				<tr>
					<td>
						<select id="upperLine">
							<option value="clock"     >Uhrzeit</option>
							<!--option value="date"      >Datum</option-->
							<option value="countdown" >Zeitgeber</option>
							<option value="textarea"  >Textblock</option>
							<option value="marquee"	  >Laufschrift</option>
							<option value="off"       >Aus</option>
						</select>
					</td>
					<td>
						<select id="lowerLine">
							<!--option value="clock"  >Uhrzeit</option>
							<option value="date"      >Datum</option-->
							<option value="countdown" >Zeitgeber</option>
							<option value="textarea"  >Textblock</option>
							<option value="marquee"	  >Laufschrift</option>
							<option value="off"       >Aus</option>
						</select>
					</td>
					<td>
						<select id="symbol">
							<option value="" >$ym</option>
							<option value="&#10084;" >&#10084;</option>
							<option value="&#10047;" >&#10047;</option>
							<option value="&#10049;" >&#10049;</option>
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
					</td>
				</tr>
			</table>
		</div>
		<div id="option">
			<div class="boxin">Haupteinstellungen:
				<table>
					<!--tr>
						<td>Schriftgröße Uhrzeit: </td>
						<td><select id="clockSize">
								<option value="10%" >10%</option>
								<option value="20%" >20%</option>
								<option value="30%" >30%</option>
								<option value="40%" >40%</option>
								<option value="50%" >50%</option>
								<option value="60%" >60%</option>
								<option value="70%" >70%</option>
								<option value="80%" >80%</option>
								<option value="90%" >90%</option>
								<option value="100%">100%</option>
							</select>
						</td>
					</tr>
					<tr>
						<td>Schriftgröße Datum: </td>
						<td><select id="dateSize">
								<option value="10%" >10%</option>
								<option value="20%" >20%</option>
								<option value="30%" >30%</option>
								<option value="40%" >40%</option>
								<option value="50%" >50%</option>
							</select>
						</td>
					</tr-->
					<tr>
						<td>zurücksetzen nach: </td>
						<td><select id="timeout">
								<option value="60"  >1 Min</option>
								<option value="180" >3 Min</option>
								<option value="300" >5 Min</option>
								<option value="420" >7 Min</option>
								<option value="600" >10Min</option>
								<option value="900" >15Min</option>
								<option value="1200">20Min</option>
								<option value="1500">25Min</option>
								<option value="1800">30Min</option>
								<option value="inf" >&#8734;</option>
							</select>
						</td>
					</tr>
				</table>
			</div>
			<div class="boxin">Textblock:
				<table>
					<!--tr>
						<td>Schriftgröße: </td>
						<td><select id="textblockSize">
								<option value="10%" >10%</option>
								<option value="15%" >15%</option>
								<option value="20%" >20%</option>
								<option value="25%" >25%</option>
								<option value="30%" >30%</option>
								<option value="40%" >40%</option>
								<option value="50%" >50%</option>
								<option value="60%" >60%</option>
								<option value="70%" >70%</option>
								<option value="80%" >80%</option>
								<option value="90%" >90%</option>
								<option value="100%">100%</option>
							</select>
						</td>
					</tr-->
					<tr>
						<td>Rahmen: </td>
						<td><select id="textblockBorder">
								<option value="none" >kein</option>
								<option value="wedding1" >Hochzeit 1</option>
								<option value="wedding2" >Hochzeit 2</option>
							</select>
						</td>
					</tr>
				</table>
			</div>
			<div class="boxin">Laufschrift:
				<table>
					<tr>
						<td>Schriftgröße: </td>
						<td><select id="marqueeSize">
								<option value="10%" >10%</option>
								<option value="20%" >20%</option>
								<option value="30%" >30%</option>
								<option value="40%" >40%</option>
								<option value="50%" >50%</option>
								<option value="60%" >60%</option>
								<option value="70%" >70%</option>
								<option value="80%" >80%</option>
								<option value="90%" >90%</option>
								<option value="100%">100%</option>
							</select>
						</td>
					</tr>
					<tr>
						<td>Geschwindigkeit: </td>
						<td><select id="marqueeSpeed">
								<option value="50s" >10%</option>
								<option value="45s" >20%</option>
								<option value="40s" >30%</option>
								<option value="35s" >40%</option>
								<option value="30s" >50%</option>
								<option value="25s" >60%</option>
								<option value="20s" >70%</option>
								<option value="15s" >80%</option>
								<option value="10s" >90%</option>
								<option value="5s">100%</option>
							</select>
						</td>
					</tr>
				</table>
			</div>
			<div class="boxin">Zeitgeber:
				<table>
					<tr>
						<td>Vorgabe Zeit:</td>
						<td>
							<select id="countdownMin">
								<option value="0"   >0 Min</option>
								<option value="60"  >1 Min</option>
								<option value="180" >3 Min</option>
								<option value="300" >5 Min</option>
								<option value="420" >7 Min</option>
								<option value="600" >10Min</option>
								<option value="900" >15Min</option>
								<option value="1200">20Min</option>
								<option value="1500">25Min</option>
								<option value="1800">30Min</option>
							</select>
						</td>
						<td>
							<select id="countdownSec">
								<option value="0"  >0 Sec</option>
								<option value="10" >10Sec</option>
								<option value="20" >20Sec</option>
								<option value="30" >30Sec</option>
								<option value="40" >40Sec</option>
								<option value="50" >50Sec</option>
							</select>
						</td>
					</tr>
					<!--tr>
						<td>Schriftgröße: </td>
						<td><select id="countdownSize">
								<option value="10%" >10%</option>
								<option value="20%" >20%</option>
								<option value="30%" >30%</option>
								<option value="40%" >40%</option>
								<option value="50%" >50%</option>
								<option value="60%" >60%</option>
								<option value="70%" >70%</option>
								<option value="80%" >80%</option>
								<option value="90%" >90%</option>
								<option value="100%">100%</option>
							</select>
						</td>
						<td></td>
					</tr-->
					<tr>
						<td>überziehen: </td>
						<td>
							<select id="countdownTimeout">
								<option value="0"   >0 Min</option>
								<option value="60"  >1 Min</option>
								<option value="180" >3 Min</option>
								<option value="300" >5 Min</option>
								<option value="420" >7 Min</option>
								<option value="600" >10Min</option>
								<option value="900" >15Min</option>
								<option value="1200">20Min</option>
								<option value="1500">25Min</option>
								<option value="1800">30Min</option>
								<option value="inf" >&#8734;</option>
							</select>
						</td>
						<td></td>
					</tr>
				</table>
			</div>
			<div class="boxin">Einstellung zurücksetzen:
				<table>
					<tr>
						<td>Handy:</td>
						<td><input id="resetUnit" type="button" value="zurücksetzen" /></td>
					</tr>
					<tr>
						<td>Anzeige: </td>
						<td><input id="resetDisplay" type="button" value="zurücksetzen" /></td>

					</tr>
				</table>
			</div>
		</div>
		<textarea id="message" name="message" rows="4" ></textarea>

		<div class="button" style="float: left;">
			<button id="new" type="button" style="background-color:#FFFF66;"><img src="svg/doc.svg" alt="Vorlage" width="85%"/></button>
		</div>
		<div id="del" class="button" style="float: left;">
			<button type="button" style="background-color:#FFFF66;"><img src="svg/delete.svg" alt="löschen" width="85%"/></button>
		</div>
<?php if ($desktop) { echo '
		<div class="button" style="float: right;">
			<button id="switch" type="button" ><img src="svg/OnOff.svg" alt="On/Off" width="90%" /></button>
		</div> 
';} ?>
	<div id="bth">
			<div class="button" style="float: right;">
				<button id="confirm" type="button" style="background-color:#99DD55;"><img src="svg/done.svg" alt="senden" width="85%"/></button>
			</div>
			<div class="button" style="float: right;">
				<button id="revert" type="button" style="background-color:#FF7755;"><img src="svg/back.svg"  alt="holen"  width="85%"/></button>
			</div>
		</div>
	</div>
	<div id="countdownControl" class="box">Zeitgeber:
		<div>
			<div class="button" style="float: left;">
				<button id="stop" type="button" style="background-color:#ECD580;"><img src="svg/stop.svg"   alt="stop"  width="85%"/></button>
			</div>
			<div class="button" style="float: left;">
				<button id="start" type="button" style="background-color:#ECD580;"><img src="svg/start.svg" alt="start" width="85%"/></button>
			</div>
		</div>
	</div>
	<div style="clear: left; margin:2vw;">
	<?php if ($desktop) { echo '
		<a href="/">mobile Version</a>
';} else { echo '
		<a href="/?d=1">Desktop Version</a>
'; } ?>
	</br>
	<a href="/display.html">Vollbild</a>
	</div>
<script type="text/javascript" src="js/index.js"></script>
</body>
</html>
