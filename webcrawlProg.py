#!/nfs/stak/users/konturf/CS467/bin/python
# -*- coding: UTF-8 -*-


activate_this = "/nfs/stak/users/konturf/CS467/bin/activate_this.py"
execfile(activate_this, dict(__file__=activate_this))


# To load this code on your account, follow the guidance on
# https://it.engineering.oregonstate.edu/setup-publichtml-cgi-scripting

import cgi
import cgitb
import json
import urllib
import crawler

# Enable debugging
cgitb.enable()

###############################################################################
# Define global variables
###############################################################################
# The URL where the data visualizer can be found
urlVisualizer = "http://web.engr.oregonstate.edu/~konturf/visualizer-svg-test-2.php"

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


def dataTransfer():
###############################################################################
# Parameters:  None
# Returns:     Nothing
# Description: This function takes the results of the webcrawl and sends them
#              to the data visualizer program using an HTTP POST request. It
#              constructs an HTML form and then autosubmits the form with a 
#              JavaScript submit() command.
###############################################################################
    # Convert the websites dictionary to JSON so it can be processed by the 
    # visualizer
    #websitesJSON = json.dumps(webcrawlRes[0])
    res = crawler.run(startingSite, bft, crawlLimit, kWord)
    print '<body>'
    print '<div style="display: none;">'
    # Create the form for sending the data
    print('<form id="webcrawlResForm" action="%s" method="post">' % (urlVisualizer))
    print('<textarea name="webcrawlResults">%s</textarea>' % (res))
    print '</form>' 
    print '</div>'
    print '<script>'
    # Autosubmit the form with a JavaScript submit() command
    print 'document.getElementById("webcrawlResForm").submit();'
    print '</script>'
    print '</body>'
    


###############################################################################
# Main Function
###############################################################################
# Get the data from the user-submitted form and set the global variable values
formData = cgi.FieldStorage()
dft, bft, startingSite, crawlLimit, kWord = getFormData(formData)

# Testing code
print "Content-Type: text/html;charset=utf-8"
print
print "<p>Performing the web crawl</p>"
dataTransfer()