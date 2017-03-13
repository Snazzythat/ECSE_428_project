from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework import generics
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from WebServices.models import Exercise
from WebServices.serializers import ExerciseSerializer
from WebServices.models import Workout
from WebServices.serializers import WorkoutSerializer
from WebServices.models import WorkoutExercise
from WebServices.serializers import WorkoutExerciseSerializer
from django.core import serializers
from itertools import chain

@api_view(['GET'])
def get_all_workouts(request,username):

    print 'GET Request for ALL Workouts'
    workoutExercises = WorkoutExercise.objects.filter(user=username)

    serializer = WorkoutExerciseSerializer(workoutExercises, many=True)
    return JsonResponse(serializer.data, safe=False)