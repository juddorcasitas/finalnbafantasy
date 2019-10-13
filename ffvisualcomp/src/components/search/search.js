import React, {Component} from "react"
import _ from 'lodash'

// const playerAPI = 'https://';

class SearchResults extends Component{

    render(){
        return this.props.results.map(r => <div>{r}</div>);
    }

}

class SearchBar extends Component {

    constructor(props){
        super(props);
        this.state = {
            value: '',
            results: [],
        }
        this.getSearchquery = _.debounce(this.getSearchquery, 500);
    }

    handleChange = (e) => {
        let input = e.target.value;
        this.setState({value: input});
        this.getSearchquery(input);
    }
    getSearchquery = (input) =>{
        console.log(input);
        this.setState({results: [1,2,3,4,5,6]});

    }

    render () {
        return (
            <div className="wrap">
                <div className="search">
                    <input 
                        type="text" 
                        className="searchTerm" 
                        placeholder="Search Current Players"
                        defaultValue={this.state.value}
                        onChange={(e) => this.handleChange(e)}
                        ref={ (input) => this.userInput = input}
                        ></input>
                    <SearchResults 
                        results = {this.state.results}
                    />
                </div>
            </div>
        );
    }
}

export default SearchBar;
