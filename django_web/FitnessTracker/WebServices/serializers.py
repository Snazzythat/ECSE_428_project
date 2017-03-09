from rest_framework import serializers
from WebServices.models import User
from WebServices.models import Nutrition


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'email', 'username', 'password', 'd_o_b', 'type')

class NutritionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nutrition
        fields = ('name', 'calories', 'protein', 'fat', 'carbohydrate')
