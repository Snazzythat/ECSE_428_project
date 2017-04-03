from rest_framework import serializers
from WebServices.models import User
from WebServices.models import Nutrition
from WebServices.models import Exercise
from WebServices.models import TrainerTraineeRequest
from WebServices.models import Workout
from WebServices.models import WorkoutExercise
from WebServices.models import traineeGetter
from WebServices.models import trainerGetter


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

class TrainerTraineeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainerTraineeRequest
        fields = ('status', 'trainee_username', 'trainer_username')

    def update(self, instance, validated_data):
        instance.trainer_username = validated_data.get('trainer_username', instance.trainer_username)
        instance.trainee_username = validated_data.get('trainee_username', instance.trainee_username)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance

class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ('workoutId', 'name')

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = ('id', 'workoutId', 'user', 'exerciseName', 'numberReps', 'numberSets', 'durationMins')

class traineeGetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = traineeGetter
        fields = ('trainer_username', 'trainee1_username', 'trainee2_username', 'trainee3_username', 'trainee4_username', 'trainee5_username')

class trainerGetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = trainerGetter
        fields = ('trainee_username', 'trainer1_username', 'trainer2_username', 'trainer3_username')
