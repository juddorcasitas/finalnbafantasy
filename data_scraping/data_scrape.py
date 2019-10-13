import requests
import os
import json
from time import sleep

def pull_data(player_id):
    headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'}
    player_url = "https://stats.nba.com/stats/commonplayerinfo/?PlayerID={}".format(player_id)
    player_info = requests.get(player_url ,headers=headers)
    print("Player_info Status: {}".format(player_info))
    player_info_json = player_info.json()
    seasons = player_info_json["resultSets"][2]["rowSet"] #get number of season 
    season_set = set()
    player_games = list()
    for season in seasons:
        s = season[0][1:]
        season_str = str(int(s[2:])+1)
        if len(season_str) > 2:
            season_str = season_str[1:]
        s = s + "-" + season_str
        season_set.add(s)
    print("Season Set: {}".format(season_set))
    for season in season_set:
        print("Pullin Season: {}".format(season))
        game_log_url = 'https://stats.nba.com/stats/playergamelog/?PlayerID={}&Season={}&SeasonType=Regular Season'.format(player_id,season)
        game_log = requests.get(game_log_url ,headers=headers)
        print("game_log status: {}".format(game_log))
        game_log_json = game_log.json()
        player_game_data = {}
        game_list = game_log_json["resultSets"][0]['rowSet'] 
        header_list = game_log_json["resultSets"][0]["headers"]
        print("Game_list Len: {}".format(len(game_list)))
        for games in game_list:
            player_game_data = {}
            for i in range(len(header_list)):
                player_game_data[header_list[i]] = games[i]
            player_games.append(player_game_data)
        print("Done Season: {}".format(season))
        sleep(5)
    return player_games 
nbaData = requests.get("http://data.nba.net/10s/prod/v1/2019/players.json")
print(nbaData)
nbaDataJSON = nbaData.json()
playerList = nbaDataJSON["league"]["standard"] #pull player list from
player_list_len = len(playerList)
for i in range(player_list_len):
    print("{}/{}".format(i,player_list_len))
    print("Player_ID: {}".format(playerList[i]["personId"]))
    try:
        folder_name = playerList[i]["personId"]+"_"+playerList[i]['teamSitesOnly']['playerCode']
    except:
        print("Cont Folder Name")
        continue
    try:
        print("Cont OS Make Folder Name")
        os.mkdir(folder_name)

    except:
        continue
    with open(folder_name+"/"+'player_data.json', 'w') as outfile:
        json.dump(playerList[i], outfile)
    player_game_data = pull_data(playerList[i]["personId"])
    with open(folder_name+"/"+'game_data.json', 'w') as outfile:
        json.dump(player_game_data, outfile)
    sleep(10)