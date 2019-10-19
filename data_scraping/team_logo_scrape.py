import requests
import os
import shutil
from time import sleep

image_url = "https://stats.nba.com/media/img/teams/logos/{}_logo.svg"

team_list = [
'ATL','BKN','BOS','CHA','CHI',
'CLE','DAL','DEN','DET','GSW',
'HOU','IND','LAC','LAL','MEM',
'MIA','MIL','MIN','NOP','NYK',
'OKC','ORL','PHI','PHX','POR',
'SAC','SAS','TOR','UTA','WAS'
]

for i in range(len(team_list)):
    try:
        folder_name = 'team_logos' #playerList[i]["personId"]+"_"+playerList[i]['teamSitesOnly']['playerCode']

        r = requests.get(image_url.format(team_list[i]), stream=True)
        with open(folder_name+"/"+'{}.svg'.format(team_list[i]), 'wb') as out_file:
            shutil.copyfileobj(r.raw, out_file)
        del r
    except:
        continue