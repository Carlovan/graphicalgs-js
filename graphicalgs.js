function _swap(dest, elem1, elem2, duration){
	var surface = d3.select(dest);
	var rect1 = surface.select(elem1),
	    rect2 = surface.select(elem2);

	var x1 = rect1.attr("x"), y1 = rect1.attr("y");
	var x2 = rect2.attr("x"), y2 = rect2.attr("y");
	console.log(x1, y1, x2, y2);
}

function drawArray(dest, data, color, options){
	/* VALID OPTIONS
	 * horizontal: bool, if horizontal bar chart
	 * animDuration: int, duration of the animation in ms
	 * highlight: list, indexes of the elements to be highlighted
	 * hlcolors: list, colors for highlighting
	 * swap: list, two elements to swap with animation
	 * swapTime: int, duration of the swap animation in ms
	 */


	//Default values
	var defHorizontal = false,
	    defAnimDuration = 0,
	    defHighlight = [],
	    defHlcolors = [],
	    defSwap = [],
	    defSwapTime = 0,
	    defOptions = {};

	if(options === null || typeof options !== 'object')
		options = defOptions;

	if(options.horizontal === undefined)
		options.horizontal = defHorizontal;
	if(options.animDuration === undefined)
		options.animDuration = defAnimDuration;
	if(options.highlight === undefined)
		options.highlight = defHighlight;
	if(options.hlcolors === undefined)
		options.hlcolors = defHlcolors;
	if(options.swap === undefined)
		options.swap = defSwap;
	if(options.swapTime === undefined)
		options.swapTime = defSwapTime;

	var surface = d3.select(dest);

	var surfH = surface.node().getBoundingClientRect().height;
	var surfW = surface.node().getBoundingClientRect().width;
	var dim1 = "height";
	var dim2 = "width";

	if(options.swap.length != 2 || options.swap[0] == options.swap[1]){
		options.swap = [];
	}

	if(options.horizontal){
		var temp = surfH;
		surfH = surfW;
		surfW = temp;
		
		temp = dim1;
		dim1 = dim2;
		dim2 = temp;
	}

	//Space betwwen 2 rectangles
	var rectSpace = surfW/(data.length+1) / 10;

	//Width of a rectangle
	var rectW = (surfW - rectSpace * (data.length+1)) / data.length;

	//Function to calculate the height proportionally
	var heightCalc = d3.scale.linear()
		.domain([0, d3.max(data)])
		.range([0, surfH - 5]);

	//Chart selection
	var chart = surface.selectAll("rect").data(data);

	//Fade out the unused bars
	chart.exit().transition().duration(options.animDuration).attr("fill-opacity", "0.0").remove();

	//Create new bars
	chart.enter().append("svg:rect")
		.attr("fill-opacity", "0.0");	//Transparent for fade in

	//Handle all bars
	chart.transition().duration(options.animDuration)
		.attr(dim1, function(d, i) {return heightCalc(d); } )
		.attr(dim2, rectW)
		.attr("fill-opacity", "1.0")
		.attr("fill", function(d, i) {
			if(options.highlight.indexOf(i) >= 0){
				if(options.highlight.indexOf(i) < options.hlcolors.length)
					return options.hlcolors[options.highlight.indexOf(i)];
				else
					return options.hlcolors[options.hlcolors.length-1];
			}
			return color;
		})
		.attr("x", function(d, i){if(!options.horizontal) return (i*rectW+(i+1)*rectSpace); else return 0;})
		.attr("y", function(d, i){if(!options.horizontal) return (surfH-heightCalc(d)); else return (i*rectW+(i+1)*rectSpace);});

}
