
ratiodiv = d3.select(".ratiodiv")
ratiowidth = 1440
ratioheight = 800
barlength = 20
ratiomargin = {top: 60, bottom: 20, left: 20, right: 20}
togglesdiv = d3.select(".ratiodiv").append("div")
    .attr("class","histogram-chart-toggle-wrapper2")


ratiosvg = ratiodiv.append("svg")
				.attr("class", "ratiosvg")
				.attr("width", ratiowidth)
				.attr("height", ratioheight)


d3.csv('data/ratio.csv', cast, function(data){
	togglesdiv
    .append("div")
    .attr("class","histogram-chart-toggle-type")
    .selectAll("p")
    .data(["All peaks","8000ers only"])
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

    togglesdiv
    .append("div")
    .attr("class","histogram-chart-toggle-type")
    .selectAll("p")
    .data(["Total deaths","Death ratio"])
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
	console.log(data);

	totalwidthscale = d3.scaleLinear()
					.domain([0, d3.max(data, function(d) { return d['countssummits']})])
					.range([0,ratiowidth/2 -ratiomargin.left])
	ratiowidthscale = d3.scaleLinear()
					.domain([0, d3.max(data, function(d) { return d['ratio']})*100])
					.range([0,ratiowidth/2 -ratiomargin.left])
  ratiog = ratiosvg.append("g")
	ratiogs = ratiog.selectAll("g")
					.data(data)
          .enter()
          .append("g")
          //.attr("class", "summit-g")
  summitg = ratiogs.append("g")
        .attr("class", "summit-g")
        .attr("transform", function(d, i) { return "translate(" + ratiowidth/2 + ", " + (ratiomargin.top + i*barlength) +")";})
  summitg.append("rect")
          .attr("class", "summit bar")
          .attr("fill", "red")
          .attr("width", function(d) { return totalwidthscale(d.countssummits)})
          .attr("height", barlength - 1);
  deathg = ratiogs.append("g")
        .attr("class", "death-g")
      
          .attr("transform", function(d,i) { return "translate(" + (ratiowidth/2 - totalwidthscale(d.countsdeaths)) +", " + (ratiomargin.top + i*barlength) + ")";})
          //.attr("transform", "translate(")
	deathg.append("rect")
        .attr("class", "death bar")
        .attr("fill", "blue")
         .attr("width", function(d) { return totalwidthscale(d.countsdeaths)})
    .attr("height", barlength - 1);





})

function cast(d) {

  d.countssummits = +d.countssummits;
  d.countsdeaths = +d.countsdeaths;
  d.ratio = +d.ratio;





  return d;
}