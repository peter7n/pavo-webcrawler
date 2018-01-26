import json

# Define global variables

# Indicates whether or not the user chose to do a depth-first traversal    
dft = False

# Indicates whether or not the user chose to do a breadth-first traversal
bft = False

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

# Define a class to hold the list of source websites
class SourceWebsites:
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

    # Instantiate the class SourceWebsites to access the list of source 
    # websites
    srcSites = SourceWebsites()
    if source in srcSites.sourceList:
        srcFound = True
    else:
        srcSites.sourceList.append(source)
    
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
# Call the webcrawler and pass it the empty webcrawlRes dictionary
webcrawler(webcrawlRes)

# Call the data transfer tool
dataTransfer()
