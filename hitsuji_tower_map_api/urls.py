from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"map", views.MapViewSet, basename="map")

urlpatterns = [
    path("", include(router.urls)),
]
