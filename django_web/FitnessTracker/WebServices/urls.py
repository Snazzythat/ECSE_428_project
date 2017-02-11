from django.conf.urls import url
from django.conf.urls import include
from rest_framework.urlpatterns import format_suffix_patterns


from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/$', views.UserList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)