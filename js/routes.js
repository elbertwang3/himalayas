mapboxgl.accessToken = 'pk.eyJ1IjoiZWxiZXJ0d2FuZyIsImEiOiJjajk3dmw4amUwYmV2MnFydzl3NDIyaGFpIn0.46xwSuceSuv2Fkeqyiy0JQ';
var routemap = new mapboxgl.Map({
    container: 'routesdiv',
    zoom: 13,
    minZoom: 12,
    center: [86.908278,27.988056],
    style: 'mapbox://styles/mapbox/dark-v9',
    //style: 'mapbox://styles/mapbox/outdoors-v9',
    hash: false,
    trackResize: true
    /*pitch: 60,
    bearing: 30*/
});

routemap.scrollZoom.disable();
routemap.addControl(new mapboxgl.NavigationControl());

routewidth = 1220;
routeheight = 650;
 var routecontainer = routemap.getCanvasContainer()
 var routesvg = d3.select(routecontainer).append("svg")
		.attr("width", routewidth)
		.attr("height", routeheight)
		.attr("class", "routesvg")

var routetooltip = d3.select("#routesdiv")
    .append("div")
    .attr("class","routetooltip")
    //.style("transform", "translate(" + margin.left+"px" + "," + margin.top+"px" + ")")
    .on("click",function(){
      tooltip.style("visibility",null);
    });
 function getD3() {
      var bbox = document.getElementById("routesdiv").getBoundingClientRect();
      var center = routemap.getCenter();
      var zoom = routemap.getZoom();
      // 512 is hardcoded tile size, might need to be 256 or changed to suit your map config
      var scale = (512) * 0.5 / Math.PI * Math.pow(2, zoom);

      var d3projection = d3.geoMercator()
        .center([center.lng, center.lat])
        .translate([bbox.width/2, bbox.height/2])
        .scale(scale);

      return d3projection;
    }

var d3projection = getD3();
var geoPath = d3.geoPath()

d3.queue()
    //.defer(d3.csv, "data/routefirsts.csv")
    .defer(d3.json, "data/routes2.json")
    .await(ready);

