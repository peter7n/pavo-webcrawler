/******************************************************************************
* Name:        visualizer.js
* Author:      Peter Nguyen
* Created:     3/1/18
* Description: JavaScript that generates the visual output for Team Pavo's
*              graphical web crawler
******************************************************************************/

var ns = "http://www.w3.org/2000/svg";
var nodeCounter = 0;

/******************************************************************************
* Function:    calcSvgSize
* Parameters:  svg, nodeCount
* Returns:     nothing
* Description: Dynamically calculates the maximum width and height of the svg
*              container
******************************************************************************/
function calcSvgSize(svg, nodeCount) {
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

/******************************************************************************
* Function:    drawLines
* Parameters:  webcrawlResults, svg, nodeCount
* Returns:     nothing
* Description: Draws the connecting lines between link nodes using svg
*              graphics
******************************************************************************/
function drawLines(webcrawlResults, svg, nodeCount) {
	// Get heights of various divs to correctly offset the y coordinate
	var infoDivHeight = parseInt($("#inputInformation").css("height"));
	var headerHeight = parseInt($("#crawler-header").css("height"));
	var errorDivHeight = 0;
	if ($("#errorMessage").css("display") != "none")
		errorDivHeight = parseInt($("#errorMessage").css("height"));

	// Loop through the nodes, get the coordinates of the node and its parent,
	// and draw a line between these coordinates
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
	}
}

/******************************************************************************
* Function:    removeLines
* Parameters:  svg
* Returns:     nothing
* Description: Deletes all existing lines from the svg element
******************************************************************************/
function removeLines(svg) {
	while (svg.firstChild) {
		svg.removeChild(svg.firstChild);
	}
}

/******************************************************************************
* Function:    jsonTreeRecurse
* Parameters:  container, jsonData, keywordId
* Returns:     nothing
* Description: Recursive function that traverses JSON tree and appends node
*              elements in the DOM to the specified container. Populates
*              the node with the website's title, URL and anchor link
******************************************************************************/
function jsonTreeRecurse(container, jsonData, keywordId) {
	 for (var i = 0; i < jsonData.length; i++) {
		  var divParent = $("<div class='outer'></div>");
		  var divChild = $("<a target='_blank'></a>");
		  var divtooltipcont = $("<div class='tooltipcont tooltip-hidden'></div>");
		  var divSpan = $("<span class='tooltiptext'></span>");
		  var divInner = $("<div class='inner'></div>");

		  // If keyword is found, mark this node red
		  if (jsonData[i].id == keywordId) {
			  divInner = $("<div class='inner' style='background: red;'></div>");
			  divSpan = $("<span class='tooltiptext' style='background: red;'></span>");
			  divSpan.text("* KEYWORD FOUND * " + jsonData[i].title + " | " + jsonData[i].url);
		  }
		  // Give the node an id and the website's title and URL
		  else {
			  divSpan.text(jsonData[i].title + " | " + jsonData[i].url);
		  }
		  divParent.attr('id', jsonData[i].id);
		  divChild.attr('href', jsonData[i].url);
		  divInner.append(divSpan);
		  divtooltipcont.append(divInner);
		  divChild.append(divtooltipcont);
		  divParent.append(divChild);

		  // If node has more destinations, call function recursively
		  if (jsonData[i].destinations) {
			  jsonTreeRecurse(divParent, jsonData[i].destinations, keywordId);
		  }
		  container.append(divParent);
		  nodeCounter++;
	 }
}

/******************************************************************************
* Function:    displayVisualizer
* Parameters:  webcrawlResults
* Returns:     nothing
* Description: Main visualizer function. Generates the visual display as well
*              as provides control for the zoom function and toggle to
*              show/hide all labels.
******************************************************************************/
function displayVisualizer(webcrawlResults) {
	 // Create the node elements
	 jsonTreeRecurse($("#overlay"), webcrawlResults.websites, webcrawlResults.keywordWebsite);

	 // Create svg element
	 var div = document.getElementById("drawing");
	 var svg = document.createElementNS(ns, "svg");
	 calcSvgSize(svg, nodeCounter);
	 div.appendChild(svg);

	 // Draw connecting lines between the website nodes
	 drawLines(webcrawlResults, svg, nodeCounter);

	 $("#control").show();
	 var slider = document.getElementById("slideRange");

	 // Show and hide all labels if switch is toggled
	 $('input[type=checkbox]').change(function() {
		 if (this.checked) {
			 $(".tooltipcont").toggleClass("tooltip-hidden");
			 $(".tooltipcont").toggleClass("tooltip-visible");
		 }
		 else {
			 $(".tooltipcont").toggleClass("tooltip-visible");
			 $(".tooltipcont").toggleClass("tooltip-hidden");
		 }
	 });

	 // Dynamically shrink/expand the visualizer graphic based on slider input
	 slider.oninput = function() {
		 removeLines(svg);
		 var leftVal = Math.round(this.value);
		 var marginVal = Math.round(this.value * .015);
		 var topVal = Math.round(this.value * .05);
		 $(".outer").css("left", leftVal);
		 $(".outer").css("margin-bottom", marginVal);
		 $(".outer").css("top", topVal);
		 calcSvgSize(svg, nodeCounter);
		 drawLines(webcrawlResults, svg, nodeCounter);
	 }
}
