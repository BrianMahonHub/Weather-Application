var $ = function(id) {
	return document.getElementById(id);
}

var getHTTPObject = function() {
	var xhr = false;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
			xhr = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
		try{
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		} catch(e) {
			xhr = false;
			}
		}
	}
return xhr;
}

var getWeatherURL = function(url) {
	var request = getHTTPObject();
	if (request) {
		request.onreadystatechange = function() {
		parseResponse(request);
	};
	request.open("GET", url, true);
	request.send(null);
	}
}

var parseResponse = function(request){
	if (request.readyState == 4)
		if (request.status == 200 || request.status == 304) {
		console.log(request.responseXML);
		var data = request.responseXML;
		
		//Main Info Panel	
		var city = data.getElementsByTagName("name")[0].firstChild.nodeValue;
		var country = data.getElementsByTagName("country")[0].firstChild.nodeValue;
		var weather = data.getElementsByTagName("symbol")[0].getAttribute("name");
		var windspeed = data.getElementsByTagName("windSpeed")[0].getAttribute("mps");
		var winddir = data.getElementsByTagName("windDirection")[0].getAttribute("name");
		var date = data.getElementsByTagName("time")[0].getAttribute("day");
		var symbol = data.getElementsByTagName("symbol")[0].getAttribute("var");
		var days = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat','Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
		    
			document.getElementById("weatherPanel1").innerHTML =
			"<h3 style='text-align:center' >Showing Weather for <strong>" + city + ", " + country + "</strong></h3><h3 style='text-align:center' > Today's Forecast is: " + 
			weather +"<img src='http://openweathermap.org/img/w/" +symbol+ ".png' </h3>" 
			+ "<h5 style='text-align:center'> Current Windspeed : " + windspeed +" m/s </h5>" + "<h5 style='text-align:center'> Current Wind Direction : " + winddir + "</h5><br> <h4 style='text-align:center' > Next 7 day forecast </h4>" ;
		//End of Info Panel
	
	
			//Seven Day Weather Display
			var i;
			var table = "<table>";
			var x = data.getElementsByTagName("temperature");
			var s = data.getElementsByTagName("symbol");
			var ti = data.getElementsByTagName("time");
				for (i = 0; i <x.length; i++) { 
				table += "<td>" + days[new Date().getDay()+(i)] + "<br>" + x[i].getAttribute("day")+"&deg;C" + 
				"<br>" + " <img src='http://openweathermap.org/img/w/" + s[i].getAttribute("var") + ".png' </td></table>"	}
				document.getElementById("seven").innerHTML = table;
			//End of display

			//Maximum & Minimum Teperature Chart
			google.charts.load('current', {'packages':['corechart']});
			google.charts.setOnLoadCallback(drawChart2);
			var t = data.getElementsByTagName("temperature");
				function drawChart2() {
					var data = google.visualization.arrayToDataTable([
						['Day', 'Min Temp', 'Max Temp'],
						[days[new Date().getDay()], parseFloat(t[0].getAttribute("min")), parseFloat(t[0].getAttribute("max"))],
						[days[new Date().getDay()+1], parseFloat(t[1].getAttribute("min")), parseFloat(t[1].getAttribute("max"))],
						[days[new Date().getDay()+2], parseFloat(t[2].getAttribute("min")), parseFloat(t[2].getAttribute("max"))],
						[days[new Date().getDay()+3], parseFloat(t[3].getAttribute("min")), parseFloat(t[3].getAttribute("max"))],
						[days[new Date().getDay()+4], parseFloat(t[4].getAttribute("min")), parseFloat(t[4].getAttribute("max"))],
						[days[new Date().getDay()+5], parseFloat(t[5].getAttribute("min")), parseFloat(t[5].getAttribute("max"))],
						[days[new Date().getDay()+6], parseFloat(t[6].getAttribute("min")), parseFloat(t[6].getAttribute("max"))],
						]);

				var options = {
					title: 'Maximum & Minimum Temperatures in the next seven Days',
					curveType: 'function',
					legend: { position: 'bottom' }
				};
			var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
			chart.draw(data, options);
			}
			//End of Chart
			
			//Precipitation Pie Chart
			google.charts.load("current", {packages:["corechart"]});
			google.charts.setOnLoadCallback(drawChart);
			var pr = data.getElementsByTagName("precipitation");
				function drawChart() {
					var data = google.visualization.arrayToDataTable([
						['Day', 'precipitation'],
						[days[new Date().getDay()],parseFloat(pr[0].getAttribute("value"))],
						[days[new Date().getDay()+1],parseFloat(pr[1].getAttribute("value"))],
						[days[new Date().getDay()+2],parseFloat(pr[2].getAttribute("value"))],
						[days[new Date().getDay()+3],parseFloat(pr[3].getAttribute("value"))],
						[days[new Date().getDay()+4],parseFloat(pr[4].getAttribute("value"))],
						[days[new Date().getDay()+5],parseFloat(pr[5].getAttribute("value"))],
						[days[new Date().getDay()+6],parseFloat(pr[6].getAttribute("value"))],
						]);
						
				var options = {
					title: 'Which days will contain the most rainfall in the next week?',
					is3D: true,
					legend: {'position':'right','alignment':'center'},
					pieSliceBorderColor: 'white',
				};
			var chart = new google.visualization.PieChart(document.getElementById('piechart3d'));
			chart.draw(data, options);
			}
			//End of Chart
	
	}
}


window.onload = function(){
	
	$("submit").onclick = function(){
	var city = $("city").value;
	console.log(city);

	var url = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&mode=xml&cnt=7&units=metric&APPID=4b5718e28569f208a9ca84f80014d617";
	getWeatherURL(url);
	}
	$("city").focus();
}