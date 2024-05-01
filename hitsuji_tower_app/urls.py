from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views

# urls.py
urlpatterns = [
    path("example/", views.example_view, name="example"),
    # Add more paths here
] + staticfiles_urlpatterns()
