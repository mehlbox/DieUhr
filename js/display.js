var local  = { };
var temp   = { };
var remote = { };

var timerID;
var countdownID;
var displayChange  = 0;
var dateFormat = 'dd.mon.yyyy';

var display = decodeURIComponent(urlParam('display'));
if (display != '') {
	local.tab = display;
} else {
	local.tab = 'Live';
}
if (display == 'main') local.tab = 'Live';

timeloop();