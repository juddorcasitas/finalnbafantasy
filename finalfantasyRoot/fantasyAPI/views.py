from django.shortcuts import render
from django.http import HttpResponse
from fantasyAPI.mongoCollections  import connections
from datetime import datetime
import pymongo
import json

# Create your views here.
def welcome(request):
    print("Hello OPEN API")
    return HttpResponse("API is Up", content_type='text/html')

def player_search(request):
    print("Hello from search") #debug
    player_name = request.GET['player_name'].split()
    print(player_name)
    if(len(player_name) > 1):
        query = { '$and' : [ {"firstName" : 
                                { "$regex": ".*{}.*".format(player_name[0]), 
                                '$options':'i'
                                } 
                            },   {"lastName" : 
                                    { "$regex": ".*{}.*".format(player_name[1]),
                                    '$options':'i' 
                                    } 
                                }
                            ]}
    else:
        query = { '$or' : [ {"firstName" : 
                                { "$regex": ".*{}.*".format(player_name[0]), 
                                '$options':'i'
                                } 
                            },   {"lastName" : 
                                    { "$regex": ".*{}.*".format(player_name[0]),
                                    '$options':'i' 
                                    } 
                                }
                            ]}
    applyFilter = {
                "_id": 0, 
                "firstName": 1, 
                "lastName": 1, 
                "personId": 1, 
                "teamId": 1,
                "teamSitesOnly.playerCode": 1}
    
    print(query) #debug
    print("is Connected: {}".format(connections.isConnected())) #debug
    #query = {}
    found_list = []
    try:
        data = connections.find("player_data_db","player_data",query, applyFilter)\
            .sort([('firstName', pymongo.ASCENDING), ('lastName', pymongo.ASCENDING)])
        print(data) #debug
        for i in data:
            i["headshotURL"] = "http://127.0.0.1:8000/media/player_headshots/{}.png".format(i['personId'])
            found_list.append(i)
        print("query {} items".format(len(found_list)))
    except Exception as exc:
        print("Mongo Query failed: ")
        print(exc)

    # limit return
    lisLen = len(found_list)
    if (lisLen > 15):
        found_list = found_list[:15]

    res = {"query": found_list}
    res = HttpResponse(json.dumps(res), content_type='application/json')
    return res

# WIP
def retreive_player_info(request):
    print("Hello from search") #debug
    personId = request.GET['personId']
    # filepath = '/data_scraping/player_headshots'
    query ={
        'personId': "{}".format(personId)}
    print(query) #debug
    print("is Connected: {}".format(connections.isConnected())) #debug
    #query = {}
    applyFilter = {
                "_id": 0}
    try:
        data = connections.find("player_data_db","player_data",query, applyFilter)
    except Exception as exc:
        print("Mongo Query failed: ")
        print(exc)


    print(data) #debug
    print(type(data)) #debug
    res = {"query": "No Info"}

    def getTeamAsList(i):
        return [v for k,v in i.items()]

    if data:
        # Curate for readability
        query = data[0]
        res = {"query": {
            "Full Name": "{} {}".format(query["firstName"], query["lastName"]),
            "Current Team": query['teamId'],
            "Position": query['teamSitesOnly']['posFull'],
            "Height": "{}\'{}({}m)".format(query['heightFeet'], query['heightInches'], query['heightMeters']),
            "Weight": "{}kg({}lbs)".format(query['weightKilograms'], query['weightPounds']),
            "Date of Birth": "{}".format(query['dateOfBirthUTC']),
            "Years Pro": query['yearsPro'],
            "NBA debut": query['nbaDebutYear'],
            "College": query['collegeName'],
            "Affiliation": query['lastAffiliation'],
            "Draft": [v for k,v in query['draft'].items()],
            "Teams": [getTeamAsList(i) for i in query['teams']],
            "headshotURL": "http://127.0.0.1:8000/media/player_headshots/{}.png".format(personId),
        }}
    print(res)
    res = HttpResponse(json.dumps(res), content_type='application/json')
    return res

def retreive_graph_data(request):
    print("Hello from retreive_graph_data") #debug
    player_route = request.GET['player_route']
    collection_id = "player_"+player_route
    print("Col ID: {}".format(collection_id))
    year = 2018
    month = 8
    day = 21
    end = datetime.now()
    start = datetime(year,month,day)
    print("is Connected: {}".format(connections.isConnected())) #debug
    print(collection_id )
    query = {'GAME_DATE': {'$lt': end, '$gte': start}}
    applyFilter = { "Player_ID" : 1, "Game_ID" : 1, "GAME_DATE" : 1, "MATCHUP" :1, "WL" : 1, "MIN" : 1, "FGM" : 1, "FGA" : 1, "FG_PCT" : 1, "FG3M" : 1, "FG3A" : 1, "FG3_PCT" : 1, "FTM" : 1, "FTA" : 1, "FT_PCT" : 1, "OREB" : 1, "DREB" : 1, "REB" : 1, "AST" : 1, "STL" : 1, "BLK" : 1, "TOV" : 1, "PF" : 1, "PTS" : 1, "PLUS_MINUS" : 1}
    try:
        data = connections.find("player_game_db",collection_id,query, applyFilter).sort([('GAME_DATE', pymongo.DESCENDING)])
    except Exception as exc:
        print("Mongo Query failed: ")
        print(exc)

    if data:
        # Curate for readability
        gamelist = []
        for game in data:
            del game['_id']
            game['GAME_DATE'] = game['GAME_DATE'].strftime("%d/%m/%Y")
            gamelist.append(game)
        res = {"query": gamelist}
    print(res)
    res = HttpResponse(json.dumps(res), content_type='application/json')    
    return res
            
def load_player_data(request):
    import os
    import json
    filepath = '/home/tomi/Sandbox/ffdata/player_data_folder' #right click and use 'copyfull path' as paste here
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

    filepath = '/home/tomi/Sandbox/ffdata/player_data_folder' #right click and use 'copyfull path' as paste here
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
