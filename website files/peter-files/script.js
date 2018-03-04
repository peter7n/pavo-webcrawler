var prevWebsites = [];
var prevKeywords = [];
document.getElementById("webcrawlForm").addEventListener("submit", function(e) {
	 e.preventDefault();
});

function setTraversalMax(val) {
	 crawlLimit = document.getElementById("numLevels");
	 if(val == "depth-first") {
		  crawlLimit.max = "25";
		  if(crawlLimit.value > 25) {
				crawlLimit.value = "";
		  }
	 }
	 else {
		  crawlLimit.max = "3";
		  if(crawlLimit.value > 3) {
				crawlLimit.value = "";
		  }
	 }
}

function populateSiteAndKeyword(indStr) {
	 var ind = parseInt(indStr);
	 document.getElementById("startingWebsite").value = prevWebsites[ind];
	 document.getElementById("stopKeyword").value = prevKeywords[ind];
}


function saveFormInfo() {
	 var currWebsite = document.getElementById("startingWebsite").value;
	 var currKeyword = document.getElementById("stopKeyword").value;
	 var found = false;

	 if(currKeyword == null) {
		  currKeyword = "";
	 }

	 for(var i = 0; i < prevWebsites.length; i++) {
		  if(currWebsite == prevWebsites[i]) {
				if(currKeyword == prevKeywords[i]) {
					 found = true;
					 break;
				}
		  }
	 }
	 if(!found) {
		  prevWebsites.push(currWebsite);
		  prevKeywords.push(currKeyword);
		  setCookie("prevWebsites", JSON.stringify(prevWebsites), 30);
		  setCookie("prevKeywords", JSON.stringify(prevKeywords), 30);
	 }
	 sendAjaxRequest();
}

// setCookie(), getCookie(), and checkCookie() functions were
// taken from https://www.w3schools.com/js/js_cookies.asp with
// the checkCookie() function being edited to populate the form
// information.

function setCookie(cname, cvalue, exdays) {
	 var d = new Date();
	 d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	 var expires = "expires="+d.toUTCString();
	 document.cookie = cname + "=" + cvalue + ";" + expires;
}

function getCookie(cname) {
	 var name = cname + "=";
	 var decodedCookie = decodeURIComponent(document.cookie);
	 var ca = decodedCookie.split(';');
	 for(var i = 0; i <ca.length; i++) {
		  var c = ca[i];
		  while (c.charAt(0) == ' ') {
				c = c.substring(1);
		  }
		  if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
		  }
	 }
	 return "";
}

function checkCookie() {
	 var websitesCookie = getCookie("prevWebsites");
	 var keywordsCookie = getCookie("prevKeywords");
	 if(websitesCookie == "") {
		  return false;
	 }
	 else {
		  prevWebsites = JSON.parse(websitesCookie);
		  prevKeywords = JSON.parse(keywordsCookie);
		  createPrevWebsiteList();
	 }
}

function deleteWebsite(indStr) {
	 var ind = parseInt(indStr);
	 prevWebsites.splice(ind, 1);
	 prevKeywords.splice(ind, 1);
	 document.getElementById("loadWebsite").style.display = "none";
	 if(prevWebsites.length > 0) {
		  createPrevWebsiteList();
	 }
	 setCookie("prevWebsites", JSON.stringify(prevWebsites), 30);
	 setCookie("prevKeywords", JSON.stringify(prevKeywords), 30);
}

function createPrevWebsiteList() {
	 $("#prevWebsites").empty();
	 document.getElementById("loadWebsite").style.display = "block";

	 var radioPrevWebsites = document.getElementById("prevWebsites");
	 var newRadioBtnDiv;
	 var newRadioBtnInput;
	 var newRadioBtnLabel;
	 var newRadioBtnDelete;
	 var websiteKeywordStr = "";
	 var keywordStr = "";
	 var ind = "";
	 var websiteInd = "";

	 for(var i = 0; i < prevWebsites.length; i++) {
		  newRadioBtnDiv = document.createElement("div");
		  newRadioBtnInput = document.createElement("input");
		  newRadioBtnLabel = document.createElement("label");
		  newRadioBtnDelete = document.createElement("button");
		  ind = i.toString();
		  websiteInd = prevWebsites[i] + ind;

		  if(prevKeywords[i] != "") {
				keywordStr = '   (Keyword: "' + prevKeywords[i] + '")   ';
		  }
		  else {
				keywordStr = "   (Keyword: None)   "
		  }
		  websiteKeywordStr = prevWebsites[i] + keywordStr;

		  newRadioBtnDiv.setAttribute("class", "form-check");
		  radioPrevWebsites.appendChild(newRadioBtnDiv);

		  newRadioBtnInput.setAttribute("class", "form-check-input");
		  newRadioBtnInput.setAttribute("type", "radio");
		  newRadioBtnInput.setAttribute("name", "prevSite")
		  newRadioBtnInput.setAttribute("id", websiteInd);
		  newRadioBtnInput.setAttribute("value", ind);
		  newRadioBtnInput.setAttribute("onClick", "populateSiteAndKeyword(this.value)");
		  newRadioBtnDiv.appendChild(newRadioBtnInput);

		  newRadioBtnLabel.setAttribute("class", "form-check-label");
		  newRadioBtnLabel.setAttribute("for", websiteInd);
		  newRadioBtnLabel.innerHTML = websiteKeywordStr.replace(/\s/g, '&nbsp;');
		  newRadioBtnDiv.appendChild(newRadioBtnLabel);

		  newRadioBtnDelete.setAttribute("class", "btn btn-link");
		  newRadioBtnDelete.setAttribute("value", ind);
		  newRadioBtnDelete.setAttribute("onclick", "deleteWebsite(this.value)");
		  newRadioBtnDelete.innerHTML = "Delete";
		  newRadioBtnLabel.append(newRadioBtnDelete);
	 }
}

