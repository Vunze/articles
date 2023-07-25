from rest_framework import serializers
from .models import Article


class ArticleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Article
        fields = ('pk', 'entry_id', 'title', 'links', 'published', 'articleRating', 'authorRating', 'summary', 'authors', 'references', 'conference', 'comment', 'citations')
