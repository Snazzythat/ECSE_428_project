from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from WebServices.serializers import UserSerializer
from WebServices.models import User
from django.core.mail import EmailMessage


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

    #Treat cases:
    #1. User doesnt exist in the DB, all data is new and valid, account is created (201)
    #2. User exists already in the database (same email) return user redirect code (306)
    #3. User exists already in the database (same username) return not allowed username code (405)

    # check if the user name specified in sign up request exists already
    print '****Verifying new user request params***'
    try:
        user_in_db = User.objects.get(username=request.data['username'])
        print '-->username found in db, exists already! Returning 405.'
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    except User.DoesNotExist:
        print 'username does not exist, will check by email'
        pass

    try:
        user_in_db = User.objects.get(email=request.data['email'])
        print '-->email found in db, exists already! Returning 306.'
        return Response(status=status.HTTP_306_RESERVED)
    except User.DoesNotExist:
        print '-->email does not exist, good to go with a new user entry'
        pass

    if serializer.is_valid():
        serializer.save()
        #Distinguish user and trainer after signup to be able to login
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def login(request, username, password):
    print 'GET LOGIN request from: ' + str(username) + ' whose password is: ' + str(password)

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
    else:
        #bad password, return wrong password
        return Response(serializer.data, status=status.HTTP_401_UNAUTHORIZED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def password_recovery(request, email):

    print 'POST PASSWORD RECOVERY request from: ' + str(email)

    try:
        print 'Searching for user with the email' + str(email)
        user = User.objects.get(email=email)
        print 'User with email ' + str(email) + ' found! Sending the email...'
    except User.DoesNotExist:
        print 'User with email ' + str(email) + ' not found! Sending 400.'
        return Response(status=status.HTTP_400_BAD_REQUEST)

    user_password_to_send = user.password
    email = EmailMessage('Fitness Tracker Password Recovery', 'Hi there, your password is: ' + str(user_password_to_send), to=[email])
    email.send()
    print 'Message sent! Responding with 200.'
    
    return Response(status=status.HTTP_200_OK)
