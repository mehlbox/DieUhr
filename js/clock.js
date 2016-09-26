var leadingZeroHour = 'true';
var dateFormat = 'dd.mon.yyyy';

	if(dateFormat == "dd.mm" || dateFormat == "dd.month" || dateFormat == "dd.mon") {
		$(".cl_year").addClass("hidden");
	}
	
	if(dateFormat == "month.yyyy" || dateFormat == "mon.yyyy") {
		$(".cl_day").addClass("hidden");;
	}	
	
	function printClock(std, min, sec) {
		
			var seconds = (sec < 10 ? "0":"") + sec;
			var minutes = (min<10?"0":"") + min;
			if(leadingZeroHour) {
				var hours = (std<10?"0":"") + std;
			} else {
				var hours = std;
			}
			$('.the_clock').css("color", "white"); // recover from countdown
			//$(".cl_seconds").html(":"+ seconds);
			$(".cl_seconds").html("");
			$(".cl_minutes").html(":"+minutes);
			$(".cl_hours").html(hours);
	}

	function printDate(day, month, year) {
		
		switch(dateFormat) {
			case "dd.mm.yyyy":
				$(".cl_day").html(day);
				$(".cl_month").html("."+month);
				$(".cl_year").html("."+year);
				break;
			case "dd.mm.yy":
				$(".cl_day").html(day);
				$(".cl_month").html("."+month);
				//make it a string
				year +="";
				year = year.substring(2,4);
				$(".cl_year").html("."+year);	
				break;
			case "dd.month.yyyy":
				$(".cl_day").html(day);
				$(".cl_month").html(". "+getFullNameMonth(month));
				$(".cl_year").html(" "+year);
				break;
			case "dd.mon.yyyy":
				$(".cl_day").html(day);
				$(".cl_month").html(". "+getShortNameMonth(month));
				$(".cl_year").html(" "+year);
				break;
			case "month.yyyy":
				$(".cl_month").html(getFullNameMonth(month));
				$(".cl_year").html(" "+year);
				break;
			case "mon.yyyy":
				$(".cl_month").html(getShortNameMonth(month));
				$(".cl_year").html(". "+year);
				break;
			case "dd.month":
				$(".cl_day").html(day);
				$(".cl_month").html(". " +getFullNameMonth(month));
				break;
			case "dd.mon":
				$(".cl_day").html(day);
				$(".cl_month").html(". " +getShortNameMonth(month) + ".");
				break;
			case "dd.mm":
				$(".cl_day").html(day);
				$(".cl_month").html(". " + month + ".");
				break;		
			default:
				break;
		}
	}

	function getFullNameMonth(month) {
		months = new Array();
		months = ["Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
		return months[month-1];
	}
	function getShortNameMonth(month) {
		months = new Array();
		months = ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
		return months[month-1];
	}
    function startClock(){
		
		var Datum = new Date();
		var std = Datum.getHours();
		var min = Datum.getMinutes();
		var sec = Datum.getSeconds();
		var day = Datum.getDate();
		var month = Datum.getMonth()+1;
		var year = Datum.getFullYear();

		
		printClock(std, min, sec);
		printDate(day, month, year);
}


