from rest_framework import serializers
from WebServices.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'email', 'username', 'password', 'd_o_b')
