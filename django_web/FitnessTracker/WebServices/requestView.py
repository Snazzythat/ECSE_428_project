from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework import generics
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from WebServices.models import TrainerTraineeRequest
from WebServices.serializers import TrainerTraineeRequestSerializer
from django.core import serializers

def index(request):
    print 'GET Request for ALL TrainerTraineeRequest'
    requests = TrainerTraineeRequest.objects.all()
    serializer = TrainerTraineeRequestSerializer(requests, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def get_request_for_a_trainer(request):

    username = request.query_params.get('trainer_username')

    print 'GET REQUEST request for: ' + str(username)

    try:
        trainer_request = TrainerTraineeRequest.objects.all().filter(trainer_username=username)
        serializer = TrainerTraineeRequestSerializer(trainer_request, many=True)
        return JsonResponse(serializer.data, safe=False)
    except TrainerTraineeRequest.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def create_request(request):
    print 'POST REQUEST request!'
    print 'Request data: ' + str(request.data)
    serializer = TrainerTraineeRequestSerializer(data=request.data)

    print '****Verifying new TrainerTraineeRequest request params***'

    if (serializer.is_valid()):
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def update_status_request(request):
    print 'POST UPDATE STATUS REQUEST request!'
    print 'Request data: ' + str(request.data)
    data_status = request.data['status']
    trainer_username = request.data['trainer_username']
    trainee_username = request.data['trainee_username']
    serializer = TrainerTraineeRequestSerializer(data=request.data)

    print '****Verifying REQUEST request params***'
    try:
        request_in_db = TrainerTraineeRequest.objects.get(trainer_username=trainer_username, trainee_username=trainee_username)
        print '-->Request found in db! Updating....'
        new_serializer = TrainerTraineeRequestSerializer(request_in_db, request.data)
        if (new_serializer.is_valid()):
            if (data_status == 'REJECTED'):
                request_in_db.delete()
            else:
                new_serializer.save()
        return Response(request.data, status=status.HTTP_201_CREATED)
    except TrainerTraineeRequest.DoesNotExist:
        pass

    serializer.is_valid()
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
