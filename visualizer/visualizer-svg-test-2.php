<html>
	<head>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
		<style>
			div.outer {
				position: relative;
				left: 200px;
				top: 30px;
				margin-bottom: 10px;
				/* border: 1px solid red; */
			}

			div.inner {
				display: inline-block;
				background: #f00;
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
				var $divChild = $("<a></a>");
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

		var breadthFirstCase =
		{
			"websites":[
		 		{
		 			"id":"ID-1",
		 			"url":"URL_1",
		 			"title":"TITLE_1",
		 			"destinations":[
		 				{
		 					"id":"ID-2",
		 					"url":"URL_2",
		 					"title":"TITLE_2",
		 					"destinations":[
		 						{
		 							"id":"ID-3",
		 							"url":"URL_3",
		 							"title":"TITLE_3",
		 							"destinations":[]
		 						},
		 						{
		 							"id":"ID-4",
		 							"url":"URL_4",
		 							"title":"TITLE_4",
		 							"destinations":[]
		 						}
		 					]
		 				},
		 				{
		 					"id":"ID-5",
		 					"url":"URL_5",
		 					"title":"TITLE_5",
		 					"destinations":[]
		 				}
		 			],
		 		},
			],
         "keywordWebsite":"ID_KEYWORD_WEBSITE",
         "errorMessage":"Description of any error that occurred"
      }

		var breadthFirstCase2 =
		{
			"websites":[
		 		{
		 			"id":"ID-1",
		 			"url":"http://google.com",
		 			"title":"TITLE_1",
		 			"destinations":[
		 				{
		 					"id":"ID-2",
		 					"url":"http://yahoo.com",
		 					"title":"TITLE_2",
		 					"destinations":[
		 						{
		 							"id":"ID-3",
		 							"url":"http://github.com",
		 							"title":"TITLE_3",
		 							"destinations":[]
		 						},
		 						{
		 							"id":"ID-4",
		 							"url":"http://oregonstate.edu",
		 							"title":"TITLE_4",
		 							"destinations":[]
		 						},
		 						{
		 							"id":"ID-13",
		 							"url":"http://oregonstate.edu",
		 							"title":"TITLE_4",
		 							"destinations":[]
		 						},
		 						{
		 							"id":"ID-14",
		 							"url":"http://oregonstate.edu",
		 							"title":"TITLE_4",
		 							"destinations":[]
		 						},
		 						{
		 							"id":"ID-15",
		 							"url":"http://oregonstate.edu",
		 							"title":"TITLE_4",
		 							"destinations":[]
		 						},
		 						{
		 							"id":"ID-16",
		 							"url":"http://oregonstate.edu",
		 							"title":"TITLE_4",
		 							"destinations":[]
		 						},
		 					]
		 				},
		 				{
		 					"id":"ID-5",
		 					"url":"http://rottentomatoes.com",
		 					"title":"TITLE_5",
		 					"destinations":[]
		 				},
						{
		 					"id":"ID-6",
		 					"url":"http://rottentomatoes.com",
		 					"title":"TITLE_5",
		 					"destinations":[]
		 				},
						{
		 					"id":"ID-7",
		 					"url":"http://rottentomatoes.com",
		 					"title":"TITLE_5",
		 					"destinations":[]
		 				},
						{
		 					"id":"ID-8",
		 					"url":"http://rottentomatoes.com",
		 					"title":"TITLE_5",
		 					"destinations":[]
		 				},
						{
		 					"id":"ID-9",
		 					"url":"http://rottentomatoes.com",
		 					"title":"TITLE_5",
		 					"destinations":[]
		 				},
						{
		 					"id":"ID-10",
		 					"url":"http://rottentomatoes.com",
		 					"title":"TITLE_5",
		 					"destinations":[]
		 				},
						{
		 					"id":"ID-11",
		 					"url":"http://rottentomatoes.com",
		 					"title":"TITLE_5",
		 					"destinations":[]
		 				},
						{
		 					"id":"ID-12",
		 					"url":"http://rottentomatoes.com",
		 					"title":"TITLE_5",
		 					"destinations":[]
		 				},
		 			],
		 		},
			],
         "keywordWebsite":"ID_KEYWORD_WEBSITE",
         "errorMessage":"Description of any error that occurred"
      }

		var depthFirstCase =
		{
			"websites":[
		 		{
		 			"id":"ID-1",
		 			"url":"http://google.com",
		 			"title":"TITLE_1",
		 			"destinations":[
		 				{
		 					"id":"ID-2",
		 					"url":"http://yahoo.com",
		 					"title":"TITLE_2",
		 					"destinations":[
		 						{
		 							"id":"ID-3",
		 							"url":"http://github.com",
		 							"title":"TITLE_3",
		 							"destinations":[
		 								{
		 									"id":"ID-4",
				 							"url":"http://oregonstate.edu",
				 							"title":"TITLE_4",
				 							"destinations":[]
		 								}
	 								]
		 						}
				 			]
				 		}
					]
				}
			],
         "keywordWebsite":"ID_KEYWORD_WEBSITE",
         "errorMessage":"Description of any error that occurred"
      }

      var depthFirstCase2 = [
		{
		   "url":"https://www.reddit.com/r/GameDeals/",
		   "errorMessage":"testing",
		   "destinations":[
		      {
		         "url":"https://www.reddit.com/r/GameDeals/wiki/rules",
		         "destinations":[
		            {
		               "url":"https://se.reddit.com/r/GameDeals/search?q=subreddit:GameDeals+OR+subreddit:GameDealsMeta&sort=new&t=all&include_over_18=on&feature=legacy_search",
		               "destinations":[
		                  {
		                     "url":"https://se.reddit.com/r/space/",
		                     "destinations":[
		                        {
		                           "url":"https://se.reddit.com/r/funny/",
		                           "destinations":[
		                              {
		                                 "url":"https://se.reddit.com/user/Umdlye",
		                                 "destinations":[
		                                    {
		                                       "url":"https://se.reddit.com/r/2007scape/comments/7nn037/can_people_stop_with_these_shit_jewellery_memes/ds35y2f/?context=3",
		                                       "destinations":[
		                                          {
		                                             "url":"https://se.reddit.com/r/television/",
		                                             "destinations":[
		                                                {
		                                                   "url":"https://se.reddit.com/r/TheNightOf/",
		                                                   "destinations":[
		                                                      {
		                                                         "url":"https://se.reddit.com/r/all/",
		                                                         "destinations":[

		                                                         ],
		                                                         "id":"ID-10",
		                                                         "title":"all subreddits"
		                                                      }
		                                                   ],
		                                                   "id":"ID-9",
		                                                   "title":"The Night Of: A miniseries from HBO"
		                                                }
		                                             ],
		                                             "id":"ID-8",
		                                             "title":"Television Discussion and News"
		                                          }
		                                       ],
		                                       "id":"ID-7",
		                                       "title":"Umdlye comments on can people stop with these shit jewellery memes"
		                                    }
		                                 ],
		                                 "id":"ID-6",
		                                 "title":"overview for Umdlye"
		                              }
		                           ],
		                           "id":"ID-5",
		                           "title":"funny"
		                        }
		                     ],
		                     "id":"ID-4",
		                     "title":"/r/space: news, articles, images, videos, and discussion"
		                  }
		               ],
		               "id":"ID-3",
		               "title":"GameDeals: search results - subreddit:GameDeals OR subreddit:GameDealsMeta"
		            }
		         ],
		         "id":"ID-2",
		         "title":"rules - GameDeals"
		      }
		   ],
		   "id":"ID-1",
		   "title":"GameDeals"
		}
		]

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
			var urlNode = $("#ID-" + (j + 1));
			var offset = urlNode.offset();
			var parent = $(urlNode.parent());
			var parentOffset = parent.offset();
			var line = document.createElementNS(ns, "line");
			line.setAttributeNS(null, "x1", offset.left);
			line.setAttributeNS(null, "y1", offset.top);
			line.setAttributeNS(null, "x2", parentOffset.left);
			line.setAttributeNS(null, "y2", parentOffset.top);
			line.setAttributeNS(null, "stroke", "green");
			svg.appendChild(line);
		}
	</script>

</html>
