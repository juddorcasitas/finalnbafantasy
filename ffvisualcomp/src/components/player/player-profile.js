import React, {Component} from 'react'
import classNames from '../utils/class-css'
import SearchBar from '../search/search'
import {
    useParams,
    useRouteMatch
} from 'react-router-dom'

function LoadProfile(props){
    let {path, url} = useRouteMatch();
    let {playerURL} = useParams();
    console.log(path, url);
    if (playerURL){
        console.log(playerURL);
        props.onLoad(playerURL);
    }
    // let fetchPlayerInfo = function(){
    //     console.log("retrieving: " + props.personId);
    //     // localhost:8000/retrieve_data
    //     fetch('http://localhost:8000/retrieve_data')
    //     .then(response => response.json())
    //     .then(data =>{
    //         console.log("data returned: " + data);
    //         this.setState({
    //             playerInfo: data,
    //             isLoading: false,
    //         });
        
    //     })
    //     .catch(error => this.setState({error, isLoading:false}));
    // }

    // fetchPlayerInfo();
    return(<div>
    </div>)


}

class PlayerProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            playerInfo: {},
            isLoading: true,
            error: null
        }
    }

    handleSearchResultsOnClick = (e, data, func) => {
        console.log("You clicked on: " + data.personId);
    }

    updatePlayerData(data){
        console.log(data);
    }

    render(){
        return(
            <div className={classNames.wrapperLarge}>
                <h1>Find Player stats</h1>
                <SearchBar 
                resultsOnClick={
                    (e, data, func) => this
                    .handleSearchResultsOnClick(e, data, func)}>
                </SearchBar>
                <LoadProfile onLoad={data => this.updatePlayerData(data)}></LoadProfile>
            </div>
        );
    }
}

export default PlayerProfile;