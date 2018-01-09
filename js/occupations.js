var ocdiameter = 700;

var ocsvg = d3.select(".occupationsdiv").append("svg")
    .attr("width", ocdiameter)
    .attr("height", ocdiameter)
 ocg = ocsvg.append("g").attr("transform", "translate(2,2)"),
    format = d3.format(",d"),
    margin = 20

    

var pack = d3.pack()
    .size([ocdiameter - 4, ocdiameter - 4])
    .padding(2);

d3.json("data/oc2.json", function(error, root) {
  if (error) throw error;
  //consol
  //console.log(root);
  root = d3.hierarchy(root)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

  var ocnode = ocg.selectAll(".node")
    .data(pack(root).descendants())
    .enter().append("g")
      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  ocnode.append("title")
      .text(function(d) { return d.data.name + "\n" + format(d.value); });

  ocnode.append("circle")
      .attr("r", function(d) { return d.r; })
      .attr("class", "oc-circle");

  ocnode.filter(function(d) { return !d.children; }).append("text")
      .attr("dy", "0.3em")
      .text(function(d) { return d.data.name.substring(0, d.r / 3); });

   function zoom(d) {
    var focus0 = focus; focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }
});