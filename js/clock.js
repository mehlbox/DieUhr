var dateFormat = 'dd.mon.yyyy';
	
	function printClock(std, min) {
			var minutes = (min<10?"0":"") + min;
			var hours = (std<10?"0":"") + std;
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
			case "dd.mon.yyyy":
				$(".cl_day").html(day);
				$(".cl_month").html(". "+getNameMonth(month));
				$(".cl_year").html(" "+year);
				break;
		
			default:
				break;
		}
	}

	function getNameMonth(month) {
		months = new Array();
		months = ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
		return months[month-1];
	}
	
    function updateClock(){
		var Datum = new Date();
		var std = Datum.getHours();
		var min = Datum.getMinutes();
		var day = Datum.getDate();
		var month = Datum.getMonth()+1;
		var year = Datum.getFullYear();
		printClock(std, min);
		printDate(day, month, year);
	}


