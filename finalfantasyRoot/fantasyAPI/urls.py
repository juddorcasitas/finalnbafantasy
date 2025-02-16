"""finalfantasyRoot URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import welcome, player_search, load_player_data, import_player_gamesDB, retreive_player_info, retreive_graph_data

urlpatterns = [
    path('', welcome),
    path('player_search/', player_search),
    path('retrieve_player_info/', retreive_player_info),
    path('retrieve_graph_data/', retreive_graph_data),
    path('load_player_data',load_player_data), #disable or remove for production
    path('load_player_gameDB',import_player_gamesDB)
] 
