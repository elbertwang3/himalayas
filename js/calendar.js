toggles = d3.select(".calendartooltipdiv").append("div")
    .attr("class","histogram-chart-toggle-wrapper")

var cut = 'All peaks';
var prevcut = 'All peaks';
var chchart;
var chaspect;
var chsvgcontainer;
d3.queue()
    .defer(d3.csv, "data/membersbymonthday.csv")
    .defer(d3.csv, "data/everestbymonthday.csv")
    .await(ready);


function ready(error,all,everest) {
	//console.log(all);
	//console.log(everest);

	parsedAll = parseDates(all)
	parsedEverest = parseDates(everest);

	
	
	//console.log(parsedAll);
	//console.log(parsedEverest);
	var chart1 = calendarHeatmap()
              .data(parsedAll)
              .selector('#chart-one')
              //.colorRange(['#D8E6E7', '#218380'])
              .tooltipEnabled(true)
        	
              .onClick(function (data) {
                console.log('onClick callback. Data:', data);
              });

 
chart1();  // render the chart

chchart = $(".calendar-heatmap");
    chaspect = chchart.width() / chchart.height(),
     chsvgcontainer = chchart.parent();
     targetWidth = chsvgcontainer.width() - 72;
     
      chchart.attr("width", targetWidth);
      chchart.attr("height", Math.round(targetWidth / chaspect));

	toggles
    .append("div")
    .attr("class","histogram-chart-toggle-type")
    .selectAll("p")
    .data(["All peaks","Everest only"])
    .enter()
    .append("p")
    .attr("class","histogram-chart-toggle-item")
    .text(function(d){
      return d;
    })
     .attr("class",function(d,i){
        if(i==0){
          return "toggle-selected front-curve histogram-chart-toggle-item";
        }
        if(i==1){
          return "back-curve histogram-chart-toggle-item";
        }
        return "histogram-chart-toggle-item";
      })
      .text(function(d){
        return d;
      })
      .on("click",function(d){
        //previousChart = currentChart;
        var dataSelected = d;
        d3.select(this.parentNode).selectAll("p").classed("toggle-selected",function(d){
          if(d==dataSelected){
            return true;
          }
          return false;
        })
        prevcut = cut;
        cut = d;
        if (prevcut != cut) {
        	if (cut == "All peaks") {
        		chart1.toggleTransition(parsedAll);
    		} else {
    			chart1.toggleTransition(parsedEverest);
    		}
        }
    });

	/*var chart2 = calendarHeatmap()
              .data(parsedEverest)
              .selector('#chart-two')
              //.colorRange(['#D8E6E7', '#218380'])
              .tooltipEnabled(true)
              .onClick(function (data) {
                console.log('onClick callback. Data:', data);
              });
chart2();  // render the chart*/

	function parseDates(dates) {
		parsed = []
		for (var i = 0; i < dates.length; i++) {
			month = dates[i].month;
			day = dates[i].day;
			year = "2006"
			datestring = year+'-'+month+"-"+day
			counts = parseInt(dates[i].counts);
			date = new Date(datestring)
			parsed.push({'date':date, 'count': counts})

		}
		return parsed;
	}


}


$(window).on("resize", function() {

     var targetWidth = chsvgcontainer.width() - 72;
     
      chchart.attr("width", targetWidth);
      chchart.attr("height", Math.round(targetWidth / chaspect));

   //}
}).trigger("resize");