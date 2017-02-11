from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from WebServices.serializers import UserSerializer
from WebServices.models import User


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
