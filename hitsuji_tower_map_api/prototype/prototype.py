import sys

sys.path.append("../")

from conf import conf
from composer import Composer
from random import randint


conf = conf.conf


class Map_prototype:
    def __init__(self, conf):
        self.height = conf["map_height"]
        self.width = conf["map_width"]
        self.rooms = Rooms_prototype(conf, self.height, self.width)
        self.jump = conf["jump"]


class Rooms_prototype:
    def __init__(self, conf, map_height, map_width):
        self.height = conf["room_height"]
        self.width = conf["room_width"]
        self.variety = conf["variety"]
        self.rooms = self.create(map_height, map_width)
        self.composer = Composer(conf, self.rooms)
        self.rooms = self.composer.connect()

    def create(self, map_height, map_width):
        rooms = [[None for _ in range(map_width)] for _ in range(map_height)]
        for i in range(map_height):
            for j in range(map_width):
                kind = randint(1, self.variety)
                rooms[i][j] = Room_prototype(self.height, self.width, kind, i, j)
        return rooms


class Room_prototype:
    def __init__(self, room_height, room_width, kind, pos_x, pos_y):
        self.height = room_height
        self.width = room_width
        self.variety = kind
        self.pos_x = pos_x
        self.pos_y = pos_y
        self.room = self.room_init()

    def room_init(self):
        room = [None for _ in range(self.height)]
        for i in range(self.height):
            if i == 0:
                room[i] = ["1" for _ in range(self.width)]
            if 0 < i < self.height - 1:
                room[i] = ["1"] + ["0" for _ in range(self.width - 2)] + ["1"]
            if i == self.height - 1:
                room[i] = ["1" for _ in range(self.width)]
        return room


def prototype():
    map = Map_prototype(conf)
    print(
        [
            map.rooms.rooms[i][j].room
            for i in range(map.height)
            for j in range(map.width)
        ]
    )
    print(len(map.rooms.rooms))

    return map


prototype()
