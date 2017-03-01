from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from WebServices.serializers import UserSerializer
from WebServices.models import User


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@api_view(['POST'])
def sign_up(request):
    print 'POST SIGNUP request!'
    print 'Request data: ' + str(request.data)
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        print 'New user signed up! New data is: ' + str(serializer.data)
        serializer.save()
        #Distinguish user and trainer after signup to be able to login  
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def login(request, username, password):
    print 'GET LOGIN request from: ' + username + ' whose password is: ' + password 

    #TODO: At get, we need to return 200 or 202 for USER and TRAINER
    # in order to be able to destinguish both. To do so, we need to first get the data from login request
    # check the db if we exists as user or trainer and then return the respected answer code.
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = UserSerializer(user)
    #Distinguish user and trainer after login as well to be able to login  
    if user.password == password:
        #return Response(serializer.data) //old way just returning data
        #Now need to return @login if we logged in as user or trainer
        #Distinguish trainer and user with HTTP 200 and 202. 201 reserved for creation
        if user.type == 'User':
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif user.type == 'Trainer':
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)