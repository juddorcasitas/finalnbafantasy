var NBAteams = function (){
this.teamDict = {
    'ATL': "1610612737",
    'BKN': "1610612751",
    'BOS': "1610612738",
    'CHA': "1610612766",
    'CHI': "1610612741",
    'CLE': "1610612739",
    'DAL': "1610612742",
    'DEN': "1610612743",
    'DET': "1610612765",
    'GSW': "1610612744",
    'HOU': '1610612745',
    'IND': '1610612754',
    'LAC': '1610612746',
    'LAL': '1610612747',
    'MEM': '1610612763',
    'MIA': '1610612748',
    'MIL': '1610612749',
    'MIN': '1610612750',
    'NOP': '1610612740',
    'NYK': '1610612752',
    'OKC': '1610612760',
    'ORL': '1610612753',
    'PHI': '1610612755',
    'PHX': '1610612756',
    'POR': '1610612757',
    'SAC': '1610612758',
    'SAS': '1610612759',
    'TOR': '1610612761',
    'UTA': '1610612762',
    'WAS': '1610612764'
    }
};

NBAteams.prototype.teamAbr = function(teamNumber){
    return Object.keys(this.teamDict).find(key => this.teamDict[key] === teamNumber);
}

NBAteams.prototype.logoLink = function(teamNumber){
    return "http://127.0.0.1:8000/media/team_logos/"+ this.teamAbr(teamNumber) +".svg";
}

export default (new NBAteams());

