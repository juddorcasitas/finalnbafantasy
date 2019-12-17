import React from 'react'
import classNames from '../utils/class-css'
import SearchBar from '../search/search'
import GraphCanvas from './player-graph'
import PlayerDataTable from './player-card'
import {
    useParams
} from 'react-router-dom'


function ReturnDefault(props){
    return(<div>
        <h1>Find Player stats</h1>
    </div>);
}

function PlayerProfile(props){
    let {playerURL} = useParams();

    if (playerURL){
        return (
            <div className={classNames.wrapperLarge}>
                <h3>Search for a player</h3>
                <SearchBar></SearchBar>
                <PlayerDataTable url={playerURL}/>
                <GraphCanvas url={playerURL}></GraphCanvas>
            </div>);
    }
    
    return(
        <div>
        <ReturnDefault></ReturnDefault>
        <SearchBar></SearchBar>
        </div>
        
    );
}

export default PlayerProfile;