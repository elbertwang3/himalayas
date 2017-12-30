
mapboxgl.accessToken = 'pk.eyJ1IjoiZWxiZXJ0d2FuZyIsImEiOiJjajk3dmw4amUwYmV2MnFydzl3NDIyaGFpIn0.46xwSuceSuv2Fkeqyiy0JQ';
var map = new mapboxgl.Map({
	container: 'countriesmap', // container id
	style: 'mapbox://styles/mapbox/light-v9', // stylesheet location
	center: [1.6596, 28.0339], // starting position [lng, lat]
	zoom: 1.3 // starting zoom
});
   map.scrollZoom.disable()
    map.addControl(new mapboxgl.NavigationControl());


// Setup our svg layer that we can manipulate with d3
var container = map.getCanvasContainer()

countrieswidth = $("#countriesmap").width()
countriesheight = $("#countriesmap").height()
var mapsvg = d3.select(container).append("svg")
	.attr("class", "countriessvg")
	//.attr("width", countrieswidth)
	//	.attr("height", countriesheight)

// we calculate the scale given mapbox state (derived from viewport-mercator-project's code)
// to define a d3 projection
function getD3() {
	var bbox = document.body.getBoundingClientRect();

	var center = map.getCenter();

    var zoom = map.getZoom();

    // 512 is hardcoded tile size, might need to be 256 or changed to suit your map config
    
    var scale = (512) * 0.5 / Math.PI * Math.pow(2, zoom);
  
  var d3projection = d3.geoMercator()
	     .center([center.lng, center.lat])
        .translate([bbox.width/2, bbox.height/2])
        .scale(scale);


  return d3projection;


}

function projectPoint(lon, lat) {
        var point = map.project(new mapboxgl.LngLat(lon, lat));
		this.stream.point(point.x, point.y);
	}
// calculate the original d3 projection

var d3Projection = getD3();
var countriespath = d3.geoPath().projection(d3Projection);



var url = "data/geocodedmemberstest.csv";
d3.csv(url, function(err, data) {

  //console.log(data[0], getLL(data[0]), project(data[0]))
  var arcs = mapsvg.selectAll(".arc")
	.data(data)
  
  arc = arcs.enter().append("path")
  .attr("class", "arc")
  .attr("fill", "none")
  .attr("stroke", "black")
  	.attr("d", linkArc);

  /*var dots = mapsvg.selectAll("circle.dot")
        .data(data)
 dots.enter().append("circle")
 		.attr("class", "dot")
      .attr("fill", "#0082a3")
      .attr("opacity", 0.6)
      .attr("stroke", "black")
      .attr("r", 6)
        .attr("cx", function(d) { 

            var x = d3Projection([d['longitude'],d['latitude']])[0];

            return x
        })
     	.attr("cy", function(d) { 
            var y = d3Projection([d['longitude'],d['latitude']])[1];
      
            return y
        })*/
  
  function render() {
  	console.log("rendering")
	d3Projection = getD3();
	countriespath.projection(d3Projection)
	console.log(dots);
	/*dots
        .attr("cx", function(d) { 
        	console.log("not rerendering?")
            var x = d3Projection([d['longitude'],d['latitude']])[0];
            return x
        })
     	.attr("cy", function(d) { 
            var y = d3Projection([d['longitude'],d['latitude']])[1];
            return y
        })*/
	arc
		.attr("d", linkArc);

  }

  

  function linkArc(d) {
  	console.log(d);
  	target = d3Projection([86.9250,27.9878])
  	source = d3Projection([d['longitude'],d['latitude']])
  var dx = target[0] - source[0],
      dy = target[0] - source[1]
      dr = Math.sqrt(dx * dx + dy * dy);
  return "M" + source[0] + "," + source[1] + "A" + dr + "," + dr + " 0 0,1 " + target[0]+ "," + target[1];
}

  // re-render our visualization whenever the view changes
  map.on("viewreset", function() {
	render()
  })
  map.on("move", function() {
	render()
  })

  // render our initial visualization
  render()
})
