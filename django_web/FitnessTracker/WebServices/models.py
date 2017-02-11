# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


class User(models.Model):
    name = models.CharField(max_length=50)
    lastname = models.CharField(db_column='lastName', max_length=50)  # Field name made lowercase.
    email = models.CharField(unique=True, max_length=200, blank=True, null=True)
    joindate = models.DateTimeField(db_column='joinDate')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'user'
