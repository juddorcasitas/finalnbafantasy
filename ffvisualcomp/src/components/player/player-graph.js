import React, {useState, useEffect} from 'react'
import classNames from '../utils/class-css'
import SearchBar from '../search/search'
import {
    useParams
} from 'react-router-dom'

import GraphController from './graph-controller'

function ReturnDefault(props){
    return(<div>
        <h3>Build a graph</h3>
    </div>);
}


function PlayerDataTable(props){
    const [playerInfo, setPlayerInfo] = useState({});
    console.log(props.url);
    let player_route = props.url;
    useEffect(() => {
        fetch('http://localhost:8000/retrieve_graph_data/?player_route=' + player_route,{
        mode: 'cors',
        method: 'GET',
        headers: {
            "content-type": "application/json",
          },
    }).then(
        function(response) {
            console.log(response.body);
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          // Response is OK cont..
          return response.json();
        }
      ).then(function(data) {
        //console.log(data['query']);
        var graphData = data;
        setPlayerInfo(data['query']);
        console.log(graphData);
        return GraphController(graphData);
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
      }, [player_route]);
    return(
      <div>
      <p>Hello From Graphs</p>
      <select id="selectButton"></select>
      <div id="my_dataviz"></div>
      </div>
   );  // trying to build a graph with the infomation 
}

function GraphCanvas(props){
    let {playerURL} = useParams();

    if (playerURL){
        return (
            <div className={classNames.wrapperLarge}>
                <h1>Find Player stats</h1>
                <SearchBar></SearchBar>
                <PlayerDataTable url={playerURL}/>
            </div>);
    }
    return (
    <div className={classNames.wrapperLarge}>
        <h1>Find Player stats</h1>
        <SearchBar></SearchBar>
        <ReturnDefault/>
    </div>);
}


export default GraphCanvas;