from django.urls import path
from . import views

# urls.py
urlpatterns = [
    path("example/", views.example_view, name="example"),
    # Add more paths here
]
