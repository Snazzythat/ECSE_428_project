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
    description = models.CharField(max_length=200, blank=True, null=True)
    targeted_muscle = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Exercise'


class Nutrition(models.Model):
    name = models.CharField(max_length=45, blank=True, null=True)
    calories = models.FloatField(blank=True, null=True)
    protein = models.FloatField(blank=True, null=True)
    fat = models.FloatField(blank=True, null=True)
    carbohydrate = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Nutrition'


class Trainer(models.Model):
    profile = models.CharField(db_column='Profile', max_length=1000, blank=True, null=True)  # Field name made lowercase.
    user_username1 = models.ForeignKey('User', models.DO_NOTHING, db_column='User_username1')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Trainer'


class User(models.Model):
    name = models.CharField(max_length=45)
    email = models.CharField(max_length=45)
    d_o_b = models.DateField(db_column='d.o.b', blank=True, null=True)  # Field renamed to remove unsuitable characters.
    username = models.CharField(primary_key=True, max_length=45)
    password = models.CharField(db_column='Password', max_length=45)  # Field name made lowercase.
    type = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'User'


class Workout(models.Model):
    workoutid = models.CharField(db_column='workoutID', primary_key=True, max_length=45)  # Field name made lowercase.
    name = models.CharField(unique=True, max_length=45)

    class Meta:
        managed = False
        db_table = 'Workout'


class WorkoutExercise(models.Model):
    workoutId = models.ForeignKey(Workout, models.DO_NOTHING, db_column='workoutId')  # Field name made lowercase.
    exerciseName = models.ForeignKey(Exercise, models.DO_NOTHING, db_column='exerciseName')  # Field name made lowercase.
    user = models.ForeignKey(User, models.DO_NOTHING, db_column='user')  # Field name made lowercase.
    numberReps = models.IntegerField(db_column='numberReps', blank=True, null=True)  # Field name made lowercase.
    numberSets = models.IntegerField(db_column='numberSets', blank=True, null=True)  # Field name made lowercase.
    durationMins = models.IntegerField(db_column='durationMins', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Workout_Exercise'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'
