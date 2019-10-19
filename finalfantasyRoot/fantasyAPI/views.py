from django.shortcuts import render
from django.http import HttpResponse
from fantasyAPI.mongoCollections  import connections
from datetime import datetime
import pymongo
import json

# Create your views here.
def player_search(request):
    print("Hello from search") #debug
    player_name = request.GET['player_name']
    query = { '$or' : [ {"firstName" : 
                            { "$regex": ".*{}.*".format(player_name), 
                            '$options':'i'
                            } 
                        },   {"lastName" : 
                                { "$regex": ".*{}.*".format(player_name),
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
            "Teams": [getTeamAsList(i) for i in query['teams']]
        }}
    print(res)
    res = HttpResponse(json.dumps(res), content_type='application/json')
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
