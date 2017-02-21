from django.conf.urls import url
from django.conf.urls import include
from rest_framework.urlpatterns import format_suffix_patterns


from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/$', views.UserList.as_view()),
    url(r'^login/(?P<username>[a-z0-9]+)/(?P<password>[a-z0-9]+)/$', views.login),
    url(r'^signup/$', views.sign_up)
]

urlpatterns = format_suffix_patterns(urlpatterns)