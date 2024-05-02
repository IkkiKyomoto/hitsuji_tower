from random import randint
from math import floor


class Composer:

    def __init__(self, conf, rooms):
        self.conf = conf
        self.rooms = rooms

    # ゲートを生成
    def connect(self):
        def getGate(conf, next):
            if next[1] == 1 or next[1] == -1:
                tmp = randint(1, conf["room_height"] - 3)
                return [tmp, tmp + 1]
            elif next[0] == 1 or next[0] == -1:
                tmp = randint(1, conf["room_width"] - 3)
                return [tmp, tmp + 1]

        def getPresentGateMemo(conf, next, room):
            x = (conf["room_height"] - 1) / 2
            y = (conf["room_width"] - 1) / 2
            pos = [x + x * next[0], y + y * next[1]]
            if pos[0] - floor(pos[0]) > 0:
                pos[1] = int(pos[1])
                gate = getGate(conf, next)
                pos[0] = gate[0]
                room[gate[0]][pos[1]] = "N"
                room[gate[1]][pos[1]] = "N"
            elif pos[1] - floor(pos[1]) > 0:
                pos[0] = int(pos[0])
                gate = getGate(conf, next)
                pos[1] = gate[0]
                room[pos[0]][gate[0]] = "N"
                room[pos[0]][gate[1]] = "N"
            pos = list(map(int, pos))
            return [room, pos]

        def getNextGateMemo(next, prev_pos, room):

            if next[0] == 1:
                room[0][prev_pos[1]] = "N"
                room[0][prev_pos[1] + 1] = "N"
            elif next[1] == 1:
                room[prev_pos[0]][0] = "N"
                room[prev_pos[0] + 1][0] = "N"
            elif next[1] == -1:
                # 左に移動　高さキープ
                room[prev_pos[0]][-1] = "N"
                room[prev_pos[0] + 1][-1] = "N"
            return room

        for i in range(self.conf["map_height"]):
            for k in range(self.conf["map_width"]):
                if i % 2 == 0:
                    j = k
                else:
                    j = self.conf["map_width"] - 1 - k
                if i == self.conf["map_height"] - 1 and j == self.conf["map_width"] - 1:
                    return self.rooms
                next = [0, 0]
                if i % 2 == 0:
                    if j == self.conf["map_width"] - 1:
                        next[0] = 1
                        next[1] = 0

                    else:
                        next[0] = 0
                        next[1] = 1
                else:
                    if j == 0:
                        next[0] = 1
                        next[1] = 0
                    else:
                        next[0] = 0
                        next[1] = -1

                gateMemo = getPresentGateMemo(self.conf, next, self.rooms[i][j].room)
                self.rooms[i][j].room = gateMemo[0]
                self.rooms[i + next[0]][j + next[1]].room = getNextGateMemo(
                    next,
                    gateMemo[1],
                    self.rooms[i + next[0]][j + next[1]].room,
                )
