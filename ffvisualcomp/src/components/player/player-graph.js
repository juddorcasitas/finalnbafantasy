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

function addStyle(styles) { 
              
  /* Create style element */ 
  var css = document.createElement('style'); 
  css.type = 'text/css'; 

  if (css.styleSheet)  
      css.styleSheet.cssText = styles; 
  else  
      css.appendChild(document.createTextNode(styles)); 
    
  /* Append style to the head element */ 
  document.getElementsByTagName("head")[0].appendChild(css); 
} 


function BuildGraph(props)
{

      // List of groups (here I have one group per column)
  var allGroup = ["PTS", "AST", "BLK","DREB",'WL','TOV','REB']

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
  // set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
width = 8000 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

      // Parse the date / time
var parseDate = d3.timeParse("%d/%m/%Y"); // this isnt working ???


var data = props.query
data.forEach(function(d) {
  d.GAME_DATE = parseDate(d.GAME_DATE);
})
  // Now I can use this dataset:
  

  var x = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.GAME_DATE; }))
  .range([ 0, width ]);
  var y = d3.scaleLinear()
  .domain(d3.extent(data, function(d) { return d.PTS; }))
  .range([ height, 0 ]);
  
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    svg.append("g")
    .call(d3.axisLeft(y));
    // Add the line     
    var line = svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.GAME_DATE) })
        .y(function(d) { return y(d.PTS) })
        )
    // Add the points
    var dot = svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.GAME_DATE) } )
        .attr("cy", function(d) { return y(d.PTS) } )
        .attr("r", 5)
        .attr("fill", "#000000")

         // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.map(function(d){return {time: d.GAME_DATE, value:d[selectedGroup]} })
      //console.log(dataFilter);

      var y = d3.scaleLinear()
      .domain(d3.extent(dataFilter, function(d) { return d.value; }))
      .range([ height, 0 ]);

      var t = d3.transition()
      .duration(500)

         
        svg.select(".y")
            .transition(t)
            .call(d3.axisLeft(y))
      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.time) })
            .y(function(d) { return y(d.value) })
          )
      dot
        .data(dataFilter)
        .transition()
        .duration(1000)
          .attr("cx", function(d) { return x(d.time) })
          .attr("cy", function(d) { return y(d.value) })

          var y2 = svg.selectAll(".y")
          .data(dataFilter.value)
          
      var newY = y2.enter().append("g")
          .attr("class", "y axis")
          .attr("transform", "translate("+[margin.left, margin.top]+")")

          y2.merge(newY).transition(t).call(y)

    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        return update(selectedOption);
    })
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
        return BuildGraph(graphData);
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