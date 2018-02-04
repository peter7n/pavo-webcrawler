#!/usr/bin/python
# -*- coding: UTF-8 -*-

# To load this code on your account, follow the guidance on
# https://it.engineering.oregonstate.edu/setup-publichtml-cgi-scripting

import cgi
import cgitb
import json

# Enable debugging
cgitb.enable()

###############################################################################
# Define global variables
###############################################################################
# Indicates whether or not the user chose to do a depth-first traversal    
dft = False

# Indicates whether or not the user chose to do a breadth-first traversal
bft = False

# The starting site for the web traversal
startingSite = None

# The user-specified numeric limit for the crawl
crawlLimit = 0

# The keyword provided by the user. If the user does not specify a keyword, 
# the value is None.
kWord = None

# The URL for the website where the keyword was found. If the keyword was not
# found or no keyword was specifiied, the value is None.
kWordWebsite = None

# This list of dictionaries holds the results of the web crawl in JSON format.
webcrawlRes = []

# Any error message is passed in this variable.
errorMsg = None

def getFormData(formData):
###############################################################################
# Paramters:   formData  The data pulled from the form using 
#              cgi.FieldStorage()
# Returns:     A tuple to populate the following global variables in the order
#              specified - dft, bft, crawlLimit, kWord
# Description: This function reads the form data submitted by the user and
#              sets the global variables linked to that data
###############################################################################
    if formData.getvalue('traversalType'):
        traversalType = formData.getvalue('traversalType')
        if traversalType == "depth-first":
            dft = True
            bft = False # Redundant, but included just in case
        else:
            bft = True
            dft = False # Redundant, but included just in case
    else:
        dft = False
        bft = False
    
    if formData.getvalue('startingSite'):
        startingSite = formData.getvalue('startingSite')
    else:
        startingSite = None
    
    if formData.getvalue('crawlLimit'):
        crawlLimit = int(formData.getvalue('crawlLimit'))
    else:
        crawlLimit = 0
    
    if formData.getvalue('kWord'):
        kWord = formData.getvalue('kWord')
    else:
        kWord = None
    
    return dft, bft, startingSite, crawlLimit, kWord


def addSite(srcID, srcURL, srcTitle, destID, destURL, destTitle, webcrawlRes):
###############################################################################
# Parameters:  srcID        The unique ID for the source website
#              srcURL       The URL for the source website
#              srcTitle     The title for the source website
#              destID       The unique ID for the destination website
#              destURL      The URL for the destination website
#              destTitle    The title for the destination website
#              webcrawlRes  The list of dictionaries that holds the results of 
#                           the web crawl in JSON format
# Returns:     Nothing
# Description: This function adds a source/destination pair to the 
#              "webcrawlRes" list. It checks to see if the destination is a
#              new one for the source or if it has already been included, and
#              it will update the list of websites accordingly.
# Note:        This function is optional for use. The web crawl program has
#              the option to implement the JSON formatting using another
#              method.
###############################################################################
    if not webcrawlRes:
        srcInfo = {
            "id" :           srcID,
            "source" :       srcURL,
            "title" :        srcTitle,
            "destinations" : []
        } 
        webcrawlRes.append(srcInfo)
        if destID:
            destInfo = {
                "id" :           destID,
                "source" :       destURL,
                "title" :        destTitle,
                "destinations" : []
            }
            webcrawlRes[0]["destinations"].append(destInfo)
        return
    
    # Find the source website
    srcWebsite, found = findSrc(srcID, webcrawlRes)
    if not found:
        # The source website should have been found
        print "Site not found"
    
    if destID:
        # Make sure the destination site was not already added
        alreadyAdded = findDest(destID, srcWebsite["destinations"])
        if not alreadyAdded:
            destInfo = {
                "id" :           destID,
                "source" :       destURL,
                "title" :        destTitle,
                "destinations" : []
            }
            srcWebsite["destinations"].append(destInfo)
    

def findSrc(srcID, webcrawlRes):
###############################################################################
# Parameters:  srcID        The unique ID for the source website
#              webcrawlRes  The list of dictionaries that holds the results of 
#                          the web crawl in JSON format
# Returns:     The dictionary corresponding the the source website and a 
#              boolean indicating whether the source website was found.
# Description: This function recursively searches the webcrawlRes list of
#              dictionaries to find the dictionary corresponding the the
#              source website.
###############################################################################
    found = False
    for x in webcrawlRes:
        if x["id"] == srcID:
            found = True
            return x, found
        else:
            # make a recursive call on the current website's destination list
            y, found = findSrc(srcID, x["destinations"])
            if found:
                return y, found
    # if site was not found, then return nothing
    return found, None


def findDest(destID, destList):
###############################################################################
# Parameters:  destID    The unique ID for the destination website
#              destList  The list of destination websites for the current 
#                        source website
# Returns:     True if the destination ID was found in the list of destination
#              websites and false if not.
# Description: This function determines if a destination website has already
#              been added to the list of destination websites.
###############################################################################
    found = False
    for x in destList:
        if x["id"] == destID:
            found = True
            return found
    return found


###############################################################################
# Main Function
###############################################################################
# Get the data from the user-submitted form and set the global variable values
formData = cgi.FieldStorage()
dft, bft, startingSite, crawlLimit, kWord = getFormData(formData)

# Call the webcrawler
#webcrawler(dft, bft, startingSite, crawlLimit, kWord, webcrawlRes)

# Call the data transfer tool to transfer data to the Visualizer
#dataTransfer()

# Testing code
print "Content-Type: text/plain;charset=utf-8"
print
print "This page runs the Python code"
print "You can test your output by putting it in a Python print statement"

print

print "Here are the variables that have been set based on the form data that was passed:"
print "dft = ",
print dft
print "bft = ",
print bft
print "startingSite = ",
print startingSite
print "crawlLimit = ",
print crawlLimit
print "kWord = ",
print kWord

print

print "Test the code for creating the JSON format for the output of the webcrawler:"
print 'addSite("ID-0", "http://www.google.com", "Google", "ID-1", "http://www.yahoo.com", "Yahoo", webcrawlRes)'
addSite("ID-0", "http://www.google.com", "Google", "ID-1", "http://www.yahoo.com", "Yahoo", webcrawlRes)
print "Result: ",
print webcrawlRes
print 'addSite("ID-0", "http://www.google.com", "Google", "ID-2", "http://www.espn.com", "ESPN", webcrawlRes)'
addSite("ID-0", "http://www.google.com", "Google", "ID-2", "http://www.espn.com", "ESPN", webcrawlRes)
print "Result: ",
print webcrawlRes
print 'addSite("ID-1", "http://www.yahoo.com", "Yahoo", "ID-3", "http://www.wikipedia.org", "Wikipedia", webcrawlRes)'
addSite("ID-1", "http://www.yahoo.com", "Yahoo", "ID-3", "http://www.wikipedia.org", "Wikipedia", webcrawlRes)
print "Result: ",
print webcrawlRes
print 'addSite("ID-2", "http://www.espn.com", "ESPN", None, None, None, webcrawlRes)'
addSite("ID-2", "http://www.espn.com", "ESPN", None, None, None, webcrawlRes)
print "Result: ",
print webcrawlRes