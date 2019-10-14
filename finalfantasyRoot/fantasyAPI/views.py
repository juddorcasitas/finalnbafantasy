from django.shortcuts import render
from django.http import HttpResponse
from fantasyAPI.mongoCollections  import connections

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
    print("is Connected: {}".format(connections.isConnected())) #debug
    data = {"firstName": "Justin", "lastName": "Anderson", "temporaryDisplayName": "Anderson, Justin", "personId": "1626147", "teamId": "1610612764", "jersey": "7", "isActive": True, "pos": "F", "heightFeet": "6", "heightInches": "6", "heightMeters": "1.98", "weightPounds": "230", "weightKilograms": "104.3", "dateOfBirthUTC": "1993-11-19", "teamSitesOnly": {"playerCode": "justin_anderson", "posFull": "Forward", "displayAffiliation": "Virginia/USA", "freeAgentCode": ""}, "teams": [{"teamId": "1610612742", "seasonStart": "2015", "seasonEnd": "2016"}, {"teamId": "1610612755", "seasonStart": "2016", "seasonEnd": "2017"}, {"teamId": "1610612737", "seasonStart": "2018", "seasonEnd": "2018"}, {"teamId": "1610612764", "seasonStart": "2019", "seasonEnd": "2019"}], "draft": {"teamId": "1610612742", "pickNum": "21", "roundNum": "1", "seasonYear": "2015"}, "nbaDebutYear": "2015", "yearsPro": "4", "collegeName": "Virginia", "lastAffiliation": "Virginia/USA", "country": "USA"}
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
        print(player_data)
        connections.insert_one("player_data_db","player_data",player_data)
    return HttpResponse("Good", content_type='application/json')