function ready(error,jsonmap) {
	lines = jsonmap.features.filter(function(d) { return d['geometry']['type'] == "LineString"})
	points = jsonmap.features.filter(function(d) { return d['geometry']['type'] == "Point"})
	numsummits = lines.map(function(d) { 
		return {route: d['properties']['route'], numsummits: +d['properties']['numsummits']};
	}).sort(sortNumber)
	
      //console.log(data[0], getLL(data[0]), project(data[0]))
    var routesgroup = routesvg.append("g")
    	.attr("class", "routes")

    routes = routesgroup
    	.selectAll("routeline")
        .data(lines)
        .enter()
    route = routes.append("path")
    	.attr("class", 'routeline')
    	.attr("stroke", "black")
    	.attr("fill", "none")
    	.on("mouseover", function(d) {
    		d3.selectAll(".routeline").classed("hover", false);
    		d3.select(this).classed("hover", true)
    		d3.select(this)
    			.attr("stroke-dashoffset", function(d) { 
    				if (d['properties']['route'] == 'Canadian Variation' || d['properties']['route'] == "Lho La-W Ridge" || d['properties']['route'] == 'W Ridge-N Face (Hornbein Couloir)') {
    					return d3.select(this).node().getTotalLength(); 
    				} else {
    				return -d3.select(this).node().getTotalLength();
    			 }
    			})
    			.transition()
		        .duration(2000)
		        .ease(d3.easeLinear)
		        .attr("stroke-dashoffset", 0);
		 	data = d['properties'];
		 	
		 	d3.select(this).moveToFront()
		 	mouseOverEvents(data,numsummits,d3.select(this));
		

		})
		.on("mouseout", function(d) {
		
		 	data = d;
		 	mouseOutEvents(d3.select(this));

		}) 
      
   	var markersgroup = routesvg.append("g")
   		.attr("class", "markers")



   	markers = markersgroup
   		.selectAll("marker")
        .data(points)
        .enter()
    
     marker = markers.append("text")
     .attr("class", function(d) { 

     	var className = replaceAll(d['properties']['point'], " ", "-") + " marker";
     	return className;
     })
     .text(function(d) { return d['properties']['point']})
      /*routes.enter().append("path")
      .attr("class", "routepath")
      .attr("stroke", "black")
      .attr("stroke-width", 2)*/

     function render() {
     	d3projection = getD3()
     	geoPath.projection(d3projection);

   

 
     	 marker
        	.attr("x", function(d) { 
	            var x = d3projection(d.geometry.coordinates)[0];
	            return x; 
        	})
        	.attr("y", function(d) { 
	            var y = d3projection(d.geometry.coordinates)[1];
	            return y
          	})

     
        route
     		.attr("d", geoPath)
     		.attr("stroke-dasharray", function(d) { console.log(d3.select(this).node().getTotalLength());return d3.select(this).node().getTotalLength() + " " + d3.select(this).node().getTotalLength()})
      		.attr("stroke-dashoffset", function(d) { return 0; })

    }
    function mouseOverEvents(data, numsummits, element) {
    	routetooltip.selectAll("div").remove();

    	var tooltipcontainer = routetooltip.append("div");
					

      	tooltipheader = tooltipcontainer.append("div")
						.attr("class", "tooltip-header")
						.text(data['route']);

		summiters = tooltipcontainer
			.append("div")
			.attr("class", "row")
		
		summiters.selectAll("div")
			.data(['First summiters', data['firstsummiters']])
			.enter()
			.append("div")
			.text(function(d) { return d;})
			.attr("class", function(d,i) { 
				if (i == 0) {
					return "column-left";
				} else {
					return "column-right";
				}
			})
				

		country = tooltipcontainer
			.append("div")
			.attr("class", "row")
		
		country.selectAll("div")
			.data(['Sponsoring country', data['nation']])
			.enter()
			.append("div")
			.text(function(d) { return d;})
			.attr("class", function(d,i) { 
				if (i == 0) {
					return "column-left";
				} else {
					return "column-right";
				}
			})
			.append("img")
			.attr('src', function(d,i) { 
				if (i == 0) {
					return null;
				} else {
				return "images/"+ replaceAll(data['nation'], " ", "-") +"flag.png"; }
			});
		timeparser = d3.timeParse("%Y-%m-%d")
		timeformatter = d3.timeFormat("%b %d, %Y")
		date = tooltipcontainer
			.append("div")
			.attr("class", "row")
		
		date.selectAll("div")
			.data(['Summit date', timeformatter(timeparser(data['summitdate']))])
			.enter()
			.append("div")
			.text(function(d) { return d;})
			.attr("class", function(d,i) { 
				if (i == 0) {
					return "column-left";
				} else {
					return "column-right";
				}
			})
			

		ttwidth = 360
		ttheight = 35
		ttmargin = {top: 5, bottom: 5, left: 5, right: 5}
		datesvg = tooltipcontainer.append("div")
					.attr("class", "timelinediv")
					.append('svg')
					.attr("class", "datesvg")
					.attr("width", ttwidth)
					.attr("height", ttheight)


		dateTimeScale = d3.scaleTime()
							.domain([timeparser("1953-05-29"), timeparser("2017-06-01")])
							.range([ttmargin.left, ttwidth-ttmargin.right])
		 datesvg.append("g")
		    .attr("transform", "translate(0," + ttheight/2 + ")")
		    .call(d3.axisBottom(dateTimeScale).ticks(5));
      	datesvg.append("circle")
	      	.attr("fill", "#EE7600")
	      	.attr("r", 5)
	      	.attr("cx", function(d) {  return dateTimeScale(timeparser(data['summitdate']))})
      		.attr("cy", ttheight/2)

      	num = tooltipcontainer
			.append("div")
			.attr("class", "row")
		
		num.selectAll("div")
			.data(['Number of summits'])
			.enter()
			.append("div")
			.text(function(d) { return d;})
			.attr("class", "num-label")

		

      	barheight = 20

      	stackedbarsvg = tooltipcontainer.append("div")
					.attr("class", "stackedbardiv")
					.append('svg')
					.attr("class", "stackedbarsvg")
					.attr("width", ttwidth)
					.attr("height", barheight)
		barwidthscale = d3.scaleLinear()
						.domain([0, 8219])
						.range([0, ttwidth-40])
		
		//console.log(sumnumsummits);
		numnumsummits = numsummits.map(function(d) { return +d['numsummits']})
		sumnumsummits = numnumsummits.map(function(d,i) { return d3.sum(numnumsummits.slice(0,i))})
		stackedbarsvg.selectAll("rect")
			.data(numsummits)
			.enter()
			.append("rect")
			.attr("fill", function(d) { 
				if (data['route'] == d['route']) {
					return '#EE7600';
				} else {
					return "#ececec";
				}
			})
				
			.attr("height", barheight)
			.attr("width", function(d) { return barwidthscale(d['numsummits'])})
			.attr("x", function(d,i) { return barwidthscale(sumnumsummits[i]); })

		stackedbarsvg.append('text')
			.text(data['numsummits'])
			.attr("text-anchor", "start")
			.attr('x', ttwidth-35)
			.attr('y', barheight-5)		
		
		

		routetooltip
          .style("visibility","visible")
          .style("top",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "250px";
            }*/

            return (routeheight* 0.59) +"px"
          })
          .style("left",function(d){
            /*if(viewportWidth < 450 || mobile){
              return "0px";
            }*/
            
            return 10 +"px";
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

    	/*routetooltip
       		.style("visibility",null);*/
	}
       
    routemap.on("viewreset", function() {
        render()
    })
      routemap.on("move", function() {
        render()
    })



    render()




}

d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
function sortNumber(a,b) {
    return b['numsummits']-a['numsummits'];
}