import React, {useState, useEffect} from 'react'
import NBAteams from '../utils/NBAteams'

function PlayerDataTable(props){
    const [playerInfo, setPlayerInfo] = useState({});
    console.log(props.url);
    let personId = props.url.split('_')[0];
    useEffect(() => {
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
      }, [personId]);
    
    return(
        <div>
        <div>
            {Object.keys(playerInfo).filter(key => key.toString() === "headshotURL")
                .map((key, index) => <img height="190" width="260" key={playerInfo["headshotURL"]} src={playerInfo["headshotURL"]} alt="Player"
                onError={(e)=>{e.target.onerror = null; e.target.src="http://localhost:8000/media/player_headshots/default.png"}}></img>
                )}
        </div>
       <table>
           <tbody>
           {Object.keys(playerInfo).filter(key => key.toString() !== "Draft" 
                            && key.toString() !== "Teams" 
                            && key.toString() !== "Current Team"
                            && key.toString() !== "headshotURL")
                            .map((key, index) =>
                            <tr key={index}>
                                <th>
                                    {key.toString()}
                                </th>
                                <td>
                                    {playerInfo[key]}
                                </td>
                            </tr>
                        )}
            </tbody>
        </table>
        <table>
            <tbody>
                <tr>
                    <th>Drafted</th>
                    <th>Pick #</th>
                    <th>Round #</th>
                    <th>Year</th>
                </tr>
                {Object.keys(playerInfo).filter(key => key.toString() === "Draft")
                    .map((key,index) => 
                    <tr key={index}>
                        <td>
                            {NBAteams.teamAbr(playerInfo[key][0])}
                            <img height="40" width="40" src={NBAteams.logoLink(playerInfo[key][0])} alt={NBAteams.teamAbr(playerInfo[key][0])}></img>
                        </td>
                        <td>
                            {playerInfo[key][1]}
                        </td>
                        <td>
                        {playerInfo[key][2]}
                        </td>
                        <td>
                        {playerInfo[key][3]}
                        </td>
                    </tr>
                    )}
            </tbody>
        </table>
        <table>
            <tbody>
                <tr>
                    <th>Team History</th>
                    <th>From</th>
                    <th>To</th>
                </tr>
                </tbody>
                {Object.keys(playerInfo).filter(key => key.toString() === "Teams")
                    .map((key,index) =>
                    <tbody key={index}>
                        {playerInfo[key].map((x, i) => 
                        <tr key={i}>
                            <td>
                                {NBAteams.teamAbr(x[0])}
                                <img height="40" width="40" src={NBAteams.logoLink(x[0])} alt={NBAteams.teamAbr(x[0])}></img>
                            </td>
                            <td>
                                {x[1]}
                            </td>
                            <td>
                                {x[2]}
                            </td>
                        </tr> )}
                    </tbody>
                    )}
        </table>
        </div>
   );
}

export default PlayerDataTable;