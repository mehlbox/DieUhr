var local  = { };
var temp   = { };
var remote = { };

var dateFormat = 'dd.mon.yyyy';
var displayChange 	= 10;

var selectDisplay = decodeURIComponent(urlParam('selectDisplay'));
if (selectDisplay != '') {
	local.tab = selectDisplay;
} else {
	local.tab = 'Live';
}

timeloop();

