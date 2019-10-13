from django.shortcuts import render
from django.http import HttpResponse
import fantasyAPI.mongoCollections as mongoCollections

# Create your views here.
def search(request):
    print("Hello from search") #debug
    print("") #debug
    player_name = request.GET['player_name']
    print(player_name)
    data = [{"firstName": "Justin", "lastName": "Anderson", "temporaryDisplayName": "Anderson, Justin", "personId": "1626147", "teamId": "1610612764", "jersey": "7", "isActive": True, "pos": "F", "heightFeet": "6", "heightInches": "6", "heightMeters": "1.98", "weightPounds": "230", "weightKilograms": "104.3", "dateOfBirthUTC": "1993-11-19", "teamSitesOnly": {"playerCode": "justin_anderson", "posFull": "Forward", "displayAffiliation": "Virginia/USA", "freeAgentCode": ""}, "teams": [{"teamId": "1610612742", "seasonStart": "2015", "seasonEnd": "2016"}, {"teamId": "1610612755", "seasonStart": "2016", "seasonEnd": "2017"}, {"teamId": "1610612737", "seasonStart": "2018", "seasonEnd": "2018"}, {"teamId": "1610612764", "seasonStart": "2019", "seasonEnd": "2019"}], "draft": {"teamId": "1610612742", "pickNum": "21", "roundNum": "1", "seasonYear": "2015"}, "nbaDebutYear": "2015", "yearsPro": "4", "collegeName": "Virginia", "lastAffiliation": "Virginia/USA", "country": "USA"}]
    return HttpResponse(data, content_type='application/json')
            
def retreive_data(request):
    print("Hello from search") #debug
    data = {"firstName": "Justin", "lastName": "Anderson", "temporaryDisplayName": "Anderson, Justin", "personId": "1626147", "teamId": "1610612764", "jersey": "7", "isActive": True, "pos": "F", "heightFeet": "6", "heightInches": "6", "heightMeters": "1.98", "weightPounds": "230", "weightKilograms": "104.3", "dateOfBirthUTC": "1993-11-19", "teamSitesOnly": {"playerCode": "justin_anderson", "posFull": "Forward", "displayAffiliation": "Virginia/USA", "freeAgentCode": ""}, "teams": [{"teamId": "1610612742", "seasonStart": "2015", "seasonEnd": "2016"}, {"teamId": "1610612755", "seasonStart": "2016", "seasonEnd": "2017"}, {"teamId": "1610612737", "seasonStart": "2018", "seasonEnd": "2018"}, {"teamId": "1610612764", "seasonStart": "2019", "seasonEnd": "2019"}], "draft": {"teamId": "1610612742", "pickNum": "21", "roundNum": "1", "seasonYear": "2015"}, "nbaDebutYear": "2015", "yearsPro": "4", "collegeName": "Virginia", "lastAffiliation": "Virginia/USA", "country": "USA"}
    return HttpResponse(data, content_type='application/json')
            
def load_player_data(request):
    print("Hello from search") #debug
    print("is Connected: {}".format(mongoCollections.isConnected())) #debug
    return HttpResponse("Good", content_type='application/json')