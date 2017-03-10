from django.conf.urls import url
from django.conf.urls import include
from rest_framework.urlpatterns import format_suffix_patterns


from . import views
from . import nutritionViews

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/$', views.UserList.as_view()),
    url(r'^login/(?P<username>[a-z0-9]+)/(?P<password>[a-z0-9]+)/$', views.login),
    url(r'^signup/$', views.sign_up),
    url(r'^nutrition/$', nutritionViews.index),
    url(r'^nutrition/get$', nutritionViews.get_nutrition),
    url(r'^nutrition/create$', nutritionViews.create_nutrition),
    url(r'^passwordrecovery/$', views.password_recovery)
]

urlpatterns = format_suffix_patterns(urlpatterns)
