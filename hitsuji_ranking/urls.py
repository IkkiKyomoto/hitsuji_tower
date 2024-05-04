from django.urls import path
from .views import RankingCreateAPIView

urlpatterns = [
    path("ranking/", RankingCreateAPIView.as_view(), name="ranking"),
]
