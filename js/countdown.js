function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  return {
    'total': t,
    'minutes': minutes,
    'seconds': seconds
  };
}

function updateCountdown(obj) {
    var t = getTimeRemaining(obj.endtime);
	$('.cl_hours').html('');
	if (t.total<0) {
		$('.the_clock').css("color", "#FF3333");
		t.minutes++;
		t.seconds = t.seconds*(-1);
		t.minutes = t.minutes*(-1);
		if (t.seconds==0) t.minutes++;
		if (t.seconds<10) t.seconds = '0'+t.seconds
		$('.cl_minutes').html('-' + t.minutes + ':');
		$('.cl_seconds').html(t.seconds);
	} else {
		$('.the_clock').css("color", "#FFFFFF");
		if (t.seconds<10) t.seconds = '0'+t.seconds
		$('.cl_minutes').html(t.minutes + ':');
		$('.cl_seconds').html(t.seconds);
	}
}

function setCountdown(sec) {
	return new Date(Date.parse(new Date()) + (sec*1000));
}