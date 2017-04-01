from django.conf.urls import url
from django.conf.urls import include
from rest_framework.urlpatterns import format_suffix_patterns


from . import views
from . import nutritionViews
from . import exerciseView
from . import workoutViews

#This is just a test, ignore it
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^api/$', views.UserList.as_view()),
    url(r'^login/(?P<username>[a-z0-9]+)/(?P<password>[a-z0-9]+)/$', views.login),
    url(r'^signup/$', views.sign_up),
    url(r'^nutrition/$', nutritionViews.index),
    url(r'^nutrition/get$', nutritionViews.get_nutrition),
    url(r'^nutrition/create$', nutritionViews.create_nutrition),
    url(r'^exercise/$', exerciseView.index),
    url(r'^exercise/get$', exerciseView.get_exercise),
    url(r'^exercise/create$', exerciseView.create_exercise),
    url(r'^workout/getAll/(?P<username>[a-z0-9]+)/$', workoutViews.get_all_workouts),
    url(r'^workout/assign/(?P<trainer>[a-z0-9]+)/(?P<trainee>[a-z0-9]+)/(?P<workoutId>[a-z0-9]+)/$', workoutViews.assign_workout),
    url(r'^passwordrecovery/$', views.password_recovery),
    url(r'^social/getMyTrainees/(?P<trainer_username>[a-z0-9]+)/$', views.getMyTrainees),
    url(r'^social/getMyTrainers/(?P<trainee_username>[a-z0-9]+)/$', views.getMyTrainers)
]

urlpatterns = format_suffix_patterns(urlpatterns)
