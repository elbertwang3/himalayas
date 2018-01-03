d3.queue()
    .defer(d3.csv, "data/membersbymonthday.csv")
    .defer(d3.csv, "data/everestbymonthday.csv")
    .await(ready);

function ready(error,all,everest) {
	console.log(all);
	console.log(everest);

	parsedAll = parseDates(all)
	parsedEverest = parseDates(everest);
	
	console.log(parsedAll);
	console.log(parsedEverest);
	var chart1 = calendarHeatmap()
              .data(parsedAll)
              .selector('#chart-one')
              //.colorRange(['#D8E6E7', '#218380'])
              .tooltipEnabled(true)
              .onClick(function (data) {
                console.log('onClick callback. Data:', data);
              });
chart1();  // render the chart

	var chart2 = calendarHeatmap()
              .data(parsedEverest)
              .selector('#chart-two')
              //.colorRange(['#D8E6E7', '#218380'])
              .tooltipEnabled(true)
              .onClick(function (data) {
                console.log('onClick callback. Data:', data);
              });
chart2();  // render the chart

	function parseDates(dates) {
		parsed = []
		for (var i = 0; i < dates.length; i++) {
			month = dates[i].month;
			day = dates[i].day;
			year = "2016"
			datestring = year+'-'+month+"-"+day
			counts = parseInt(dates[i].counts);
			date = new Date(datestring)
			parsed.push({'date':date, 'count': counts})

		}
		return parsed;
	}
}