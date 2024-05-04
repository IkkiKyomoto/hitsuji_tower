from random import randint


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

        def getPresentGateMemo(conf, next, room, i, j):
            x = (conf["room_height"] - 1) / 2
            y = (conf["room_width"] - 1) / 2
            pos = [x + x * next[0], y + y * next[1]]
            if 0 < pos[0] < conf["room_height"] - 1:
                pos[1] = int(pos[1])
                gate = getGate(conf, next)
                pos[0] = gate[0]
                if i % 2 == 0:
                    pos[0] = conf["room_height"] - 3
                    room[pos[0]][pos[1]] = "N"
                    room[pos[0] + 1][pos[1]] = "N"
                if i % 2 == 1:
                    pos[0] = 1
                    room[pos[0]][pos[1]] = "N"
                    room[pos[0] + 1][pos[1]] = "N"
            elif 0 < pos[1] < conf["room_width"] - 1:
                if i % 2 == 0:
                    pos[0] = int(pos[0])
                    gate = getGate(conf, next)
                    pos[1] = conf["room_width"] - 3
                    room[pos[0]][conf["room_width"] - 3] = "N"
                    room[pos[0]][conf["room_width"] - 2] = "N"
                else:
                    pos[0] = int(pos[0])
                    gate = getGate(conf, next)
                    pos[1] = 1
                    room[pos[0]][1] = "N"
                    room[pos[0]][2] = "N"
            pos = list(map(int, pos))
            self.rooms[i][j].end = pos

            return [room, pos]

        def getNextGateMemo(next, prev_pos, room, i, j):
            pos = [0, 0]
            if next[0] == 1:
                room[0][prev_pos[1]] = "N"
                room[0][prev_pos[1] + 1] = "N"
                pos = [0, prev_pos[1]]
            elif next[1] == 1:
                room[prev_pos[0]][0] = "N"
                room[prev_pos[0] + 1][0] = "N"
                pos = [prev_pos[0], 0]
            elif next[1] == -1:
                # 左に移動　高さキープ
                room[prev_pos[0]][-1] = "N"
                room[prev_pos[0] + 1][-1] = "N"
                pos = [prev_pos[0], self.conf["room_width"] - 1]
            self.rooms[i + next[0]][j + next[1]].start = pos

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

                gateMemo = getPresentGateMemo(
                    self.conf, next, self.rooms[i][j].room, i, j
                )
                self.rooms[i][j].room = gateMemo[0]
                self.rooms[i][j].end = gateMemo[1]
                self.rooms[i + next[0]][j + next[1]].room = getNextGateMemo(
                    next, gateMemo[1], self.rooms[i + next[0]][j + next[1]].room, i, j
                )

    def generate_terrain(self):
        def generate(p, end, room, jump, direction):
            for i in range(1, p[0]):
                for j in range(1, p[1]):
                    room[i][j] = "1"
            while p[1] < end[1] - 1:
                step = randint(
                    -min(
                        p[0] - 1,
                        jump,
                    ),
                    min(self.conf["room_height"] - p[0] - 2, jump),
                )
                while abs(end[0] - (p[0] + step)) > jump * (end[1] - p[1] - 1):
                    step = randint(
                        -min(
                            p[0] - 1,
                            jump,
                        ),
                        min(self.conf["room_height"] - p[0] - 2, jump),
                    )
                    print(step)

                if step > 0:
                    for i in range(abs(step)):
                        for j in range(end[1] - p[1]):
                            room[p[0] + i][p[1] + j] = "1"
                else:
                    for i in range(abs(step)):
                        for j in range(end[1] - p[1]):
                            room[p[0] - i][p[1] + j] = "0"
                    for i in range(end[1] - p[1]):
                        room[p[0] + step - 1][p[1] + i] = "1"

                p[0] += step
                p[1] += 1

        start = [1, 1]
        goal = [3, self.conf["room_width"] - 2]
        jump = self.conf["jump"]
        for i in range(self.conf["map_height"]):
            for j in range(self.conf["map_width"]):
                room = self.rooms[i][j].room
                start = self.rooms[i][j].start
                end = self.rooms[i][j].end
                # スタートの部屋
                if i == 0 and j == 0:
                    start = [1, 1]
                    room[start[0]][start[1]] = "S"
                    start[1] += 1
                    direction = 1
                    generate(start, end, room, jump, direction)
                elif (
                    i == self.conf["map_height"] - 1 and j == self.conf["map_width"] - 1
                ):
                    room[goal[0]][goal[1]] = "G"
                    direction = 1
                    start[1] += 2

                    generate(start, goal, room, jump, direction)
                    for k in range(1, goal[0]):

                        room[k][goal[1]] = "1"

                elif i % 2 == 0 and j == self.conf["map_width"] - 1:
                    direction = 1
                    start[1] += 2
                    end[1] += 1
                    generate(start, end, room, jump, direction)
                    for k in range(1, self.conf["room_height"] - 2):
                        print(end[1], self.conf["room_width"] - 1, "$")
                        room[k][self.conf["room_width"] - 2] = "1"
                elif i % 2 == 0 and j == 0:
                    start[1] += 2
                    start[0] -= 1
                    end[0] += 1
                    generate(start, end, room, jump, direction)
                    for k in range(1, self.conf["room_height"] - 2):
                        print(end[1], self.conf["room_width"] - 1, "$")
                        room[k][self.conf["room_width"] - 2] = "1"
                elif i % 2 == 1 and j == self.conf["map_width"] - 1:

                    direction = -1
                    tmp = end
                    end = start
                    start = tmp
                    start[1] += 2
                    end[0] += 1
                    end[1] -= 1

                    generate(start, end, room, jump, direction)
                    for k in range(1, end[0] + 2):
                        room[k][self.conf["room_width"] - 1] = "1"
                elif i % 2 == 1 and j == 0:
                    direction = 1
                    tmp = end
                    end = start
                    start = tmp
                    start[1] += 2
                    start[0] -= 1
                    end[1] -= 1
                    end[0] += 1
                    for k in range(1, start[0]):
                        room[k][start[1]] = "1"
                    generate(start, end, room, jump, direction)
                else:
                    direction = None
                    if i % 2 == 0:
                        direction = 1
                    else:
                        tmp = end
                        end = start
                        start = tmp
                        direction = -1
                    start[1] += 2
                    end[1] -= 2
                    generate(start, end, room, jump, direction)
                    for k in range(self.conf["room_width"] - end[1] - 1):
                        room[end[0] - 1][end[1] + k] = "1"

                # while p[1] < end[1] and p[0] < end[0] - 3:
                #     for i in range(jump):

                #         for k in range(p[1], end[1]):
                #             room[p[0] + jump][k] = "1"
                #     p[1] += 1
                #     p[0]                    print(p)
                # elif (
                #     i == self.conf["map_height"] - 1 and j == self.conf["map_width"] - 1
                # ):
                #     self.rooms[i][j].room[goal[0]][goal[1]] = "G"
                #     while (end[0] - p[0]) < (end[1] - p[1]) * 3 and p[1] < goal[1]:
                #         step = min(end[0], randint(0, 6) - 3)
                #         if step < 0:
                #             for k in range(p[0], step, -1):
                #                 for l in range(p[1] + 1, end[1]):
                #                     room[k][l] = "0"
                #         else:
                #             for k in range(p[0], step):
                #                 for l in range(p[1] + 1, end[1]):
                #                     room[k][l] = "1"
                #         p[1] += 1
                self.rooms[i][j].room = room

        return self.rooms

        # #ゴールの部屋
        # elif i == self.conf["map_height"] - 1 and j == self.conf["map_width"] - 1:

        # #右に進む部屋で、最後の部屋
        # elif i % 2 == 0 and j == self.conf["map_width"] - 1:

        # #右に進む部屋で、最初の部屋
        # elif i % 2 == 0 and j == 0:

        # #左に進む部屋で、最初の部屋
        # elif i % 2 == 1 and j == self.conf["map_width"] - 1:
        # #左に進む部屋で、最後の部屋
        # elif i %2 == 1 and j == 0:
        # #左から右または右から左に進む通常の部屋
        # else:
