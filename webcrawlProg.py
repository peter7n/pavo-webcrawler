#!/usr/bin/python
# -*- coding: UTF-8 -*-

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
numSites = 0

# The keyword provided by the user. If the user does not specify a keyword, 
# the value is None.
kWord = None

# The URL for the website where the keyword was found. If the keyword was not
# found or no keyword was specifiied, the value is None.
kWordWebsite = None

# This dictionary holds the results of the webcrawl in JSON format.
webcrawlRes = {}

def getFormData(formData):
###############################################################################
# Paramters:   formData  The data pulled from the form using 
#              cgi.FieldStorage()
# Returns:     A tuple to populate the following global variables in the order
#              specified - dft, bft, numSites, kWord
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
    
    if formData.getvalue('numSites'):
        numSites = int(formData.getvalue('numSites'))
    else:
        numSites = 0
    
    if formData.getvalue('kWord'):
        kWord = formData.getvalue('kWord')
    else:
        kWord = None
    
    return dft, bft, startingSite, numSites, kWord

# Define a variable to hold the list of source websites
sourceList = []

def addSite(source, destination, webcrawlRes):
###############################################################################
# Parameters:  source       The website that contains the link
#              destination  The website to which the link is directed. If
#                           there are no links available, then None should be
#                           passed for the destination.
#              webcrawlRes  The dictionary containing the current results from
#                           the webcrawl
# Returns:     Nothing
# Description: This function adds a source/destination pair to the 
#              "webcrawlRes" dictionary. It checks to see if the source is a
#              new source or if it has already been included and will update
#              the JSON accordingly.
# Note:        This function is optional for use. The web crawl program has
#              the option to implement the JSON formatting using another
#              method.
###############################################################################
    srcFound = False # Variable to see if source was already added to JSON

    if source in sourceList:
        srcFound = True
    else:
        sourceList.append(source)
    
    # If the source already exists and the destination is not None, then add
    # the destination to the list of the source's destinations
    if srcFound and destination is not None:
        webcrawlRes[source].append(destination)
    
    # If the source does not already exist and the destination is not None,
    # then create a new key/value pair with the source and destination
    elif not srcFound and destination is not None:
        webcrawlRes[source] = [destination]
    
    # If the source does not exist and the destination is None, then create a
    # new key/value pair with an empty list as the value
    elif not srcFound and destination is None:
        webcrawlRes[source] = []

###############################################################################
# Main Function
###############################################################################
# Get the data from the user-submitted form and set the global variable values
formData = cgi.FieldStorage()
dft, bft, startingSite, numSites, kWord = getFormData(formData)

# Call the webcrawler, passing it the starting site and the webcrawlRes 
# dictionary to update
webcrawler(startingSite, webcrawlRes)

# Call the data transfer tool to transfer data to the Visualizer
dataTransfer()
