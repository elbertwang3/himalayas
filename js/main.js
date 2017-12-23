var div = d3.select(".beforesummit"),
height = 500,
width = 800,
margin = {top: 30, bottom: 30, left: 50, right: 30}
svg = div.append("svg")
	.attr("class", "beforesummitsvg")
	.attr("width", width)
	.attr("height", height)

d3.queue()
    .defer(d3.csv, "data/beforesummit.csv")
    .await(ready);
function ready(error,beforesummit) {
	 var parseTime = d3.timeParse("%Y-%m-%d");
	beforesummit.forEach(function(d) {
   
      d['HIGHPOINT'] = +d['HIGHPOINT'];
    
  });
	for (var i = 0; i < beforesummit.length; i++) {
		if (beforesummit[i]['expeddate'] == '1899-12-30 00:00:00') {
			beforesummit[i]['expeddate'] = beforesummit[i]['YEAR'] + "-01-01"
		}
		if (beforesummit[i]['HIGHPOINT'] == 0) {
			if (beforesummit[i+1]['HIGHPOINT'] != 0) {
				beforesummit[i]['HIGHPOINT'] = (beforesummit[i-1]['HIGHPOINT'] + beforesummit[i+1]['HIGHPOINT']) / 2
			} else {
				beforesummit[i]['HIGHPOINT'] = beforesummit[i-1]['HIGHPOINT']
			}
			
		}
	}
	beforesummit.forEach(function(d) {
     d['expeddate'] = parseTime(d['expeddate'])
   
    
  });
	


	 
	console.log(d3.extent(beforesummit, function(d) { 
		if (d['HIGHPOINT'] == 0) { 
			//console.log(d); 
		} 
		return d['HIGHPOINT'];}))

	var bypeak = d3.nest()
	  .key(function(d) { return d['PKNAME']; })
	  .sortValues(function(a,b) { 
	  	console.log()
	  	return a['expeddate'] - b['expeddate']; })
	  .entries(beforesummit);
	 console.log(bypeak);

	 console.log(d3.extent(beforesummit, function(d) { return d['expeddate']; }))
	 var timeScale = d3.scaleTime().domain(d3.extent(beforesummit, function(d) { return d['expeddate']; })).range([margin.left, width-margin.right]);
	 var heightScale = d3.scaleLinear().domain([8850,5500]).range([margin.top, height - margin.bottom])

	 	 var line = d3.line()
    .x(function(d) { 
    	//console.log(timeScale(d['expeddate'])); 
    	return timeScale(d['expeddate']); })
    .y(function(d) { 
    	//console.log(heightScale(d['HIGHPOINT']));
    	return heightScale(d['HIGHPOINT']); });

    var area = d3.area()
    .x(function(d) { return timeScale(d['expeddate']); })
    .y0(height-margin.bottom)
    .y1(function(d) { return heightScale(d['HIGHPOINT']); });

   	mountain = svg.selectAll("g")
    	.data(bypeak)
    	.enter()
    	.append("g")
    	.attr("class", "mountain")

    mountain.append('path')
    	
    	.attr("class", function(d) { return "mountain-line " + d.key;})
      .attr("d", function(d) {  return line(d.values)})
  .on("mouseover", function(d) { 
  	console.log(".mountain-line "+d.key)
  	//mountain.select(d.key).classed('hover', true)
  	d3.selectAll('.'+d.key).classed('hover', true)
  })
  .on("mouseout", function(d) { 
  d3.selectAll('.'+d.key).classed('hover', false)
  });

  	    mountain.append("path")
    	 .attr("class", function(d) { return "mountain-area " + d.key;})
      .attr("d", function(d) {  return area(d.values)})
    

 svg.append("g")
      .attr("transform", "translate(0," + (height-margin.bottom) + ")")
      .call(d3.axisBottom(timeScale));
  svg.append("g")
  .attr("transform", "translate("+margin.left+",0)")
      .call(d3.axisLeft(heightScale));





}