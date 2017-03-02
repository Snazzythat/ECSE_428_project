# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


class Exercise(models.Model):
    name = models.CharField(primary_key=True, max_length=45)
    type = models.CharField(max_length=45, blank=True, null=True)
    description = models.CharField(max_length=45, blank=True, null=True)
    targeted_muscle = models.CharField(max_length=45, blank=True, null=True)
    workout_workoutid = models.ForeignKey('Workout', models.DO_NOTHING, db_column='Workout_workoutID', related_name='+')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Exercise'


class Trainer(models.Model):
    profile = models.CharField(db_column='Profile', max_length=1000, blank=True, null=True)  # Field name made lowercase.
    user_username1 = models.ForeignKey('User', models.DO_NOTHING, db_column='User_username1')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Trainer'


class User(models.Model):
    name = models.CharField(max_length=45)
    email = models.CharField(max_length=45)
    d_o_b = models.DateField(db_column='d.o.b')  # Field renamed to remove unsuitable characters.
    username = models.CharField(primary_key=True, max_length=45)
    password = models.CharField(db_column='Password', max_length=45)  # Field name made lowercase.
    type = models.CharField(db_column='type', max_length=45)

    class Meta:
        managed = False
        db_table = 'User'


class Workout(models.Model):
    workoutid = models.IntegerField(db_column='workoutID', primary_key=True)  # Field name made lowercase.
    exercise = models.CharField(max_length=45, blank=True, null=True)
    reps = models.CharField(max_length=45, blank=True, null=True)
    sets = models.CharField(max_length=45, blank=True, null=True)
    user_username = models.ForeignKey(User, models.DO_NOTHING, db_column='User_username')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Workout'


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'
