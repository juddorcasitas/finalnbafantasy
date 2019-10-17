import React, {useState, useEffect} from 'react'
import classNames from '../utils/class-css'
import SearchBar from '../search/search'
import {
    useParams
} from 'react-router-dom'
import * as d3 from "d3";

function ReturnDefault(props){
    return(<div>
        <h3>Build a graph</h3>
    </div>);
}

function BuildGraph(props)
{
  console.log("Hello from build graph") //debug
  console.log(props) //asuming I would get the player games here
// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%d/%m/%Y").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });
    
// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data

  console.log(props)
    for (var i =0; i < props.length; i++)
    {
      props[i].GAME_DATE = parseDate(props[i].GAME_DATE);
      console.log(props[i])
    }

    // Scale the range of the data
    x.domain(d3.extent(props, function(d) { return props.GAME_DATE; }));
    y.domain([0, d3.max(props, function(d) { return props.PTS; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(props));

    // Add the scatterplot
    svg.selectAll("dot")
        .data(props)
      .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(props.GAME_DATE); })
        .attr("cy", function(d) { return y(props.PTS); });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

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
        var graphData = data['query'];
        setPlayerInfo(data['query']);
        console.log(graphData);
        return BuildGraph(graphData);
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
      }, [player_route]);
    return(
      <div>
      <p>Hello From Graphs</p>
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