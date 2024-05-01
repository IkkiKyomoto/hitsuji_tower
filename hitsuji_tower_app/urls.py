from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from . import views

# urls.py
urlpatterns = [
    path("", views.index_template, name="index_template"),
    # Add more paths here
]
