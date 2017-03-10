from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework import generics
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from WebServices.models import Nutrition
from WebServices.serializers import NutritionSerializer
from django.core import serializers

def index(request):
    print 'GET Request for ALL Nutrition'
    nutritions = Nutrition.objects.all()
    serializer = NutritionSerializer(nutritions, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_nutrition(request):

    name = request.query_params.get('name')

    print 'GET NUTRITION request for: ' + str(name)

    try:
        nutrition = Nutrition.objects.get(pk=name)
        serializer = NutritionSerializer(nutrition)
        return JsonResponse(serializer.data)
    except Nutrition.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_nutrition(request):
    print 'POST NUTRITION request!'
    print 'Request data: ' + str(request.data)
    serializer = NutritionSerializer(data=request.data)

    # check if the user name specified in sign up request exists already
    print '****Verifying new nutrition request params***'
    try:
        nutrition_in_db = Nutrition.objects.get(name=request.data['name'])
        print '-->Nutrition already found in db! Returning 405.'
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    except Nutrition.DoesNotExist:
        pass

    if (serializer.is_valid()):
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
