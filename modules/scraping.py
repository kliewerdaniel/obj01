import sys
import types

# Create a dummy module for lxml.html.clean
clean_module = types.ModuleType('lxml.html.clean')
sys.modules['lxml.html.clean'] = clean_module

# Now import the actual cleaner from the new package
from lxml_html_clean import Cleaner

# Patch the dummy module
clean_module.Cleaner = Cleaner

import atoma
import requests
from newspaper import Article
import yaml



def load_feeds(config_path="configs/feeds.yaml"):
    with open(config_path, 'r') as f:
        return yaml.safe_load(f)['sources']

def fetch_articles(max_articles=1):
    sources = load_feeds()
    articles = []
    
    for source in sources:
        try:
            # Fetch and parse RSS feed
            response = requests.get(source['url'])
            feed = atoma.parse_rss_bytes(response.content)
            
            for entry in feed.items[:max_articles]:
                article = Article(entry.link)
                article.download()
                article.parse()
                
                articles.append({
                    'title': article.title,
                    'text': article.text,
                    'source': source['name'],
                    'url': entry.link,
                    'language': source['lang'],
                    'published': entry.pub_date.isoformat() if entry.pub_date else ""
                })
                
        except Exception as e:
            print(f"Error processing {source['name']}: {str(e)}")
    
    return articles