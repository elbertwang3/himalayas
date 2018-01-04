
var beemargin = {top: 30, right: 30, bottom: 30, left: 30},
    beewidth = 1000,
    beeheight = 600

var beesvg = d3.select(".beeswarm")
	.append("svg")
	.attr("class", "beesvg")
	.attr("width", beewidth)
	.attr("height", beeheight)



var parseTime = d3.timeParse("%H:%M")
var formatTime = d3.timeFormat("%H:%M")

var beex = d3.scaleTime()
	.domain([parseTime("00:00"), parseTime("23:59")])
    .range([beemargin.left, beewidth-beemargin.right]);



d3.queue()
    .defer(d3.csv, "data/summittimeanddied.csv",type)
    .defer(d3.csv, "data/summittimeandsuccess.csv",type)
    .await(ready);

function ready(error,died,success) {
	console.log(died);
	console.log(success);




  var simulation = d3.forceSimulation(success)
      .force("x", d3.forceX(function(d) { return beex(d['MSMTTIME1']); }).strength(1))
      .force("y", d3.forceY(beeheight / 2))
      .force("collide", d3.forceCollide(2))
      .stop();

  for (var i = 0; i < 120; ++i) simulation.tick();

  /*beesvg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + (beeheight-beemargin.bottom) + ")")
      .call(d3.axisBottom(beex).ticks(6));

  var beecells = beesvg.append("g")
      .attr("class", "successcells")
      .selectAll("g")
      .data(success)
      .enter()
      .append("g")
      .attr("class", "beecell")
    
	beecells.append("circle")
      .attr("r", 1)
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });*/
	var simulation2 = d3.forceSimulation(died)
      .force("x", d3.forceX(function(d) { return beex(d['MSMTTIME1']); }).strength(1))
      .force("y", d3.forceY(beeheight / 2))
      .force("collide", d3.forceCollide(6))
      .stop();

  for (var i = 0; i < 120; ++i) simulation2.tick();
  

  var beecells2 = beesvg.append("g")
      .attr("class", "diedcells")
      .selectAll("g")
      .attr("transform", "translate(0,150)")
      .data(died)
      .enter()
      .append("g")
      .attr("class", "beecell")

    /*.selectAll("g").data(d3.voronoi()
        .extent([[0, 0], [beewidth, beeheight]])
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
      .polygons(success)).enter().append("g");*/

  beecells2.append("circle")
      .attr("r", 5)
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });

  /*beecell.append("path")
      .attr("d", function(d) { return "M" + d.join("L") + "Z"; });*/

  /*beecells.append("title")
      .text(function(d) { 

      	return d.data['FNAME'] + "\n" + formatTime(d.data['MSMTTIME1']); 
  	})*/
}
      


function type(d) {
  if (!d['MSMTTIME1']) {
  	console.log("shouldn't be null")
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


