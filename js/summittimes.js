
var beemargin = {top: 60, right: 30, bottom: 50, left: 80},
    beewidth = 800,
    beeheight = 500
var cut = 'Successful ascent';
var prevcut = 'Successful ascent';
var beesvg = d3.select(".beeswarm")
	.append("svg")
	.attr("viewBox", "0 0 " + (beewidth) + " " + (beeheight))
	.attr("class", "beesvg")
	.attr("width", beewidth)
	.attr("height", beeheight)



var parseTime = d3.timeParse("%H:%M")
var parseTime2 = d3.timeParse("%H %p")
var formatTime2 = d3.timeFormat("%I:%M %p")
var formatTime = d3.timeFormat("%H:%M")

var beex = d3.scaleTime()
	.domain([parseTime("00:00"), parseTime("23:59")])
    .range([beemargin.left, beewidth-beemargin.right]);

var timeColorScale = d3.scaleThreshold()
	.domain([parseTime("04:0"),parseTime("05:0"),parseTime("06:0"),parseTime("07:0"),parseTime("08:00"),parseTime("09:00"),parseTime("14:00"),parseTime("15:00"),parseTime("16:00"),parseTime("17:00"),parseTime("18:00"),parseTime("19:00"),parseTime("20:00")])
	.range(['#225ea8','#1d91c0','#41b6c4',"#7fcdbb",'#c7e9b4','#edf8b1','#ffffd9','#edf8b1','#c7e9b4',"#7fcdbb",'#41b6c4','#41b6c4','#1d91c0','#225ea8'])
bartoggles = d3.select(".bartogglediv").append("div")
    .attr("class","bar-histogram-chart-toggle-wrapper")

d3.queue()
    .defer(d3.csv, "data/summittimeanddied.csv",type)
    .defer(d3.csv, "data/summittimeandsuccess.csv",type)
    .await(ready);

