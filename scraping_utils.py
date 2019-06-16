import requests
from bs4 import BeautifulSoup
import re
import pandas as pd

import tweepy

consumer_key = ''
consumer_secret = ''
access_token = ''
access_token_secret = ''

# Returns a list of items from a particular classname
def page_content(url, class_name):
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    content = soup.find_all(class_ = class_name)
    result = pd.Series(content)
    clean_html = lambda html: re.sub("<.*?>", "", str(html))
    return result.apply(clean_html)

# Returns a dataframe of paired HTML elements from a list of classnames
def paired_content(url, class_names):
    df = pd.DataFrame()
    for class_name in class_names:
        df[class_name] = page_content(url, class_name)
    return df

# Finds 100 tweets on a hashtag query
# Datestring needs to be formatted as YYYY-MM-DD
# Hashtag needs to be in format #hashtag
# Returns dataframe of tweets and dates
def hashtag_scrape(hashtag, datestring):
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth,wait_on_rate_limit=True)
    
    texts, dates = [], []
    cursor = tweepy.Cursor(api.search, q = hashtag,count=100, lang="en", since= datestring).items()

    for tweet in cursor:
        texts.append(tweet.text)
        dates.append(tweet.created_at)
    
    df = pd.DataFrame({"tweet": texts, "date": dates})
    return df