var ocdiameter = 700;

var ocsvg = d3.select(".occupationsdiv").append("svg")
    .attr("width", ocdiameter)
    .attr("height", ocdiameter)
 ocg = ocsvg.append("g").attr("transform", "translate(2,2)"),
    format = d3.format(",d");
    

var pack = d3.pack()
    .size([ocdiameter - 4, ocdiameter - 4]);

d3.json("data/oc2.json", function(error, root) {
  if (error) throw error;
  //consol
  console.log(root);
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
});