from django.db import models


# Create your models here.
class Player(models.Model):
    name = models.CharField(max_length=100)
    time = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
