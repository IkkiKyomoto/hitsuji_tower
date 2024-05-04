from rest_framework import serializers
from .models import Map, Room, RoomColumn, Column, MapRoom


class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = ["pos_y", "content"]


class RoomColumnSerializer(serializers.ModelSerializer):
    column = ColumnSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ["column"]

    def get_columns(room_id):
        return Column.objects.filter(room=room_id)


class RoomSerializer(serializers.ModelSerializer):
    columns = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = ["pos_x", "pos_y", "height", "width", "columns"]

    def get_columns(self, obj):
        room_columns = RoomColumn.objects.filter(room=obj)
        columns = [room_column.column for room_column in room_columns]
        return ColumnSerializer(columns, many=True).data


class MapRoomSerializer(serializers.ModelSerializer):
    room = RoomColumnSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ["room"]

    def get_rooms(self, obj, map_id):
        return Room.objects.filter(map=map_id)


class MapSerializer(serializers.ModelSerializer):
    rooms = serializers.SerializerMethodField()

    class Meta:
        model = Map
        fields = ["map_height", "map_width", "rooms", "jump"]

    def get_rooms(self, obj):
        map_rooms = MapRoom.objects.filter(map=obj)
        rooms = [map_room.room for map_room in map_rooms]
        return RoomSerializer(rooms, many=True).data


class LatestMapSerializer(serializers.ModelSerializer):
    map = serializers.SerializerMethodField()

    class Meta:
        model = Map
        fields = ["map"]

    def get_latest_map(self):
        return Map.objects.latest("id")
