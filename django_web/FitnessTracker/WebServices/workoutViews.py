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
from WebServices.models import User
from django.core import serializers
from itertools import chain

@api_view(['GET'])
def get_all_workouts(request,username):

    print 'GET Request for ALL Workouts'
    workoutExercises = WorkoutExercise.objects.filter(user=username)

    serializer = WorkoutExerciseSerializer(workoutExercises, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def assign_workout(request, trainer, trainee, workoutId):

    print 'Assigning ' + workoutId + ' from ' + trainer + ' to ' + trainee

    trainer_workout_exercises = WorkoutExercise.objects.filter(user=trainer, workoutId=workoutId)
    print trainer_workout_exercises
    trainee_workout_exercises = WorkoutExercise.objects.filter(user=trainee, workoutId=workoutId)
    print trainee_workout_exercises

    if(trainee_workout_exercises.count() > 0):
        return Response(status=status.HTTP_409_CONFLICT)

    try:
        for e in trainer_workout_exercises:
            e.id = None
            print trainee
            e.user = User.objects.get(username=trainee)
            print e
        WorkoutExercise.objects.bulk_create(trainer_workout_exercises)
        print trainer_workout_exercises
        return Response(status=status.HTTP_200_OK)
    except e:
        print e
        return Response(status=status.HTTP_400_BAD_REQUEST)