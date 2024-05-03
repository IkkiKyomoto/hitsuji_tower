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
    queryset = Map.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
