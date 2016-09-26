function getTimeRemaining() {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  return {
    'total': t,
    'minutes': minutes,
    'seconds': seconds
  };
}



function updateCountdown() {
    var t = getTimeRemaining();
	if (t.total<0) { // time up... counting up now
		t.minutes++;
		if (t.seconds==0) t.minutes++;
		if (t.seconds<0) t.seconds = t.seconds*(-1);
		if (t.minutes<0) t.minutes = t.minutes*(-1);
		$('.the_clock').css("color", "#FF3333");
	}
	if (t.seconds<10) t.seconds = '0'+t.seconds
	$('.cl_hours').html('');
    $('.cl_minutes').html(t.minutes + ':');
    $('.cl_seconds').html(t.seconds);
}

function setCountdown(min, sec) {
	endtime = new Date(Date.parse(new Date()) + (min*60*1000) + (sec*1000));
}