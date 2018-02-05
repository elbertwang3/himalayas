var ocdiameter = 600;

var ocsvg = d3.select(".occupationsdiv").append("svg")
.attr("viewBox", "0 0 " + (ocdiameter) + " " + (ocdiameter))
    .attr("width", ocdiameter)
    .attr("height", ocdiameter)
    .attr("class", "ocsvg")
 ocg = ocsvg.append("g").attr("transform", "translate(" + ocdiameter / 2 + "," + ocdiameter / 2 + ")");
    format = d3.format(",d"),
    ocmargin = 20

    

var pack = d3.pack()
    .size([ocdiameter - 4, ocdiameter - 4])
    .padding(2);


/*var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);*/

var pack = d3.pack()
    .size([ocdiameter - ocmargin, ocdiameter - ocmargin])
    .padding(2);

d3.json("data/oc2.json", function(error, root) {
  if (error) throw error;

  root = d3.hierarchy(root)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

  var focus = root,
      ocnodes = pack(root).descendants(),
      view;

  var occircle = ocg.selectAll("circle")
    .data(ocnodes)
    .enter().filter(function(d){ return d.parent; }).append("circle")
      .attr("class", function(d) { return d.parent ? d.children ? "node node--cat" : "node node--leaf" : "node node--root"; })
      //.style("fill", function(d) { return d.children ? color(d.depth) : null; })
      .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

      d3.selectAll(".node--cat")
        .attr("stroke", "#41b6c4")
        //.attr("stroke-width", 2)
        .attr("fill", "#c7e9b4")
      d3.selectAll(".node--leaf")
        .attr("fill", "#7fcdbb")
        .attr("stroke", "#41b6c4")
        //.attr("opacity", 0.8)
        //.attr("stroke-width")
 
  var text = ocg.selectAll("text")
    .data(ocnodes)
    .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .text(function(d) { return d.data.name; });

  var ocnode = ocg.selectAll("circle,text");

  ocsvg
     //.style("background", "black")
      .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + ocmargin]);

  function zoom(d) {
    var focus0 = focus; focus = d;

    var octransition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + ocmargin]);
          return function(t) { zoomTo(i(t)); };
        });

    octransition.selectAll(".ocsvg .label")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function zoomTo(v) {
    var k = ocdiameter / v[2]; view = v;
    ocnode.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    occircle.attr("r", function(d) { return d.r * k; });
  }
});

var chart = $(".ocsvg");
    ocaspect = chart.width() / chart.height(),
     ocsvgcontainer = chart.parent();
     console.log(chart);
     console.log(ocsvgcontainer);
$(window).on("resize", function() {

   var targetWidth = ocsvgcontainer.width();
   
    chart.attr("width", targetWidth);
    chart.attr("height", Math.round(targetWidth / ocaspect));

}).trigger("resize");
  