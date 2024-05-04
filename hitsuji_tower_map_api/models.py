from django.db import models
from .prototype import prototype
from .conf import conf as c


# Create your models here.
class Map(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    map_height = models.IntegerField()
    map_width = models.IntegerField()
    jump = models.IntegerField()

    # def __str__(self):
    #     return self.name


class Room(models.Model):
    id = models.AutoField(primary_key=True)
    map = models.ForeignKey(Map, on_delete=models.CASCADE)
    pos_x = models.IntegerField()
    pos_y = models.IntegerField()
    height = models.IntegerField()
    width = models.IntegerField()

    def initMapRoom(self, map, room, pos_x, pos_y, height, width):
        return MapRoom.objects.create(
            map=map, room=room, pos_x=pos_x, pos_y=pos_y, height=height, width=width
        )


class MapRoom(models.Model):
    id = models.AutoField(primary_key=True)
    map = models.ForeignKey(Map, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)


class Column(models.Model):
    id = models.AutoField(primary_key=True)
    pos_y = models.IntegerField()
    content = models.CharField(max_length=100)

    def initColumn(self, pos_y, content):
        return Column.objects.create(pos_y=pos_y, content=content)


class RoomColumn(models.Model):
    id = models.AutoField(primary_key=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    column = models.ForeignKey(Column, on_delete=models.CASCADE)

    def initRoomColumn(self, room, column):
        return RoomColumn.objects.create(room=room, column=column)


def initAll():
    conf = c.getConf()
    prototype_map = prototype.prototype(conf)

    map = Map(
        map_height=prototype_map.height,
        map_width=prototype_map.width,
        jump=prototype_map.jump,
    )
    map.save()
    rooms = []
    columns = []
    for i in range(map.map_height):
        for j in range(map.map_width):
            room = Room(
                map=map,
                pos_x=prototype_map.rooms.rooms[i][j].pos_x,
                pos_y=prototype_map.rooms.rooms[i][j].pos_y,
                height=prototype_map.rooms.rooms[i][j].height,
                width=prototype_map.rooms.rooms[i][j].width,
            )
            room.save()
            rooms.append(room)
            mapRoom = MapRoom(map=map, room=room)
            mapRoom.save()
            for k in range(prototype_map.rooms.rooms[i][j].height):
                column = Column(
                    pos_y=k,
                    content="".join(prototype_map.rooms.rooms[i][j].room[k]),
                )
                column.save()
                columns.append(column)
                roomColumn = RoomColumn(room=room, column=column)
                roomColumn.save()
    # return {
    #     "map_height": c.conf["map_height"],
    #     "map_width": c.conf["map_width"],
    #     "room_height": c.conf["room_height"],
    #     "room_width": c.conf["room_width"],
    #     "jump": c.conf["jump"],
    #     "rooms": [
    #         {
    #             "pos_x": room.pos_x,
    #             "pos_y": room.pos_y,
    #             "columns": [
    #                 {"pos_y": column.pos_y, "content": column.content}
    #                 for column in columns
    #             ],
    #         }
    #         for room in rooms
    #     ],
    # }
    # for i in range(prototype_map.height):
    #     for j in range(prototype_map.width):
    #         room = Room.initRoom()
    #         map_room = MapRoom.initMapRoom(
    #             map,
    #             room,
    #             i,
    #             j,
    #             prototype_map.rooms[i][j].height,
    #             prototype_map.rooms[i][j].width,
    #         )
    #         for k in range(prototype_map.rooms[i][j].height):
    #             column = Column.initColumn(
    #                 k, "".join(prototype_map.rooms[i][j].room[k])
    #             )
    #             RoomColumn.initRoomColumn(room, column)
    # return map
