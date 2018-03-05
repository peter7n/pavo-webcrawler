/******************************************************************************
* Name:        webcrawlJavascript.js
* Authors:     Frederick Kontur
* Created:     March 3, 2018
* Last Edited: March 4, 2018
* Description: This file contains the Javascript variables and functions for
*              the webcrawl.html page not including the Javascript for the
*              visualizer.
******************************************************************************/

/*global $, document*/

// Global variables
var prevWebsites = []; // An array holding the saved websites
var prevKeywords = []; // An array holding the saved keywords
var numDaysToSave = 30; // The number of days to save the website/keyword

// URL for the crawler program
var crawlerProgUrl = "http://web.engr.oregonstate.edu/cgi-bin/cgiwrap/~konturf/webcrawlProg.py";

// Prevent the default behavior for the form submit button
document.getElementById("webcrawlForm").addEventListener("submit", function (e) {
    "use strict";
    e.preventDefault();
});


function setTraversalMax(val) {
/******************************************************************************
* Parameters:  val  The value of the traversal type, either depth-first or
*                   breadth-first
* Returns:     Nothing
* Description: This function sets the maximum value for the number of levels
*              for the traversal based on whether a depth-first or
*              breadth-first traversal was chosen. It also erases an inputted
*              value for the number of levels if it exceeds the maximum value
*              allowed for that traversal type.
******************************************************************************/
    "use strict";
    var crawlLimit = document.getElementById("numLevels");
    if (val === "depth-first") {
        crawlLimit.max = "25";
        if (crawlLimit.value > 25) {
            crawlLimit.value = "";
        }
    } else {
        crawlLimit.max = "3";
        if (crawlLimit.value > 3) {
            crawlLimit.value = "";
        }
    }
}


function populateSiteAndKeyword(indStr) {
/******************************************************************************
* Parameters:  indStr  A string representing the index in the prevWebsites and
*                      prevKeywords arrays where the desired values can be
*                      found.
* Returns:     Nothing
* Description: This function is activated when a user wants to load a
*              previously-stored website and keyword into the form. It 
*              populates the starting website and keyword form fields with the
*              user-chosen stored website and keyword.
******************************************************************************/
    "use strict";
    var ind = parseInt(indStr, 10);
    document.getElementById("startingWebsite").value = prevWebsites[ind];
    document.getElementById("stopKeyword").value = prevKeywords[ind];
}


function createPrevWebsiteList() {
/******************************************************************************
* Parameters:  None
* Returns:     Nothing
* Description: If there is a cookie found containing previously-stored
*              websites and keywords, then this function will populate the
*              "prevWebsites" div with a radio button list of those websites
*              and keywords along with a button-link to delete the 
*              website/keyword entry from the list.
******************************************************************************/
    "use strict";
    // Empty the website/keyword list in case it was previously populated
    $("#prevWebsites").empty();
    document.getElementById("loadWebsite").style.display = "block";

    // Create variables for all of the elements needed for the website/keyword
    // list
    var radioPrevWebsites = document.getElementById("prevWebsites"),
        newRadioBtnDiv,
        newRadioBtnInput,
        newRadioBtnLabel,
        newRadioBtnDelete,
        websiteKeywordStr = "",
        keywordStr = "",
        ind = "",
        websiteInd = "",
        i;

    // Iterate through the cookie's list of websites and create the radio
    // button list
    for (i = 0; i < prevWebsites.length; i += 1) {
        newRadioBtnDiv = document.createElement("div");
        newRadioBtnInput = document.createElement("input");
        newRadioBtnLabel = document.createElement("label");
        newRadioBtnDelete = document.createElement("button");
        ind = i.toString();
        websiteInd = prevWebsites[i] + ind;

        if (prevKeywords[i] !== "") {
            keywordStr = '   (Keyword: "' + prevKeywords[i] + '")   ';
        } else {
            keywordStr = '   (Keyword: None)   ';
        }
        
        websiteKeywordStr = prevWebsites[i] + keywordStr;

        // Create the Bootstrap form-check div for the radio button
        newRadioBtnDiv.setAttribute("class", "form-check");
        radioPrevWebsites.appendChild(newRadioBtnDiv);

        // Create the radio button
        newRadioBtnInput.setAttribute("class", "form-check-input");
        newRadioBtnInput.setAttribute("type", "radio");
        newRadioBtnInput.setAttribute("name", "prevSite");
        newRadioBtnInput.setAttribute("id", websiteInd);
        newRadioBtnInput.setAttribute("value", ind);
        newRadioBtnInput.setAttribute("onClick", "populateSiteAndKeyword(this.value)");
        newRadioBtnDiv.appendChild(newRadioBtnInput);

        // Create the label for the radio button
        newRadioBtnLabel.setAttribute("class", "form-check-label");
        newRadioBtnLabel.setAttribute("for", websiteInd);
        newRadioBtnLabel.innerHTML = websiteKeywordStr.replace(/\s/g, '&nbsp;');
        newRadioBtnDiv.appendChild(newRadioBtnLabel);

        // Create the delete button-link for the entry
        newRadioBtnDelete.setAttribute("class", "btn btn-link");
        newRadioBtnDelete.setAttribute("value", ind);
        newRadioBtnDelete.setAttribute("onclick", "deleteWebsite(this.value)");
        newRadioBtnDelete.innerHTML = "Delete";
        newRadioBtnLabel.append(newRadioBtnDelete);
    }
}


