peaksdiv = d3.select(".peakcontainer"),
peakswidth = 1439,
peaksheight = 637,
peaksmargin = {top: 30, bottom: 30, left: 30, right: 30},
input = document.getElementById("myinput");
himals = ['Unclassified', 'Annapurna', 'Api', 'Damodar', 'Dhaulagiri', 'Ganesh', 'Janak', 'Jongsang', 'Jugal', 'Kangchenjunga', 'Kanjiroba', 'Kanti Palchung', 'Khumbu', 'Langtang', 'Makalu', 'Manaslu', 'Mukut Mustang', 'Nalakanakar', 'Peri', 'Rolwaling', 'Saipal']

peakssvg = peaksdiv.append('svg')
 .attr("viewBox", "0 0 " + (peakswidth) + " " + (peaksheight))
	.attr('class', 'peakssvg')
	.attr('width', peakswidth)
	.attr('height', peaksheight)

var tooltip = d3.select(".peaks")
    .append("div")
    .attr("class","peakstooltip")
    //.style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
    .on("click",function(){
      tooltip.style("visibility",null);
    });
var peakScale = d3.scaleLinear()
					.domain([5000,8850])
					.range([0,150])
var projection = d3.geoMercator()
	    .scale(1)
	    .translate([0, 0]);

	// Create a path generator.
	var path = d3.geoPath()
	    .projection(projection);
d3.queue()
    .defer(d3.csv, "data/geocodedpeaks.csv")
    .defer(d3.json, "data/nepal.json")
    .await(ready);

