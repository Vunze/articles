import json

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import ArticleSerializer
from .management.commands.get_articles import get_articles
from django.views.generic import DetailView

from articles.models import Article
from django.db.models import Q


@api_view(["POST"])
def articlesList(request):
    params = json.loads(request.body)
    conf = params["conf"]
    order = params["order"]
    year = params["year"]
    sort_by = params["sort_by"]
    page = params["curr_page"]
    page_size = params["page_size"]
    min_article_rating = params["min_article_rating"]
    min_author_rating = params["min_author_rating"]
    search = params["search"]
    if order:
        sort_by = "-" + sort_by
    if len(conf) == 0:
        data = Article.objects.filter(articleRating__gte=min_article_rating,
                                      authorRating__gte=min_author_rating,
                                      published__year__gte=year).filter(
                                      Q(title__icontains=search) | Q(authors__icontains=search))
    else:
        data = Article.objects.filter(conference__in=conf, articleRating__gte=min_article_rating,
                                      authorRating__gte=min_author_rating, published__year__gte=year).filter(
                                      Q(title__icontains=search) | Q(authors__icontains=search))
    data = data.order_by(sort_by)[(page) * page_size:(page+1)*page_size]
    serializer = ArticleSerializer(data, context={'request': request}, many=True)
    response = Response(serializer.data, headers={"x-total-count": len(data)})
    return response


@api_view(["GET"])
def articleById(request):
    pk = int(request.META.get("PATH_INFO").split('/')[-1])
    data = Article.objects.get(pk=pk)
    serializer = ArticleSerializer(data, context={'request': request})
    return Response(serializer.data)


@api_view(["GET"])
def clear(request):
    Article.objects.all().delete()
    data = Article.objects.all()
    serializer = ArticleSerializer(data, context={'request': request}, many=True)
    return Response(serializer.data)