function ready(error,died,success) {
	//console.log(died);
	//console.log(success);
	bartoggles
    .append("div")
    .attr("class","histogram-chart-toggle-type")
    .selectAll("p")
    .data(["Successful ascent","Death on descent"])
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
        	if (cut == "Successful ascent") {
        		updateChart(success, [0,200,400,600,800,1000]);
    		} else {
    			updateChart(died, [0,2,4,6,8,10]);
    		}
        }
    });

	var bins = d3.histogram()
		.value(function(d) { return d['MSMTTIME1']; })
	    .domain(beex.domain())
	    .thresholds(beex.ticks(24))
	   (success)

    
    var countScale = d3.scaleLinear()
	    .domain([0, d3.max(bins, function(d) { return d.length; })])
	    .range([beeheight-beemargin.bottom, beemargin.top]);

	bars = beesvg.append('g')
	    .attr("class", "bars")
	var databar = bars.selectAll(".bar")
	  	.data(bins)
	bar = databar
	  	.enter().append("g")
	  	.attr("class", "bar")
	   

	bar.append("rect")
	    .attr("x", function(d) { return beex(d.x0); })
	    .attr("y", function(d) { return countScale(d.length); })
	    .attr("width", beex(bins[0].x1) - beex(bins[0].x0) - 1)
	    .attr("height", function(d) { return beeheight-beemargin.bottom - countScale(d.length); })
	    .attr("fill", function(d) { return timeColorScale(d.x0) });



	barxaxis = beesvg.append("g")
		.attr("class", "bar-x-axis")
	
	xticks = barxaxis.append('g')
		.attr("class", "ticks")
	xtick = xticks.selectAll('g')
		.data(['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'])
		.enter()
		.append('g')
		.attr("class", "tick")
	xtick.append("line")
		.attr("x1", function(d) { return beex(parseTime2(pad(d.split(" ")[0], 2) + " " + d.split(" ")[1]))})
		.attr("x2", function(d) { return beex(parseTime2(pad(d.split(" ")[0], 2) + " " + d.split(" ")[1]))})
		.attr("y1", beemargin.top)
		.attr("y2", beeheight - beemargin.bottom)
		.attr("class", "bar-axis-line")

	xtick.append("text")
		.attr("x", function(d) { return beex(parseTime2(pad(d.split(" ")[0], 2) + " " + d.split(" ")[1]))})
		.attr("y", (beeheight-beemargin.bottom) + 20)
		.attr("text-anchor", "middle")
		.text(function(d) { return d; })
		.attr("class", "text-labels")


	baryaxis = beesvg.append('g')
		.attr('class', 'bar-y-axis')
	yticks = baryaxis.append('g')
		.attr("class", "ticks")

	ytick = yticks.selectAll('g')
		.data([0,200,400,600,800,1000])
		.enter()
		.append('g')
	ytick.append("line")
		.attr("x1", beemargin.left-15)
		.attr("x2", beewidth - beemargin.right)
		.attr("y1", function(d) { return countScale(d); })
		.attr("y2", function(d) { return countScale(d); })
		.attr("class", "bar-axis-line")
	ytick.append("text")
		.text(function(d) { return d; })
		.attr('class', 'text-labels')
		.attr('x', beemargin.left - 25)
		.attr('y', function(d) { return countScale(d); })
		.attr("alignment-baseline", "middle")
		.attr('text-anchor', 'end')

	yticks.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("x",0 - (beeheight / 2))
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text("Number of climbers")
      .attr('class', 'axis-labels');

    xticks.append("text")             
      .attr("transform",
            "translate(" + (beewidth/2) + " ," + 
                           (beeheight-5) + ")")
      .attr("text-anchor", "middle")
      .text("Summit time")
      .attr('class', 'axis-labels');


    var averages = beesvg.append('g')
    	.attr("class", "averages")


    averagesuccess = d3.mean(success.map(function(d) { return d['MSMTTIME1']; }))

    averagedied = d3.mean(died.map(function(d) { return d['MSMTTIME1']; }))

       average = averages.selectAll("g")
    	//.data([averagesuccess, averagedied, parseTime("14:00")])
    	.data([averagesuccess, averagedied])
    	.enter()

    	average.append('line')
    	.attr("class", "guide-lines")
    	.attr("stroke-dasharray", "5, 5")
    	.attr("x1", function(d) { return beex(d)})
		.attr("x2", function(d) { return beex(d)})
		.attr("y1", beemargin.top)
		.attr("y2", beeheight - beemargin.bottom)
		
		average.append("text")
			//.attr("x", function(d) { return beex(d)})
			//.attr("y", beemargin.top - 20)
			.attr("transform", function(d) { return "translate(" + beex(d) + ", " + (beemargin.top-45) + ")"})
			.text(function(d, i){ 
				if (i == 0) {
					return formatTime2(new Date(d)) + " : " + "average summit time for successful descents"
				} else if (i == 1) {
					return formatTime2(new Date(d)) + " : " + "average summit time for those who died on the descent"
				} else {
					return formatTime2(new Date(d)) + " : " + "generally accepted latest safest time to begin descent"
				}
			})
			.attr("class", "avg-label text-labels")
			.attr("text-anchor", "middle")
			.attr("dy", "1em")
			.call(wrap, 140)
			
	

    //averagedied = 


	function updateChart(selectedData,tickData) {
		bins = d3.histogram()
		.value(function(d) { return d['MSMTTIME1']; })
	    .domain(beex.domain())
	    .thresholds(beex.ticks(24))
	   (selectedData)
		countScale = d3.scaleLinear()
		    .domain([0, d3.max(bins, function(d) { return d.length; })])
		    .range([beeheight-beemargin.bottom, beemargin.top]);
		d3.selectAll(".bar")
		  	.data(bins)

		
		bar.select("rect")
			.attr("x", function(d) { return beex(d.x0); })
			.attr("width", beex(bins[0].x1) - beex(bins[0].x0) - 1)
		    .transition()
		    .duration(1500)
		    .attr("y", function(d) { return countScale(d.length); })
		    .attr("height", function(d) { return beeheight-beemargin.bottom - countScale(d.length); });

		yticks.selectAll('g')
		.data(tickData)

		ytick.select(".text-labels").text(function(d) { return d;})




	}






  
}
      


function type(d) {
  if (!d['MSMTTIME1']) {
  	return
  };
  d['MSMTTIME1'] = +d['MSMTTIME1'];
  var minutes = pad(d['MSMTTIME1'] % 100,2);
  var hours = pad((d['MSMTTIME1'] - minutes) / 100,2);
  //console.log(hours + ":" + minutes);
  var time = hours + ":" + minutes
  var parsedtime = parseTime(time)
  d['MSMTTIME1'] = parsedtime;
  return d;
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

var beechart = $(".beesvg");

    beeaspect = beechart.width() / beechart.height(),
     stsvgcontainer = beechart.parent();

$(window).on("resize", function() {


   var targetWidth = stsvgcontainer.width();
   
    beechart.attr("width", targetWidth);
    beechart.attr("height", Math.round(targetWidth / beeaspect));

}).trigger("resize");