function ready(error,peaks,jsonmap) {

    

	// Compute the bounds of a feature of interest, then derive scale & translate.
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

	mountainsg = peakssvg.append('g')
			.attr("class", "mountainsg")

	peaklines = peakssvg.append('g')
			.attr("class", "peaklines")
	
	annotations = peakssvg.append('g')
			.attr("class", "annotations")
			.attr("transform", "translate(" +  0.875* peakswidth +", " + 0.15*peaksheight +")");

	//himals = new Set()
	filteredpeaks = peaks.filter(function(d) { return (d['latitude'] != "") && (d['longitude'] != ""); })
	peakstocomplete = filteredpeaks.map(function(d) { return d['PKNAME']; })
	peakrangemap = {}
	for (var i = 0; i < filteredpeaks.length; i++) {
		peakrangemap[filteredpeaks[i]['PKNAME']] = filteredpeaks[i]
	}
	new Awesomplete(input, {
		list: peakstocomplete
	});

	outofboundspeaks = filteredpeaks.filter(function(d) { return (d['latitude'] < 27) || (d['latitude'] > 31) || (d['longitude'] < 80) || (d['longitude'] > 89); })
	
	mountaing = mountainsg.selectAll("g")
		.data(filteredpeaks)
		.enter()
		.append("g")
		.attr("class", "mountain-g")
		.on("mouseover", function(d) {
			var himal = replaceAll(himals[d['HIMAL']] + " range", " ", "-")
			var peakname = replaceAll(d['PKNAME'], " ", "-")
		 	data = d;
		 	d3.selectAll(".mountain-line").classed("mountain-group", false);
		 	d3.selectAll(".mountain-line").classed('mountain-selected', false)
		 	d3.selectAll("." + himal).classed("mountain-group", true);
		 	d3.selectAll("." + peakname).classed('mountain-selected', true)
		 	mouseOverEvents(data,d3.select(this));
		

		})
		.on("mouseout", function(d) {
			var himal = replaceAll(himals[d['HIMAL']] + " range", " ", "-")
			var peakname = replaceAll(d['PKNAME'], " ", "-")
		 	data = d;
		 	d3.selectAll("." + himal).classed("mountain-group", false);
		 	d3.selectAll("." + peakname).classed('mountain-selected', false)
		 	mouseOutEvents(d3.select(this));

		}) 

	mountaing
		.append("circle")
		.attr("class", function(d) {
			var himal = replaceAll(himals[d['HIMAL']] + " range", " ", "-")
			var peakname = replaceAll(d['PKNAME'], " ", "-")
			return "mountain-dot " + himal + " " + peakname;
		})
		.attr("r", 1.5)
		.attr('cx', function(d) { coordinate = projection([d['longitude'],d['latitude']]); return coordinate[0]; })
		.attr('cy', function(d) { coordinate = projection([d['longitude'],d['latitude']]); return coordinate[1]; })
		
	mountaing
		.append("line")
		.attr("class", function(d) {
			var himal = replaceAll(himals[d['HIMAL']] + " range", " ", "-")
			var peakname = replaceAll(d['PKNAME'], " ", "-")
			return "mountain-line " + himal + " " + peakname;
		})
		.attr('x1', function(d) { coordinate = projection([d['longitude'],d['latitude']]); return coordinate[0]; })
		.attr('y1', function(d) { coordinate = projection([d['longitude'],d['latitude']]); return coordinate[1]; })
		.attr('x2', function(d) { coordinate = projection([d['longitude'],d['latitude']]); return coordinate[0]; })
		.attr('y2', function(d) { coordinate = projection([d['longitude'],d['latitude']]); return coordinate[1] - peakScale(d['HEIGHTM']); })
		.attr("opacity",0)


	document.getElementById('myinput').addEventListener("awesomplete-select", function(event) {

	   	var himal = replaceAll(himals[peakrangemap[event.text.label]['HIMAL']] + " range", " ", "-");
			var peakname = replaceAll(event.text.label, " ", "-")
	    d3.selectAll("." + himal).classed("mountain-group", true);
		 	d3.selectAll("." + peakname).classed('mountain-selected', true)
		 	mouseOverEvents(peakrangemap[event.text.label],d3.select(this));
	});
	document.getElementById('myinput').addEventListener("awesomplete-open", function(event) {
		 d3.selectAll(".mountain-line").classed("mountain-group", false);
		 	d3.selectAll(".mountain-line").classed('mountain-selected', false)
		 	mouseOutEvents(d3.select(this));

	  
	});

	var annotation = annotations.selectAll("g")
		.data(["First summiters", "First summit date"])
		.enter()
		.append('g')

		.attr("transform", function(d,i) { return "translate(0," + i * 150 +")"})
		
	annotation
		.append("text")
		.attr("text-anchor", "end")
			.attr("class", "labels")
		.text(function(d) { return d;})

	summitinfo = annotation
			.append("text")
			.attr("class", "summit-info")
			.attr("text-anchor", "end")
			.attr("transform", "translate(0,12)")
			.text("Mouse over peaks for more information")
			.attr("dy", "0.5em")
			
		
			




	function mouseOverEvents(data, element) {
    	tooltip.selectAll("div").remove();

    	var tooltipcontainer = tooltip.append("div");
					

      	tooltipheader = tooltipcontainer.append("div")
						.attr("class", "tooltip-header")
						.text(data['PKNAME'] + ", " + himals[data['HIMAL']] + " Himal" + ", " + data['HEIGHTM'].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"m")
					
		
		summitinfo
			.text(function(d,i) { 
		
				if (i==0) {

					return data['PSUMMITERS'];
				}
				else {
					if (data['PYEAR'] == 0) {
						return "Unclimbed"
					}
					return data['firstsummitdate'];
				}
			})
			.attr("dy", "1em")
			.call(wrap, 325);

		tooltip
          .style("visibility","visible")
          .style("top",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "250px";
            }*/

            return projection([data['longitude'],data['latitude']])[1] - peakScale(data['HEIGHTM']) - 40 + "px"
          })
          .style("left",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "0px";
            }*/
            
            return  projection([data['longitude'],data['latitude']])[0]-40 +"px"
          })

	}

	function mouseOutEvents(element) {
    	/*if (!mobile) {
	    	gannotation.selectAll(".annotation-number").remove();
	    	gannotation.append('text')
				.text(function(d) { 
					if (!(d=="How Moore fared compared to Trump in 2016")) {
						return "-25%";
					} else {
						return '-10%';
					}
				})
				.attr("y", function(d, i) { return i * height/5;})
				.attr("dx", "2.5em")
				.attr("class", "annotation-number")
				.attr("dy", "2.5em")
		}*/

    	tooltip
       		.style("visibility",null);
	}
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
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
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", 0.5 + "em");
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

var peakschart = $(".peakssvg"),
    peaksaspect = peakschart.width() / peakschart.height(),
     peakscontainer = peakschart.parent();
$(window).on("resize", function() {

   var targetWidth = peakscontainer.width();
   if (targetWidth > window.innerWidth) {
      targetWidth = window.innerWidth;
   }
    peakschart.attr("width", targetWidth);
    peakschart.attr("height", Math.round(targetWidth / peaksaspect));
    /*var b = path.bounds(jsonmap),
	    s = .95 / Math.max((b[1][0] - b[0][0]) / targetWidth, (b[1][1] - b[0][1]) / (targetWidth / peaksaspect)),
	    t = [(targetWidth - s * (b[1][0] + b[0][0])) / 2, ((targetWidth / peaksaspect) - s * (b[1][1] + b[0][1])) / 2];
	 
	  
	// Update the projection to use computed scale & translate.
	projection
	    .scale(s)
	    .translate(t); */
}).trigger("resize");