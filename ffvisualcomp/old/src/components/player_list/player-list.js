import React, {useState, useEffect} from 'react'
import NBAteams from '../utils/NBAteams'
import PlayerDataTable from '../player/player-card'

function DisplayPlayerList(playerList){
    return(
        <div>        
        </div>
    );
}

function GenerateList(props){
    const [playerList, setPlayerList] = useState({});

    let fetchPlayerInfo = ((personId) => useEffect((personId) => {
        fetch('http://localhost:8000/retrieve_player_info/?personId=' + personId,{
        mode: 'cors',
        method: 'GET',
        headers: {
            "content-type": "application/json",
          },
    }).then(
        function(response) {
            // console.log(response.body.json());
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          // Response is OK cont..
          return response.json();
        }
      ).then(function(data) {
        // console.log(data);
        setPlayerInfo(data['query']);
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
      }, [personId]));
}
