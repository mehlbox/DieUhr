<html>
  <head>
    <title>Screen Resolution & Aspect Ratio </title>
	<style>
body {
	background: black;
}
div {
	color: white;
	font-size: 10vmin;
	font-family: Arial;
	margin-top: 15vmin;
	text-align:center;
}
	</style>
	<script type="text/javascript">
		var resratio = (screen.width/screen.height);
		
		if (1.32 < resratio && resratio < 1.34) {
			var aspect_ratio_string = "4:3";
		}
		else if (1.77 < resratio && resratio < 1.79) {
			var aspect_ratio_string = "16:9";
		}
		else if (1.59 < resratio && resratio < 1.61) {
			var aspect_ratio_string = "16:10";
		}
		else if (1.49 < resratio && resratio < 1.51) {
			var aspect_ratio_string = "3:2";
		}
		else {
			var aspect_ratio_string = resratio.toFixed(2) + " : 1";
		}
	</script>
  </head>
  <body>
	<script type="text/javascript">
	  var _paq = _paq || [];
	  _paq.push(['trackPageView']);
	  _paq.push(['enableLinkTracking']);
	  (function() {
		var u="//whatismyresolution.com/piwik/";
		_paq.push(['setTrackerUrl', u+'piwik.php']);
		_paq.push(['setSiteId', 1]);
		var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
		g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
	  })();
	</script>
		<div>
			<p>Screen resolution: <script type="text/javascript">document.write(screen.width+'x'+screen.height);</script></p>
			<p>Inner resolution: <script type="text/javascript">document.write(window.innerWidth+'x'+window.innerHeight);</script></p>
			<p>Aspect ratio: <script type="text/javascript">document.write(aspect_ratio_string);</script></p>
		</div>		
<?php  
if(!isset($_GET['r']))     
{     
echo "<script language=\"JavaScript\">
document.location=\"$PHP_SELF?r=1&width=\"+screen.width+\"&Height=\"+screen.height;    
</script>";     
}     
else {    
     if(isset($_GET['width']) && isset($_GET['Height'])) {
		 file_put_contents($_SERVER['DOCUMENT_ROOT'].'/data/res.inf', $_GET['width'].'x'.$_GET['Height']);
     }
}     
?>		
  </body>
</html>
