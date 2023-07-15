from django.urls import re_path
from articles import views

urlpatterns = [
    re_path('^api/articles/$', views.articlesList),
    re_path('api/clear', views.clear),
    re_path('^api/articles/\d+$', views.articleById)
]
