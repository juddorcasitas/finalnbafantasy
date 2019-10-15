import React, {Component} from 'react'
import classNames from '../utils/class-css'
import SearchBar from '../search/search'
import {
    useRouteMatch
} from 'react-router-dom'

function LoadProfile(props){
    let {url, path} = useRouteMatch();
    let fetchPlayerInfo = function(){
        console.log("retrieving: " + this.props.personId);
        // localhost:8000/retrieve_data
        fetch('http://localhost:8000/retrieve_data')
        .then(response => response.json())
        .then(data =>{
            console.log("data returned: " + data);
            this.setState({
                playerInfo: data,
                isLoading: false,
            });
        
        })
        .catch(error => this.setState({error, isLoading:false}));
    }
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

    render(){
        return(
            <div className={classNames.wrapperLarge}>
                <h1>Find Player stats</h1>
                <SearchBar 
                resultsOnClick={
                    (e, data, func) => this
                    .handleSearchResultsOnClick(e, data, func)}>
                </SearchBar>
                <LoadProfile></LoadProfile>
            </div>
        );
    }
}

export default PlayerProfile;