// setCookie(), getCookie(), and checkCookie() functions were
// taken from https://www.w3schools.com/js/js_cookies.asp with
// the checkCookie() function being edited to populate the form
// information.

function setCookie(cname, cvalue, exdays) {
/******************************************************************************
* Parameters:  cname   The name of the cookie
*              cvalue  The value of the cookie
*              exdays  How many days before the cookie expires
* Returns:     Nothing
* Description: This function sets the value of the cookie
* Source:      This function was taken almost verbatim from 
*              https://www.w3schools.com/js/js_cookies.asp
******************************************************************************/
    "use strict";
    var d = new Date(),
        expires;
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
}

function getCookie(cname) {
/******************************************************************************
* Parameters:  cname  The name of the cookie
* Returns:     The value of the cookie if the cookie is found or an empty
*              string if the cookie is not found.
* Description: This function finds the desired cookie from the list of all of
*              a user's stored cookies and returns the cookie's value.
* Source:      This function was taken almost verbatim from 
*              https://www.w3schools.com/js/js_cookies.asp
******************************************************************************/
    "use strict";
    var name = cname + "=",
        decodedCookie = decodeURIComponent(document.cookie),
        ca = decodedCookie.split(';'),
        i,
        c;
    for (i = 0; i < ca.length; i += 1) {
        c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
/******************************************************************************
* Parameters:  None
* Returns:     Nothing
* Description: This function checks if the "prevWebsites" cookie exists. If it
*              does, then it calls the createPrevWebsiteList() function to 
*              create a list of the stored websites and keywords in the form.
* Source:      This function is modified from a function of the same name from 
*              https://www.w3schools.com/js/js_cookies.asp
******************************************************************************/
    "use strict";
    var websitesCookie = getCookie("prevWebsites"),
        keywordsCookie = getCookie("prevKeywords");
    
    if (websitesCookie !== "") {
        prevWebsites = JSON.parse(websitesCookie);
        prevKeywords = JSON.parse(keywordsCookie);
        createPrevWebsiteList();
    }
}


function deleteWebsite(indStr) {
/******************************************************************************
* Parameters:  indStr  The string representing the index value for the website
*                      and keyword to be deleted.
* Returns:     Nothing
* Description: This function deletes a website/keyword combination from the 
*              list of saved websites/keywords. 
******************************************************************************/
    "use strict";
    var ind = parseInt(indStr, 10);
    prevWebsites.splice(ind, 1);
    prevKeywords.splice(ind, 1);
    document.getElementById("loadWebsite").style.display = "none";
    if (prevWebsites.length > 0) {
        createPrevWebsiteList();
    }
    setCookie("prevWebsites", JSON.stringify(prevWebsites), numDaysToSave);
    setCookie("prevKeywords", JSON.stringify(prevKeywords), numDaysToSave);
}


function displayErrorMessage(msg) {
/******************************************************************************
* Parameters:  msg  The content of the error message
* Returns:     Nothing
* Description: This function populates the errMsg div with any error message
*              that is returned in the JSON sent by the crawler program.
******************************************************************************/
    "use strict";
    var errMsg = document.getElementById("errorMessage"),
        errMsgTxt = document.createElement("p");
    
    errMsgTxt.setAttribute("id", "errMsgTxt");
    errMsgTxt.setAttribute("class", "bg-warning");
    errMsg.style.display = "block";
    errMsgTxt.innerHTML = "Error reported: " + msg;
    errMsg.appendChild(errMsgTxt);
}


function displayInput() {
/******************************************************************************
* Parameters:  None
* Returns:     Nothing
* Description: This function displays the user's form data above the
*              visualizer when the web crawl data is returned from the crawler
*              program.
******************************************************************************/
    "use strict";
    // Create variables for each of the DOM elements
    var userInput = document.getElementById("infoTable"),
        dataTable = document.createElement("table"),
        dataTableBody = document.createElement("tbody"),
        dataTableRow1 = document.createElement("tr"),
        dataTableRow1Col1 = document.createElement("td"),
        dataTableRow1Col2 = document.createElement("td"),
        dataTableRow2 = document.createElement("tr"),
        dataTableRow2Col1 = document.createElement("td"),
        dataTableRow2Col2 = document.createElement("td"),
        dataTableRow3 = document.createElement("tr"),
        dataTableRow3Col1 = document.createElement("td"),
        dataTableRow3Col2 = document.createElement("td"),
        dataTableRow4 = document.createElement("tr"),
        dataTableRow4Col1 = document.createElement("td"),
        dataTableRow4Col2 = document.createElement("td"),
        kw = document.getElementById("stopKeyword").value;

    dataTableRow1Col1.innerHTML = "Starting Website";
    dataTableRow1Col2.innerHTML = document.getElementById("startingWebsite").value;
    dataTableRow1.appendChild(dataTableRow1Col1);
    dataTableRow1.appendChild(dataTableRow1Col2);
    dataTableBody.appendChild(dataTableRow1);

    dataTableRow2Col1.innerHTML = "Type of Traversal";
    if (document.getElementById("dft").checked) {
        dataTableRow2Col2.innerHTML = "Depth-First";
    } else {
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

    dataTableRow4Col1.innerHTML = "Keyword to Stop Traversal";
    if (kw) {
        dataTableRow4Col2.innerHTML = kw;
    } else {
        dataTableRow4Col2.innerHTML = "None";
    }
    dataTableRow4.appendChild(dataTableRow4Col1);
    dataTableRow4.appendChild(dataTableRow4Col2);
    dataTableBody.appendChild(dataTableRow4);

    dataTable.setAttribute("class", "table");
    dataTable.appendChild(dataTableBody);
    userInput.appendChild(dataTable);
    
    document.getElementById("inputInformation").style.display = "block";
}


function sendAjaxRequest() {
/******************************************************************************
* Parameters:  None
* Returns:     Nothing
* Description: This function sends an ajax request to the crawler.py program
*              and then receives the response from the program which it then
*              sends to the displayVisualizer() function.
******************************************************************************/
    "use strict";
    var postData = "";
    postData = $("form").serialize();
    $("#errorMessage").hide();
    $("#formSubmit").attr("disabled", true);
    // Have the "progress" cursor show when the ajax request gets sent
    $("body").css("cursor", "progress");
    // Display the message telling the user that the web crawl is in progress
    $('#ajaxWait').show();
    // Go to the top of the page so that the usr can see the message about the
    // web crawl being in progress. This line of code was gotten from
    // http://www.nomadjourney.com/2009/09/go-to-top-of-page-using-jquery/
    $('html, body').animate({ scrollTop: 0 }, 0);

    // Create the ajax request. The examples from 
    // https://api.jquery.com/jquery.post/ were used as a guide.
    $.ajax({
        url: crawlerProgUrl,
        type: "POST",
        data: postData,
        success: function (response) {
            $("body").css("cursor", "default");
            document.getElementById("inputForm").style.display = "none";
            document.getElementById("drawing").style.display = "block";
            $('#ajaxWait').hide();
            var webcrawlResults = JSON.parse(response);
            if (webcrawlResults.errorMessage) {
                displayErrorMessage(webcrawlResults.errorMessage);
            }
            displayInput();
            displayVisualizer(webcrawlResults);
        },
        // This page - https://stackoverflow.com/questions/377644 - was used
        // for guidance on how to handle error message responses.
        error: function (xhr) {
            $("body").css("cursor", "default");
            $('#ajaxWait').hide();
            document.getElementById("inputForm").style.display = "none";
            displayErrorMessage(xhr.responseText);
        }
    });
}


function saveFormInfo() {
/******************************************************************************
* Parameters:  None
* Returns:     Nothing
* Description: This function saves the starting website and keyword values
*              from the form input to a cookie when the form is submitted.
******************************************************************************/
    "use strict";
    var i,
        currWebsite = document.getElementById("startingWebsite").value,
        currKeyword = document.getElementById("stopKeyword").value,
        found = false;

    if (currKeyword === null) {
        currKeyword = "";
    }

    // See if the website/keyword combination has already been saved to the
    // cookie
    for (i = 0; i < prevWebsites.length; i += 1) {
        if (currWebsite === prevWebsites[i]) {
            if (currKeyword === prevKeywords[i]) {
                found = true;
                break;
            }
        }
    }
    
    // If the website/keyword combination has not already been saved, then
    // save it to the cookie
    if (!found) {
        prevWebsites.push(currWebsite);
        prevKeywords.push(currKeyword);
        setCookie("prevWebsites", JSON.stringify(prevWebsites), numDaysToSave);
        setCookie("prevKeywords", JSON.stringify(prevKeywords), numDaysToSave);
    }
    // After the form information has been saved to the cookie, continue the 
    // submission process by sending the form information to an ajax request
    sendAjaxRequest();
}