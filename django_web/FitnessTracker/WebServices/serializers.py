from rest_framework import serializers
from WebServices.models import User
from WebServices.models import Nutrition
from WebServices.models import Exercise


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'email', 'username', 'password', 'd_o_b', 'type')

class NutritionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nutrition
        fields = ('name', 'calories', 'protein', 'fat', 'carbohydrate')

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ('name', 'type', 'description', 'targeted_muscle')
