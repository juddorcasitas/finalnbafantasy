import requests
import os
import shutil
from time import sleep

image_url = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/{}.png"

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

        r = requests.get(image_url.format(playerList[i]["personId"]), stream=True)
        with open(folder_name+"/"+'{}.png'.format(playerList[i]["personId"]), 'wb') as out_file:
            shutil.copyfileobj(r.raw, out_file)
        del r
    except:
        continue
    sleep(1)