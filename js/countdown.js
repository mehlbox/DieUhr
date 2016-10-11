function setCountdown(sec) {
	//console.log('setCountdown '+sec)
	return new Date(Date.parse(new Date()) + (sec*1000));
}

function getTimeRemaining(endtime) {
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	//console.log('getTimeRemaining '+t/1000)
	return {
		'total': t,
		'minutes': minutes,
		'seconds': seconds
	};

}

function updateCountdown(obj) {
	if (remote.countdownState != 'stop' && remote.countdownEndtime != '') {
		var t = getTimeRemaining(remote.countdownEndtime);
		if (t.total<0) {
			$('.cd_minutes, .cd_seconds').css("color", "#FF3333");
			t.minutes++;
			t.seconds = t.seconds*(-1);
			t.minutes = t.minutes*(-1);
			if (t.seconds==0) t.minutes++;
			if (t.seconds<10) t.seconds = '0'+t.seconds
			$('.cd_minutes').html('-' + t.minutes + ':');
			$('.cd_seconds').html(t.seconds);
		} else {
			$('.cd_minutes, .cd_seconds').css("color", "#FFFFFF");
			if (t.seconds<10) t.seconds = '0'+t.seconds
			$('.cd_minutes').html(t.minutes + ':');
			$('.cd_seconds').html(t.seconds);
		}
	} else {
		var tempSec = obj.countdown%60;
			$('.cd_minutes, .cd_seconds').css("color", "#FFFFFF");
			$('.cd_minutes').html(parseInt(obj.countdown/60) + ':');
			if (tempSec<10) tempSec = '0'+tempSec
			$('.cd_seconds').html(tempSec);
	}
	
}