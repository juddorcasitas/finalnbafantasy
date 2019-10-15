from django.shortcuts import render
from django.http import HttpResponse
from fantasyAPI.mongoCollections  import connections
from datetime import datetime

# Create your views here.
def search(request):
    print("Hello from search") #debug
    print("") #debug
    player_name = request.GET['player_name']
    query ={ '$or' : [ {"firstName" : { "$regex": "^{}".format(player_name) } },{"lastName" : { "$regex": "^{}".format(player_name) } } ] }
    print(query) #debug
    print("is Connected: {}".format(connections.isConnected())) #debug
    #query = {}
    data = connections.find("player_data_db","player_data",query)
    print(data) #debug
    print(type(data)) #debug
    found_list = []
    for i in data:
        found_list.append(i)
    return HttpResponse(found_list, content_type='application/json')
            
def retreive_data(request):
    print("Hello from retreive_data") #debug
    person_id = request.GET['personId']
    player_code = request.GET['playerCode']
    day = int(request.GET['day'])
    month = int(request.GET['month'])
    year = int(request.GET['year'])
    collection_id = "player_"+person_id+"_"+player_code
    end = datetime.now()
    start = datetime(year,month,day)
    print("is Connected: {}".format(connections.isConnected())) #debug
    print(collection_id )
    query = {'GAME_DATE': {'$lt': end, '$gte': start}}
    data = connections.find("player_game_db",collection_id,query)
    return HttpResponse(data, content_type='application/json')
            
def load_player_data(request):
    import os
    import json
    filepath = '/home/tomi/Sandbox/ffBackend/finalfantasy/data/player_data_folder' #right click and use 'copyfull path' as paste here
    print("Hello from load_player_data") #debug
    print("is Connected: {}".format(connections.isConnected())) #debug
    filename = "player_data.json"
    for player_folder in os.listdir(filepath):
        p_data_file = open("{}/{}/{}".format(filepath,player_folder,filename), 'r')
        player_data = json.load(p_data_file)
        print(player_data) #debug
        connections.insert_one("player_data_db","player_data",player_data)
    return HttpResponse("Good", content_type='application/json')

def import_player_gamesDB(request):
    import os
    import json

    filepath = '/home/tomi/Sandbox/ffBackend/finalfantasy/data/player_data_folder' #right click and use 'copyfull path' as paste here
    print("Hello from import_player_gamesDB") #debug
    print("is Connected: {}".format(connections.isConnected())) #debug
    filename = "game_data.json"
    for player_folder in os.listdir(filepath):
        p_game_data_file = open("{}/{}/{}".format(filepath,player_folder,filename), 'r')
        player_games = json.load(p_game_data_file)
        print(player_games) #debug
        print(type(player_games))
        for game in player_games:
            game['GAME_DATE'] = datetime.strptime(game["GAME_DATE"], '%b %d, %Y')
            psl = len(player_folder)
            if player_folder[psl-1] == '.':
                player_folder = player_folder[0:psl-1]
            connections.insert_one("player_game_db","player_"+player_folder,game)
    return HttpResponse("Good", content_type='application/json')
