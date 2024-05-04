from .composer import Composer
from random import randint


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

        # ここにコンポーザーを登録
        self.rooms = self.composer.connect()
        self.rooms = self.composer.generate_terrain()

    def create(self, map_height, map_width):
        rooms = [[None for _ in range(map_width)] for _ in range(map_height)]
        for i in range(map_height):
            for j in range(map_width):
                kind = randint(1, self.variety)
                rooms[i][j] = Room_prototype(self.height, self.width, kind, j, i)
                # if i == 0 and j == 0:
                #     rooms[i][j].room[1][1] = "S"
                # elif i == map_height - 1 and j == map_width - 1:
                #     rooms[i][j].room[1][self.width - 1] = "G"
        return rooms


class Room_prototype:
    def __init__(self, room_height, room_width, kind, pos_x, pos_y):
        self.height = room_height
        self.width = room_width
        self.kind = kind
        self.pos_x = pos_x
        self.pos_y = pos_y
        self.room = self.room_init()
        self.start = None
        self.end = None

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


def prototype(conf):
    map = Map_prototype(conf)

    return map
