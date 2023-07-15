import requests

from articles.management.commands.get_articles import get_articles

from django.core.management.base import BaseCommand

from articles.models import Article


class Command(BaseCommand):
    def handle(self, *args, **options):
        articles = get_articles(max_res=3000)
        self.stdout.write(self.style.SUCCESS("Updating articles"))
        articles_from_bd = list(map(lambda x: x[0], list(Article.objects.all().values_list("entry_id"))))
        for res in articles:
            arxiv = res[0]
            conf = res[1]

            arxiv_id = arxiv.entry_id[21: arxiv.entry_id.find("v", 21)]

            if arxiv_id in articles_from_bd:
                continue

            authors = ", ".join(list(map(str, arxiv.authors)))
            links = ", ".join(list(map(str, arxiv.links)))

            citation_api_link = "https://api.semanticscholar.org/graph/v1/paper/arXiv:"
            query_options = "?fields=citations,references,referenceCount,citationCount,authors.hIndex"
            response = requests.get(citation_api_link + arxiv_id + query_options)
            article_rating = 0
            author_rating = 0
            references = []
            citations = []
            if response.ok:
                json_response = response.json()
                references = json_response["references"]
                citations = json_response["citations"]
                article_rating = json_response["referenceCount"] + json_response["citationCount"]
                index_sum = 0
                index_count = 0
                for author in json_response["authors"]:
                    if author["authorId"] is None or author["hIndex"] is None:
                        continue
                    index_sum += author["hIndex"]
                    index_count += 1
                if index_count > 0:
                    author_rating = index_sum // index_count

            article = Article.objects.create(
                                            title=arxiv.title, entry_id=arxiv_id, links=links, published=arxiv.published,
                                            articleRating=article_rating, authorRating=author_rating,
                                            summary=arxiv.summary, authors=authors, references=references,
                                            conference=conf, comment=arxiv.comment, citations=citations
                                             )
            article.save()
        self.stdout.write(self.style.SUCCESS("Articles updated"))
