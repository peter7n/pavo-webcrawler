var ns = "http://www.w3.org/2000/svg";
var nodeCounter = 0;

function calcSvgSize(svg, nodeCount) {
	// Calculate maximum svg width and height
	var maxLeft = 0;
	var maxTop = 0;
	for (var i = 1; i < nodeCount; i++) {
		var urlNode = $("#ID-" + (i + 1));
		var offset = urlNode.offset();
		if (offset.left > maxLeft)
			maxLeft = offset.left;
		if (offset.top > maxTop)
			maxTop = offset.top;
	}
	svg.setAttributeNS(null, "width", maxLeft);
	svg.setAttributeNS(null, "height", maxTop);
}

function drawLines(webcrawlResults, svg, nodeCount) {
	var infoDivHeight = parseInt($("#inputInformation").css("height"));
	var headerHeight = parseInt($("#crawler-header").css("height"));
	var errorDivHeight = 0;
	if ($("#errorMessage").css("display") != "none")
		errorDivHeight = parseInt($("#errorMessage").css("height"));

	for (var j = 1; j < nodeCount; j++) {
		var nodeId = "#ID-" + (j + 1);
		var urlNode = $(nodeId);
		var offset = urlNode.offset();
		var parent = $(urlNode.parent());
		var parentOffset = parent.offset();
		var line = document.createElementNS(ns, "line");
        line.setAttributeNS(null, "x1", offset.left);
        line.setAttributeNS(null, "y1", offset.top - infoDivHeight - headerHeight - errorDivHeight);
        line.setAttributeNS(null, "x2", parentOffset.left);
        line.setAttributeNS(null, "y2", parentOffset.top - infoDivHeight - headerHeight - errorDivHeight);
		line.setAttributeNS(null, "stroke", "#4483d5");
		svg.appendChild(line);

		// set the node where keyword was found to red
		if (nodeId == "#" + webcrawlResults.keywordWebsite) {
			urlNode.find(".inner").css({"background":"red"});
		}
	}
}

function removeLines(svg) {
	while (svg.firstChild) {
		svg.removeChild(svg.firstChild);
	}
}

// Recursive function that traverses json tree and
// appends node elements to the specified container
function jsonTreeRecurse(container, jsonData) {
	 for (var i = 0; i < jsonData.length; i++) {
		  var $divParent = $("<div class='outer'></div>");
		  var $divChild = $("<a target='_blank'></a>");
		  var $divtooltipcont = $("<div class='tooltipcont'></div>");
		  var $divInner=$("<div class='inner'></div>");
		  var $divSpan = $("<span class='tooltiptext'></span>");
		  $divParent.attr('id', jsonData[i].id);
		  $divChild.attr('href', jsonData[i].url);
		  $divSpan.text(jsonData[i].title + " | " + jsonData[i].url);
		  $divInner.append($divSpan);
		  $divtooltipcont.append($divInner);
		  $divChild.append($divtooltipcont);
		  $divParent.append($divChild);
		  if (jsonData[i].destinations) {
			  jsonTreeRecurse($divParent, jsonData[i].destinations);
		  }
		  container.append($divParent);
		  nodeCounter++;
	 }
}

function displayVisualizer(webcrawlResults) {
	 // Create the node elements
	 jsonTreeRecurse($("#overlay"), webcrawlResults.websites);

	 // Create svg element
	 var div = document.getElementById("drawing");
	 var svg = document.createElementNS(ns, "svg");
	 calcSvgSize(svg, nodeCounter);
	 div.appendChild(svg);

	 // Draw connecting lines between parent and child nodes
	 drawLines(webcrawlResults, svg, nodeCounter);

	 // Initialize the slider and switch controls
	 $("#control").show();
	 var slider = document.getElementById("slideRange");

	 $('input[type=checkbox]').change(function() {
		 if (this.checked) {
			 $(".tooltiptext").css("visibility", "visible");
			 $(".tooltiptext").css("opacity", 1);
		 }
		 else {
			 $(".tooltiptext").css("visibility", "hidden");
			 $(".tooltiptext").css("opacity", 0);
			 $(".tooltipcont:hover .tooltiptext").css("visibility", "visible");
			 $(".tooltipcont:hover .tooltiptext").css("opacity", 1);
		 }
	 });

	 // Update the current slider value
	 slider.oninput = function() {
		 // output.innerHTML = this.value;
		 removeLines(svg);
		 var leftVal = Math.round(this.value);
		 var marginVal = Math.round(this.value * .015);
		 var topVal = Math.round(this.value * .05);
		 console.log(this.value);
		 $(".outer").css("left", leftVal);
		 $(".outer").css("margin-bottom", marginVal);
		 $(".outer").css("top", topVal);
		 calcSvgSize(svg, nodeCounter);
		 drawLines(webcrawlResults, svg, nodeCounter);
	 }
}
