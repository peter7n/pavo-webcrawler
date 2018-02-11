import json
import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.crawler import CrawlerRunner
from scrapy.exceptions import NotSupported
from scrapy.linkextractors import LinkExtractor
from twisted.internet import reactor
from scrapy.utils.log import configure_logging
import random
# from collections import OrderedDict


MAX_LIMIT = 100


class RandomCrawlSpider(scrapy.Spider):
    name = "Random"
    tree = None         # tree of Nodes
    last_node = None    # the last node visited
    limit = 0
    le = LinkExtractor()
    visited = set()
    keywordWebsite = ''
    error = ''

    def __init__(self, start_url=None, limit=MAX_LIMIT, *args, **kwargs):
        super(RandomCrawlSpider, self).__init__(*args, **kwargs)

        if not start_url:
            raise ValueError('No starting webpage')

        self.start_urls = [start_url]
        self.limit = limit

    def parse(self, response):

        if Node.count == self.limit:  # reached the crawl limit
            #RandomCrawlSpider.error = 'testing'
            return

        page_url = response.url
        self.visited.add(page_url)

        try:
            title = response.css('title::text').extract_first()
        except IndexError:
            title = 'No Title'
        except NotSupported:
            RandomCrawlSpider.error = 'web page not supported type'
            return

        links = set([i.url for i in self.le.extract_links(response)])
        links -= self.visited  # set difference

        if not links:  # if no outgoing links
            RandomCrawlSpider.error = 'no outgoing links'
            return

        # pick a random link from all links
        destination = random.choice(tuple(links))

        try:
            title = response.css('title::text').extract_first()
        except IndexError:
            title = 'No Title'
        except NotSupported:
            title = 'Not supported'

        # create a node for this page and append to the parent node
        node = Node(page_url, title)

        if not RandomCrawlSpider.tree:
            RandomCrawlSpider.tree = node
            RandomCrawlSpider.last_node = node
        else:
            RandomCrawlSpider.last_node.append_child(node)
            RandomCrawlSpider.last_node = node

        # yield a request
        yield scrapy.Request(
            url=destination,
            callback=self.parse,
            dont_filter=True
        )


class Node(dict):
    count = 0  # counter for limit, also unique id

    def __init__(self, url, title, destinations=None):
        super(Node, self).__init__()
        self.__dict__ = self
        Node.count += 1
        self.id = 'ID-' + str(Node.count)
        self.url = url
        self.title = title
        self.destinations = [] if not destinations else destinations

    def append_child(self, child):
        self.destinations.append(child)


# main function for the crawl (currently only returns dummy results)
# dfs/bfs option is represented as boolean
def run(start_url='', bfs=False, limit=MAX_LIMIT, keyword=None):

    # check some of the error cases here
    # if start page is empty or cannot be accessed
    if not start_url:
        return json.dumps(
            {
                'errorMessage': "No starting webpage"
            }
        )
    # if limit is <= 0 or higher than allowed

    if limit <= 0 or limit > MAX_LIMIT:
        return json.dumps(
            {
                'errorMessage': "Invalid limit"
            }
        )

    if bfs:
        return json.dumps(
            {
                'errorMessage': "Not supported yet"
            }
        )

    else:
        return json.dumps(run_dfs(start_url=start_url, limit=limit, keyword=keyword))


def run_dfs(start_url, limit, keyword):
    #process = CrawlerProcess()
    #configure_logging({'LOG_FORMAT': '%(levelname)s: %(message)s'})
    runner = CrawlerRunner()

    d = runner.crawl(RandomCrawlSpider, start_url, limit)
    d.addBoth(lambda _: reactor.stop())
    reactor.run() # the script will block here until the crawling is finished
    
    websiteList = [RandomCrawlSpider.tree]

    return {
        'websites': websiteList,
        'keywordWebsite': RandomCrawlSpider.keywordWebsite,
        'errorMessage': RandomCrawlSpider.error
    }


def run_bfs(start_page, limit, keyword):
    return None


if __name__ == '__main__':
    print run(start_url='http://www.reddit.com/r/GameDeals/', bfs=False, limit=10)
