# Create your views here.
from rest_framework import permissions, views
from .serializers import PlayerSerializer
from rest_framework.response import Response
from .models import Player
from rest_framework import status


class RankingCreateAPIView(views.APIView):
    queryset = Player.objects.all()
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PlayerSerializer(data=request.data)
        if serializer.is_valid():
            saved_player = serializer.save()
            all_players = Player.objects.all().order_by("time")
            player_rank = all_players.filter(time__lt=saved_player.time).count() + 1
            players = list(all_players[:20])
            # return Response(
            #     PlayerSerializer(players, many=True).data,
            #     status=status.HTTP_201_CREATED,
            # )
            ranking = PlayerSerializer(players, many=True).data
            print(player_rank)
            return Response(
                {"ranking": ranking, "player_rank": player_rank},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def post(self, request):
    #     serializer = PlayerSerializer(data=request.data)
    #     if serializer.is_valid():
    #         saved_player = serializer.save()
    #         players = Player.objects.all().order_by("time")[:100]
    #         ranking = PlayerSerializer(players, many=True).data
    #         player_rank = players.filter(time__lt=saved_player.time).count() + 1

    #         return Response({"ranking": ranking, "player_rank": player_rank})
    #     return Response(serializer.errors)
