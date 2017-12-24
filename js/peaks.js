peaksdiv = d3.select(".peaks"),
peakswidth = 1200,
peaksheight = 600,
peaksmargin = {top: 30, bottom: 30, left: 30, right: 30},
peakssvg = peaksdiv.append('svg')
	.attr('class', 'peakssvg')
	.attr('width', peakswidth)
	.attr('height', peaksheight)


d3.queue()
    .defer(d3.csv, "data/geocodedpeaksfinal.csv")
    .defer(d3.json, "data/nepal.json")
    .await(ready);

function ready(error,peaks,jsonmap) {
	console.log(error)
	console.log(peaks);
	console.log(jsonmap);
    var projection = d3.geoMercator()
	    .scale(1)
	    .translate([0, 0]);

	// Create a path generator.
	var path = d3.geoPath()
	    .projection(projection);

	// Compute the bounds of a feature of interest, then derive scale & translate.
	console.log(peakswidth)
	console.log(peaksheight);
	var b = path.bounds(jsonmap),
	    s = .9 / Math.max((b[1][0] - b[0][0]) / peakswidth, (b[1][1] - b[0][1]) / peaksheight),
	    t = [(peakswidth - s * (b[1][0] + b[0][0])) / 2, (peaksheight - s * (b[1][1] + b[0][1])) / 2];
	 
	  
	// Update the projection to use computed scale & translate.
	projection
	    .scale(s)
	    .translate(t); 

	mapg = peakssvg.append('g')
			.attr("class", "mapg")
			//.attr("transform", "translate(" + width/2 +", " + height/2 + ")")
	mapg.selectAll("path")
	    .data(jsonmap.features)
	    .enter().append("path")
	     
	    .attr("d", path)
	 	.attr("class", "mountain-path")

	dots = peakssvg.append('g')
			.attr("class", "dotsg")

	dots.selectAll("circle")
		.data(peaks)
		.enter()
		.append("circle")
		.attr("class", "mountain-dot")
		.attr("r", 3)
		 .attr("transform", function(d) {
		 	console.log(d['latitude'])
		 	console.log(d['longitude'])
		    return "translate(" + projection([
		      d['longitude'],
		      d['latitude']
		    ]) + ")";
		});
	   
}