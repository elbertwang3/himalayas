mapboxgl.accessToken = 'pk.eyJ1IjoiZWxiZXJ0d2FuZyIsImEiOiJjajk3dmw4amUwYmV2MnFydzl3NDIyaGFpIn0.46xwSuceSuv2Fkeqyiy0JQ';
console.log("getting here?")
var routemap = new mapboxgl.Map({
    container: 'routesdiv',
    zoom: 13,
    minZoom: 13,
    center: [86.925278,27.988056],
    style: 'mapbox://styles/mapbox/satellite-v9',
    //style: 'mapbox://styles/mapbox/outdoors-v9',
    hash: false,
    trackResize: true
    /*pitch: 60,
    bearing: 30*/
});

routemap.scrollZoom.disable();
routemap.addControl(new mapboxgl.NavigationControl());
 var routecontainer = routemap.getCanvasContainer()
 var routesvg = d3.select(routecontainer).append("svg")
		.attr("width", 1220)
		.attr("height", 650)
		.attr("class", "routesvg")

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
	console.log(lines);
	console.log(points);
	
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
      
   	var markersgroup = routesvg.append("g")
   		.attr("class", "markers")

   	markers = markersgroup
   		.selectAll("marker")
        .data(points)
        .enter()
    
    marker = markers.append("circle")
     .attr("class", "marker")
      .attr("r", 5)
     .attr("fill", "black")
     .attr("stroke", "black")
     .on('mouseover', function(d) { console.log("getting moused over")})
      /*routes.enter().append("path")
      .attr("class", "routepath")
      .attr("stroke", "black")
      .attr("stroke-width", 2)*/

     function render() {
     	console.log("rendering");
     	d3projection = getD3()
     	geoPath.projection(d3projection);

   

 
     	 marker
        	.attr("cx", function(d) { 
	            var x = d3projection(d.geometry.coordinates)[0];
	            return x; 
        	})
        	.attr("cy", function(d) { 
	            var y = d3projection(d.geometry.coordinates)[1];
	            return y
          	})

        route
     		.attr("d", geoPath)

       }
       
    routemap.on("viewreset", function() {
        render()
      })
      routemap.on("move", function() {
        render()
      })



     render()




}