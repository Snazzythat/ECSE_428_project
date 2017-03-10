from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework import generics
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from WebServices.models import Exercise
from WebServices.serializers import ExerciseSerializer
from django.core import serializers

def index(request):
    print 'GET Request for ALL Exercise'
    exercises = Exercise.objects.all()
    serializer = ExerciseSerializer(exercises, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_exercise(request):

    type = request.query_params.get('type')

    print 'GET EXERCISE request for: ' + str(type)

    try:
        exercise = Exercise.objects.all().filter(type=type)
        serializer = ExerciseSerializer(exercise, many=True)
        return JsonResponse(serializer.data, safe=False)
    except Exercise.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_exercise(request):
    print 'POST EXERCISE request!'
    print 'Request data: ' + str(request.data)
    serializer = ExerciseSerializer(data=request.data)

    # check if the user name specified in sign up request exists already
    print '****Verifying new EXERCISE request params***'
    try:
        exercise_in_db = Exercise.objects.get(name=request.data['name'])
        print '-->Exercise already found in db! Returning 405.'
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exercise.DoesNotExist:
        pass

    if (serializer.is_valid()):
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
