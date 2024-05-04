from django.shortcuts import render
from .models import initAll

# Create your views here.
from rest_framework import permissions, viewsets
from .serializers import MapSerializer, MapRoomSerializer, RoomColumnSerializer
from .models import MapRoom, Room, Map
from rest_framework.response import Response


class MapViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = MapSerializer
    initAll()

    def get_queryset(self):
        latest_map = Map.objects.latest("id")
        return [latest_map]
