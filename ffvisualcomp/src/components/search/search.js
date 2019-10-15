import React, {Component} from "react"
import classNames from '../utils/class-css'
import {
    Link,
    Route,
    useRouteMatch
} from 'react-router-dom'
import _ from 'lodash'

// const playerAPI = 'https://';

function SearchResult(props){
    let {path, url} = useRouteMatch();
    return(
    <div 
    className={classNames.searchPlayerRow}
    onClick={props.onClick}>
        <Link to={`${url}/${props.playerId}`}>
            <p>
                <span>{props.firstname}</span>
                <span>{props.lastname}</span>
                <span>{props.team}</span>
            </p>
        </Link>
        <Route path={`${path}/:playerId`}/>
    </div>)
}

class SearchBar extends Component {

    constructor(props){
        super(props);
        this.state = {
            value: '',
            results: {},
        }
        this.getSearchquery = _.debounce(this.getSearchquery, 500);
    }

    handleChange = (e) => {
        let input = e.target.value;
        this.setState({value: input});
        this.getSearchquery(input);
    }


    getSearchquery = (input) =>{
        if (input === ""){
            this.setState({results: {}});
            return;
        }
        console.log("Search Query: " + input);
        // this.setState({results: {player1: {firstname: "fname1", lastname: "lname1", team: "team1", playerId: "p1Id"},
        // player2:{firstname: "fname2", lastname: "lname2", team: "team2", playerId: "p2Id"},
        // player3:{firstname: "fname3", lastname: "lname3", team: "team3", playerId: "p3Id"},
        // player4:{firstname: "fname4", lastname: "lname4", team: "team4", playerId: "p4Id"},
        // player5:{firstname: "fname5", lastname: "lname5", team: "team5", playerId: "p5Id"},
        // player6:{firstname: "fname6", lastname: "lname6", team: "team6", playerId: "p6Id"}    
        // }});

        let fetchPlayerInfo = function(){
            console.log("retrieving: " + this.props.playerId);
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

    render () {
        return (
            <div className={classNames.wrapperLarge}>
                <div className={classNames.search}>
                    <input 
                        type="text" 
                        className="searchTerm" 
                        placeholder="Search Current Players"
                        // defaultValue={this.state.value}
                        value={this.state.value}
                        onChange={(e) => this.handleChange(e)}
                        ref={ (input) => this.userInput = input}
                        ></input>

                    <div className={classNames.wrapperModal}>
                        {Object.keys(this.state.results).map((key, index) => 
                        <SearchResult
                            key = {index}
                            playerId = {this.state.results[key].playerId}
                            firstname = {this.state.results[key].firstname}
                            lastname = {this.state.results[key].lastname}
                            team = {this.state.results[key].team}
                            onClick = {(e) => this.props
                                .resultsOnClick(
                                    e, 
                                    this.state.results[key],
                                    this.setState({value: '', results: {}}))}
                        />)}
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchBar;