function sendAjaxRequest() {
	 var postDate = "";
	 postData = $("form").serialize();
	 document.getElementById("errorMessage").style.display = "none";
	 document.getElementById("formSubmit").disabled = true;
	 $("#errorMessage").empty();
	 $("body").css("cursor", "progress");

	 $.ajax({
		  url: "http://web.engr.oregonstate.edu/cgi-bin/cgiwrap/~konturf/webcrawlProg.py",
		  type: "POST",
		  data: postData,
		  success: function(response) {
				$("body").css("cursor", "default");
				document.getElementById("inputForm").style.display = "none";
				// document.getElementById("drawing").style.display = "block";
				var webcrawlResults = JSON.parse(response);
				if(webcrawlResults.errorMessage) {
					 displayErrorMessage(webcrawlResults.errorMessage);
				}
				displayInput();
				displayVisualizer(webcrawlResults);
		  },
		  error: function(xhr) {
				$("body").css("cursor", "default");
				document.getElementById("inputForm").style.display = "none";
				displayErrorMessage(xhr.responseText);
		  }
	 });
}

function displayInput() {
	 var userInput = document.getElementById("inputInformation");
	 var dataTable = document.createElement("table");
	 var dataTableBody = document.createElement("tbody");
	 var dataTableRow1 = document.createElement("tr");
	 var dataTableRow1Col1 = document.createElement("td");
	 var dataTableRow1Col2 = document.createElement("td");
	 var dataTableRow2 = document.createElement("tr");
	 var dataTableRow2Col1 = document.createElement("td");
	 var dataTableRow2Col2 = document.createElement("td");
	 var dataTableRow3 = document.createElement("tr");
	 var dataTableRow3Col1 = document.createElement("td");
	 var dataTableRow3Col2 = document.createElement("td");
	 var dataTableRow4 = document.createElement("tr");
	 var dataTableRow4Col1 = document.createElement("td");
	 var dataTableRow4Col2 = document.createElement("td");

	 dataTableRow1Col1.innerHTML = "Starting Website";
	 dataTableRow1Col2.innerHTML = document.getElementById("startingWebsite").value;
	 dataTableRow1.appendChild(dataTableRow1Col1);
	 dataTableRow1.appendChild(dataTableRow1Col2);
	 dataTableBody.appendChild(dataTableRow1);

	 dataTableRow2Col1.innerHTML = "Type of Traversal";
	 if(document.getElementById("dft").checked) {
		  dataTableRow2Col2.innerHTML = "Depth-First";
	 }
	 else {
		  dataTableRow2Col2.innerHTML = "Breadth-First";
	 }
	 dataTableRow2.appendChild(dataTableRow2Col1);
	 dataTableRow2.appendChild(dataTableRow2Col2);
	 dataTableBody.appendChild(dataTableRow2);

	 dataTableRow3Col1.innerHTML = "Number of Levels for Traversal";
	 dataTableRow3Col2.innerHTML = document.getElementById("numLevels").value;
	 dataTableRow3.appendChild(dataTableRow3Col1);
	 dataTableRow3.appendChild(dataTableRow3Col2);
	 dataTableBody.appendChild(dataTableRow3);

	 var kw = document.getElementById("stopKeyword").value;
	 dataTableRow4Col1.innerHTML = "Keyword to Stop Traversal";
	 if(kw) {
		  dataTableRow4Col2.innerHTML = kw;
	 }
	 else {
		  dataTableRow4Col2.innerHTML = "None";
	 }
	 dataTableRow4.appendChild(dataTableRow4Col1);
	 dataTableRow4.appendChild(dataTableRow4Col2);
	 dataTableBody.appendChild(dataTableRow4);

	 dataTable.setAttribute("class", "table");
	 dataTable.appendChild(dataTableBody);
	 userInput.appendChild(dataTable);
	 userInput.style.display = "block";
}

function displayErrorMessage(msg) {
	 var errMsg = document.getElementById("errorMessage");
	 var errMsgTxt = document.createElement("p");
	 errMsgTxt.setAttribute("id", "errMsgTxt");
	 errMsgTxt.setAttribute("class", "bg-warning");
	 errMsg.style.display = "block";
	 errMsgTxt.innerHTML = msg;
	 errMsg.appendChild(errMsgTxt);
}
