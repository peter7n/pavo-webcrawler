#!/nfs/stak/users/konturf/CS467/bin/python
# -*- coding: UTF-8 -*-

###############################################################################
# Name:        webcrawlProg.py
# Author:      Frederick Kontur
# Created:     January 27, 2018
# Last Edited: March 3, 2018
# Description: This file contains the code for handling the data sent from the
#              front-end form and sending that data to the crawler program. It
#              then receives the results of the web crawl and sends them back
#              to the front end for display by the visualizer.
###############################################################################

# I found information on this website - 
# https://www.a2hosting.com/kb/developer-corner/python/activating-a-python-virtual-environment-from-a-script-file
# about activating a virtual environment from a Python CGI script
activate_this = "/nfs/stak/users/konturf/CS467/bin/activate_this.py"
execfile(activate_this, dict(__file__=activate_this))

import cgi
import cgitb
import json
import crawler

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

###############################################################################
# Main Function
###############################################################################
# Get the data from the user-submitted form and set the global variable values
formData = cgi.FieldStorage()
dft, bft, startingSite, crawlLimit, kWord = getFormData(formData)

# Testing code
print "Content-Type: text/html;charset=utf-8\n"
print crawler.run(startingSite, bft, crawlLimit, kWord)