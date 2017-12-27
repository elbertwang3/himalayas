var input = $("#myinput");
d3.csv("data/geocodedpeaksfinal.csv", function(d) {
	peaklist = []
	for (var i = 0; i < d.length; i++) {

		peaklist.push(d[i]['PKNAME'])

	}
	console.log(peaklist)
})
new Awesomplete(input, {
	list: ["Ada", "Java", "JavaScript", "Brainfuck", "LOLCODE", "Node.js", "Ruby on Rails"]
});