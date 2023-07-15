from django.db import models


class Article(models.Model):
    entry_id = models.TextField("Entry_id")
    title = models.TextField("Title")
    published = models.DateField("Published")
    links = models.TextField("Links")
    articleRating = models.IntegerField("Article rating")
    authorRating = models.IntegerField("Author rating")
    summary = models.TextField("Summary")
    authors = models.TextField("Authors")
    references = models.JSONField("References")
    conference = models.TextField("Conference")
    comment = models.TextField("Comment")
    citations = models.JSONField("Citations")

    def __str__(self):
        return self.title
