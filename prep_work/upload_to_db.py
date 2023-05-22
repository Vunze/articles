from get_articles import get_articles
from pymongo import MongoClient
import requests


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
        authors = []
        for elem in arxiv.authors:
            authors.append(str(elem))
        self.authors = authors
        links = []
        for elem in arxiv.links:
            links.append(str(elem))
        self.links = links
        self.citations = []
        self.references = []
        self.articleRating = 0
        self.authorRating = 0

    def json(self):
        return {
            "id": self.id,
            "summary": self.summary,
            "published": self.published,
            "title": self.title,
            "comment": self.comment,
            "conference": self.conf,
            "authors": self.authors,
            "links": self.links,
            "citations": self.citations,
            "references": self.references,
            "articleRating": self.articleRating,
            "authorRating": self.authorRating,
        }

    def __str__(self):
        return self.title

    __repr__ = __str__


def get_database():
    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    CONNECTION_STRING = "mongodb+srv://vunz:fuloron67@articles.zavth9x.mongodb.net/?retryWrites=true&w=majority"

    # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
    client = MongoClient(CONNECTION_STRING)

    # Create the database for our example (we will use the same database throughout the tutorial
    return client["test"]


citation_api_link = "https://api.semanticscholar.org/graph/v1/paper/arXiv:"
query_options = "?fields=citations,references,referenceCount,citationCount,authors.hIndex"
dbname = get_database()
articles = dbname['articles']

i = 0
for res in get_articles(max_res=3000):
    article = Article(res[0], res[1])
    if i % 100 == 0:
        print(i, article)
    i += 1
    arxiv_id = article.id[21: article.id.find("v", 21)]
    if articles.find_one({"id": article.id}) is not None:
        continue
    response = requests.get(citation_api_link + arxiv_id + query_options)
    if response.ok:
        article.references = response.json()["references"]
        article.citations = response.json()["citations"]
        article.articleRating = response.json()["referenceCount"] + response.json()["citationCount"]
        index_sum = 0
        index_count = 0
        for author in response.json()["authors"]:
            if author["authorId"] is None or author["hIndex"] is None:
                continue
            index_sum += author["hIndex"]
            index_count += 1
        if index_count > 0:
            article.authorRating = index_sum // index_count
    articles.insert_one(article.json())

