from get_articles import get_articles
from pymongo import MongoClient


class Article:
    def __init__(self, arxiv, conf):
        self.id = arxiv.entry_id
        self.summary = arxiv.summary
        self.published = arxiv.published
        self.title = arxiv.title
        self.comment = arxiv.comment
        if conf:
            self.conf = conf.pop()
        else:
            self.conf = ""

    def json(self):
        return {
            "id": self.id,
            "published": self.published,
            "title": self.title,
            "comment": self.comment,
            "conference": self.conf,
        }

    def __str__(self):
        return self.title

    __repr__ = __str__


def get_database():
    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    CONNECTION_STRING = # process.env.DB_CONNECT

    # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
    client = MongoClient(CONNECTION_STRING)

    # Create the database for our example (we will use the same database throughout the tutorial
    return client['test']


dbname = get_database()
articles = dbname['articles']

i = 0
for res in get_articles(max_res=2000):
    article = Article(res[0], res[1])
    if i % 100 == 0:
        print(i, article)
    i += 1
    articles.insert_one(article.json())
