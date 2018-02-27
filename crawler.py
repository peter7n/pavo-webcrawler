import json
from urllib2 import Request, urlopen, HTTPError, URLError
import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.crawler import CrawlerRunner
from scrapy.exceptions import NotSupported
from scrapy.linkextractors import LinkExtractor
from scrapy.contrib.spiders import CrawlSpider
from twisted.internet import reactor
import random
from collections import deque
from datetime import datetime


MAX_LIMIT = 100
MAX_DEPTH = 2


class RandomCrawlSpider(scrapy.Spider):
    name = "Random"
    tree = None         # tree of Nodes
    last_node = None    # the last node visited
    limit = 0
    le = LinkExtractor()
    visited = set()
    keyword = None
    keywordWebsite = ''
    error = ''

    def __init__(self, start_url=None, limit=MAX_LIMIT, keyword=None, *args, **kwargs):
        super(RandomCrawlSpider, self).__init__(*args, **kwargs)

        if not start_url:
            raise ValueError('No starting webpage')
        self.start_urls = [start_url]
        self.limit = limit
        self.keyword = keyword.lower() if keyword else keyword

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

        # if current node contains the keyword, return
        if self.keyword:
            # get all visible plaintext from the body of the website
            plaintext = ' '.join(response.xpath("//body//text()").extract()).strip().lower()
            if self.keyword in plaintext:
                RandomCrawlSpider.keywordWebsite = response.url
                return

        # yield a request
        yield scrapy.Request(
            url=destination,
            callback=self.parse,
            dont_filter=True
        )


#t = []

class BreadthCrawlSpider(CrawlSpider):
    name = "Breadth"
    tree = None                 # tree of Nodes
    depth_limit = 0
    depth = 0
    queue = deque()             # queue of url strings and their parent node for BFS-like crawl
    nodesToNextDepth = 1        # counts the children, 0 signals an increase in depth
    nextNodesToNextDepth = 0    # counts grandchildren for the depth increase after current level
    le = LinkExtractor()
    visited = set()
    keyword = None
    keywordWebsite = ''
    error = ''
    handle_httpstatus_list = [404, 500, 999]
    #t.append(datetime.now())
    t0 = datetime.now()

    def __init__(self, start_url=None, depth=MAX_DEPTH, keyword=None, *args, **kwargs):
        super(BreadthCrawlSpider, self).__init__(*args, **kwargs)

        if not start_url:
            raise ValueError('No starting webpage')

        self.start_urls = [start_url]
        self.depth_limit = depth
        self.keyword = keyword.lower() if keyword else keyword
        self.queue.append((start_url, None))  # queue stores url string, parent node tuple
        self.queue.append(None)

    def parse(self, response):
        # terminate if timed out
        seconds_elapsed = (datetime.now() - BreadthCrawlSpider.t0).total_seconds()
        if seconds_elapsed >= 180:
            BreadthCrawlSpider.error = "Timed out - terminating early"
            return

        #t.append(datetime.now())
        if response.status >= 400:
            self.queue.popleft()

            if not self.queue[0]:
                self.depth += 1
                self.queue.append(None)
                self.queue.popleft()

                if self.depth > self.depth_limit:
                    #print '2 ' + str(self.depth) + ', ' + str(self.depth_limit)
                    return

                if not self.queue[0]:  # no more nodes
                    #print '3'
                    return

            yield scrapy.Request(
                url=self.queue[0][0],
                callback=self.parse,
                dont_filter=True
            )
        else:
            if self.depth > self.depth_limit:  # reached the crawl limit
                print '1 ' + str(self.depth) + ', ' + str(self.depth_limit)
                return
            #t.append(datetime.now())
            page_url, parent_node = self.queue.popleft()

            self.visited.add(page_url)

            try:
                title = response.css('title::text').extract_first()
            except IndexError:
                title = 'No Title'
            except NotSupported:
                BreadthCrawlSpider.error = 'web page not supported type'
                return

            #t.append(datetime.now())
            links = []
            # get all links on this page if depth is lower than max depth
            if self.depth < self.depth_limit:
                links = set([i.url for i in self.le.extract_links(response)])
                links -= self.visited  # set difference
            #t.append(datetime.now())

            # create a node for this page and append to the parent node
            node = Node(page_url, title)

            if not BreadthCrawlSpider.tree:
                BreadthCrawlSpider.tree = node
            else:
                parent_node.append_child(node)

            # if current node contains the keyword, return
            if self.keyword:
                # get all visible plaintext from the body of the website
                plaintext = ' '.join(response.xpath("//body//text()").extract()).strip().lower()
                if self.keyword in plaintext:
                    BreadthCrawlSpider.keywordWebsite = response.url
                    return

            #t.append(datetime.now())
            for link in links:
                self.queue.append((link, node))
            #t.append(datetime.now())
            if len(self.queue) == 0:
                #print '4'
                return

            if not self.queue[0]:
                self.depth += 1
                self.queue.append(None)
                self.queue.popleft()

                if self.depth > self.depth_limit:
                    #print '2 ' + str(self.depth) + ', ' + str(self.depth_limit)
                    return

                if not self.queue[0]:  # no more nodes
                    #print '3'
                    return
            #t.append(datetime.now())

            #print [str(t[i] - t[i-1]) for i in range(1, len(t))]

            #del t[:]
            #t.append(datetime.now())

            # yield a request
            yield scrapy.Request(
                url=self.queue[0][0],
                callback=self.parse,
                dont_filter=True,
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
        return json.dumps(run_bfs(start_url=start_url, depth=limit, keyword=keyword))

    else:
        return json.dumps(run_dfs(start_url=start_url, limit=limit, keyword=keyword))


def run_dfs(start_url, limit, keyword):
    #process = CrawlerProcess()
    #configure_logging({'LOG_FORMAT': '%(levelname)s: %(message)s'})
    runner = CrawlerRunner()

    d = runner.crawl(RandomCrawlSpider, start_url, limit, keyword)
    d.addBoth(lambda _: reactor.stop())
    reactor.run()  # the script will block here until the crawling is finished
    
    websiteList = [RandomCrawlSpider.tree]

    return {
        'websites': websiteList,
        'keywordWebsite': RandomCrawlSpider.keywordWebsite,
        'errorMessage': RandomCrawlSpider.error
    }


def run_bfs(start_url, depth, keyword):
    """
    runner = CrawlerRunner()

    d = runner.crawl(BreadthCrawlSpider, start_url=start_url, depth=depth)
    d.addBoth(lambda _: reactor.stop())
    reactor.run()  # the script will block here until the crawling is finished

    """
    process = CrawlerProcess({
        'USER_AGENT': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'
    })
    process.crawl(BreadthCrawlSpider, start_url=start_url, depth=depth, keyword=keyword)
    process.start()
    #"""

    websiteList = [BreadthCrawlSpider.tree]

    return {
        'websites': websiteList,
        'keywordWebsite': BreadthCrawlSpider.keywordWebsite,
        'errorMessage': BreadthCrawlSpider.error
    }


if __name__ == '__main__':
    #print run(start_url='http://www.reddit.com/r/GameDeals/', bfs=False, limit=10)
    #print run(start_url='http://rheology.org/sor/info/default.htm', bfs=True, limit=2, keyword="circle")
    #print run(start_url='http://sherlockian.net', bfs=True, limit=2, keyword="circle")
    #print run(start_url='http://www.reddit.com/r/GameDeals/', bfs=True, limit=2, keyword="circle")
    #print run(start_url='https://www.twitter.com/', bfs=True, limit=2, keyword="circle")
    print run(start_url='https://www.uber.com/', bfs=True, limit=2, keyword="24/7")