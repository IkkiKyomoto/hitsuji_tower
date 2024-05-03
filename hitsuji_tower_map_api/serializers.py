from rest_framework import serializers
from .models import Map, Room, RoomColumn, Column, MapRoom


class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = "__all__"


class RoomColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomColumn
        fields = ["pos_y", "column"]

    def get_columns(room_id):
        return Column.objects.filter(room=room_id)


class MapRoomSerializer(serializers.ModelSerializer):
    columns = RoomColumnSerializer(many=True, read_only=True)

    class Meta:
        model = MapRoom
        fields = ["room_height", "room_width", "pos_x", "pos_y", "columns"]

    def get_rooms(map_id):
        return Room.objects.filter(map=map_id)


class MapSerializer(serializers.ModelSerializer):
    rooms = MapRoomSerializer(many=True, read_only=True)

    class Meta:
        model = Map
        fields = ["id", "map_height", "map_width", "rooms", "jump"]

    def get_latest_map():
        return Map.objects.latest("id")
