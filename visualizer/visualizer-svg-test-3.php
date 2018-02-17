<html>
	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
		<style>
			div.outer {
				position: relative;
				left: 600px;
				top: 30px;
				margin-bottom: 10px;
			}

			div.outer:first-child {
				left: 30px;
				margin-left: 30px;
			}

			div.inner {
				display: inline-block;
				background: blue;
				width: 10px;
				height: 10px;
				border-radius: 50%;
			}

			#overlay {
				position: absolute;
				top:0px;
				bottom:0px;
				left:0px;
				right:0px;
			}

			/* Tooltip container */
			.tooltip {
				 position: relative;
				 display: inline-block;
			}

			/* Tooltip text */
			.tooltip .tooltiptext {
				 visibility: hidden;
				 width: 600px;
				 background-color: #555;
				 color: #fff;
				 text-align: center;
				 padding: 5px 0;
				 position: absolute;
				 z-index: 1;
				 top: -5px;
				 left: 125%;
				 opacity: 0;
				 transition: opacity 0.3s;
			}

			/* Tooltip arrow */
			.tooltip .tooltiptext::after {
				 content: "";
				 position: absolute;
				 top: 50%;
				 right: 100%;
				 margin-top: -5px;
				 border-width: 5px;
				 border-style: solid;
				 border-color: transparent #555 transparent transparent;
			}

			.tooltip:hover .tooltiptext {
				 visibility: visible;
				 opacity: 1;
			}
		</style>
	</head>
	<body>
		<div id="drawing"></div>
		<div id="overlay"></div>
      <div id="recData" style="display: none;"><?php echo $_POST["webcrawlResults"] ?></div>
	</body>

	<script type="text/javascript">
		var strJson = document.getElementById("recData").innerText;
		var webcrawlResults = JSON.parse(strJson);

		// Recursive function that traverses json tree and
		// appends node elements to the specified container
		function jsonTreeRecurse(container, jsonData) {
			for (var i = 0; i < jsonData.length; i++) {
				var $divParent = $("<div class='outer'></div>");
				var $divChild = $("<a target='_blank'></a>");
				var $divToolTip = $("<div class='tooltip'></div>");
				var $divInner = $("<div class='inner'></div>");
				var $divSpan = $("<span class='tooltiptext'></span>");
				$divParent.attr('id', jsonData[i].id);
				$divChild.attr('href', jsonData[i].url);
				$divSpan.text(jsonData[i].title + " | " + jsonData[i].url);
				$divInner.append($divSpan);
				$divToolTip.append($divInner);
				$divChild.append($divToolTip);
				$divParent.append($divChild);
				if (jsonData[i].destinations) {
					jsonTreeRecurse($divParent, jsonData[i].destinations);
				}
				container.append($divParent);
				nodeCounter++;
			}
		}

		var nodeCounter = 0;
		// Create the node elements
		jsonTreeRecurse($("#overlay"), webcrawlResults.websites);

		// Calculate maximum svg width and height
		var maxLeft = 0;
		var maxTop = 0;
		for (var i = 1; i < nodeCounter; i++) {
			var urlNode = $("#ID-" + (i + 1));
			var offset = urlNode.offset();
			if (offset.left > maxLeft)
				maxLeft = offset.left;
			if (offset.top > maxTop)
				maxTop = offset.top;
		}

		// Create svg element
		var ns = "http://www.w3.org/2000/svg";
		var div = document.getElementById("drawing");
		var svg = document.createElementNS(ns, "svg");
		svg.setAttributeNS(null, "width", maxLeft);
		svg.setAttributeNS(null, "height", maxTop);
		div.appendChild(svg);

		// Draw connecting lines between parent and child nodes
		for (var j = 1; j < nodeCounter; j++) {
			var nodeId = "#ID-" + (j + 1);
			var urlNode = $(nodeId);
			var offset = urlNode.offset();
			var parent = $(urlNode.parent());
			var parentOffset = parent.offset();
			var line = document.createElementNS(ns, "line");
			line.setAttributeNS(null, "x1", offset.left);
			line.setAttributeNS(null, "y1", offset.top);
			line.setAttributeNS(null, "x2", parentOffset.left);
			line.setAttributeNS(null, "y2", parentOffset.top);
			line.setAttributeNS(null, "stroke", "blue");
			svg.appendChild(line);

			// set the node where keyword was found to red
			if (nodeId == "#" + breadthFirstCase2.keywordWebsite) {
				urlNode.find(".inner").css({"background":"red"});
			}
		}
	</script>

</html>
