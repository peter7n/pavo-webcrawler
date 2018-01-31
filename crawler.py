import json
#import scrapy

# main function for the crawl (currently only returns dummy results)
# dfs/bfs option is represented as boolean
def run(start_page="", bfs=False, limit=0, keyword=None):
    return json.dumps(
        {
            'traversal_method': 'bfs',
            'result': {'a': ['b', 'c'], 'b': ['d', 'e'], 'c': []},
            'keyword_location': None
        }
    )
