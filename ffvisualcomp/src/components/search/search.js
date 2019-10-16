import React, {Component} from "react"
import classNames from '../utils/class-css'
import {
    Link,
    useRouteMatch
} from 'react-router-dom'
import _ from 'lodash'

// const playerAPI = 'https://';

function SearchResult(props){
    let playerURL = props.personId + "_"+props.playercode ;
    return(
    <div 
    className={classNames.searchPlayerRow}
    onClick={props.onClick}>
            <Link to={`/player-profile/${playerURL}`}>
                <p>
                    <span>{props.firstname}</span>
                    <span>{props.lastname}</span>
                    <span>{props.team}</span>
                </p>
            </Link>
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
        var obj = this;
        if (input === ""){
            obj.setState({results: {}});
            return;
        }
        console.log("Search Query: " + input);

        function setState(data){
            console.log(data.query);
            obj.setState({results: data.query});
        }
        
        console.log("retrieving: " + input);
        // localhost:8000/retrieve_data
        fetch('http://127.0.0.1:8000/player_search/?player_name=' + input, {
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
              // Examine the text in the response
              return response.json();
            }
          ).then(function(data) {
            console.log(data);
            setState(data);
          })
          .catch(function(err) {
            console.log('Fetch Error :-S', err);
          });

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
                            personId = {this.state.results[key].personId}
                            firstname = {this.state.results[key].firstName}
                            lastname = {this.state.results[key].lastName}
                            team = {this.state.results[key].teamId}
                            playercode ={this.state.results[key].teamSitesOnly.playerCode}
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
