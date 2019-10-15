from django.shortcuts import render
from django.http import HttpResponse
from fantasyAPI.mongoCollections  import connections
from datetime import datetime
import pymongo
import json

# Create your views here.
def search(request):
    print("Hello from search") #debug
    print("") #debug
    player_name = request.GET['player_name']
    query ={ '$or' : [ {"firstName" : { "$regex": ".*{}.*".format(player_name), '$options':'i'} },{"lastName" : { "$regex": ".*{}.*".format(player_name), '$options':'i' } } ] }
    print(query) #debug
    print("is Connected: {}".format(connections.isConnected())) #debug
    #query = {}
    data = connections.find("player_data_db","player_data",query).sort([('firstName', pymongo.ASCENDING), ('lastName', pymongo.ASCENDING)])
    print(data) #debug
    print(type(data)) #debug
    found_list = []
    for i in data:
        del i['_id']
        found_list.append(i)
    print(len(found_list))
    print(found_list)
    res = {"query": found_list}
    res = HttpResponse(json.dumps(res), content_type='application/json')
    print(res)
    return res

# WIP
def retreive_player_data(request):
    print("Hello from search") #debug
    print("") #debug
    player_name = request.GET['personId']
    query ={'personId'}
    print(query) #debug
    print("is Connected: {}".format(connections.isConnected())) #debug
    #query = {}
    data = connections.find("player_data_db","player_data",query).sort([('firstName', pymongo.ASCENDING), ('lastName', pymongo.ASCENDING)])
    print(data) #debug
    print(type(data)) #debug
    found_list = []
    for i in data:
        del i['_id']
        found_list.append(i)
    print(len(found_list))
    print(found_list)
    res = {"query": found_list}
    res = HttpResponse(json.dumps(res), content_type='application/json')
    print(res)
    return res

def retreive_game_data(request):
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
    filepath = '/Users/judd/VscodeProjects/finalfantasy/data_scraping/player_data_folder' #right click and use 'copyfull path' as paste here
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

    filepath = '/Users/judd/VscodeProjects/finalfantasy/data_scraping/player_data_folder' #right click and use 'copyfull path' as paste here
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
