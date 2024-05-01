from django.shortcuts import render


# Create your views here.
def index_template(request):
    return render(request, "hitsuji_tower_app/index.html")
