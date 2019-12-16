import React, {useState, useEffect} from 'react'
import classNames from '../utils/class-css'
import * as d3 from "d3";
import '../../assets/Graph.css'

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

function BuildGraph4(props)
{
  // remove current chart

  d3.select(".svg-container").remove()
  d3.selectAll(".player-graph-option").remove()
  var allGroup = ["PTS", "AST",'REB', "BLK",'TOV', "DREB"]

  var parseDate = d3.timeParse("%d/%m/%Y"); 
 // set the dimensions and margins of the graph
 var margin = {top: 10, right: 30, bottom: 30, left: 60},
 width = 800 - margin.left - margin.right,
 height = 400 - margin.top - margin.bottom;
var chartDiv = document.getElementById("my_dataviz");

 var svg = d3.select(chartDiv)
.append("div")
// Container class to make it responsive.
.classed("svg-container", true) 
.append("svg")
.attr("viewBox", "0 0 "+ (width + margin.left + margin.right) +" " + (height+  margin.top + margin.bottom)+ "")
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // create a tooltip
  var Tooltip = d3.select("#my_dataviz")
  .append("div")
  .attr("class", "tooltip")				
  .style("opacity", 0);


  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
      Tooltip.transition()		
      .duration(200)		
      .style("opacity", .9);

      Tooltip.html(d.time + "<br/>"  + d.value)	
      .style("left", (d3.event.pageX) + "px")		
      .style("top", (d3.event.pageY - 28) + "px");

      console.log(d.value)
  }
  var mousemove = function(d) {
    Tooltip
      .html("Exact value: " + d.value)
      
  }
  var mouseleave = function(d) {
    Tooltip
    .transition()		
    .duration(500)		
    .style("opacity", 0);
  }

 var data = props.query
 data.forEach(function(d) {
  d.GAME_DATE = parseDate(d.GAME_DATE);
})


  var xScale = d3.scaleTime()
  var yScale = d3.scaleLinear()

  var xAxisCall = d3.axisBottom()
  var yAxisCall = d3.axisLeft()


  var line = svg.append("path")
  var dot = svg.append("g")

  
  function initAxis() {
    svg.append("g")
    .attr("class", "x axis")
    .attr("id", "xaxis")  
    .attr("transform", "translate(0," + height + ")")
    .call(xAxisCall.scale(xScale));

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxisCall.scale(yScale));
}


    
function updateAxis(){
  var t = d3.transition()
      .duration(500)
  
  svg.select(".x")
      .transition(t)
      .call(xAxisCall)
  
  svg.select(".y")
      .transition(t)
      .call(yAxisCall)
  
}

function initPlot(data){
  line = svg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("id", "gpath")
  .attr("d", d3.line()
  .x(function(d) { return xScale(d.time) })
  .y(function(d) { return yScale(d.value) })
  )

  // Add the point
  dot = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.time) } )
    .attr("cy", function(d) { return yScale(d.value) } )
    .attr("r", 5)
    .attr("fill", "#000000")        
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
}

function updatePlot(data){
  var tpoints = d3.transition()
  .duration(500)

  line
  .datum(data)
  .transition(tpoints)
  .attr("d", d3.line()
    .x(function(d) { return xScale(+d.time) })
    .y(function(d) { return yScale(+d.value) })
  )
  
  dot
  .data(data)
  .transition(tpoints)
  .attr("cx", function(d) { return xScale(+d.time) })
  .attr("cy", function(d) { return yScale(+d.value) })
}

function plotPoint(data)
{
  xScale
  .domain(d3.extent(data, function(d) { return d.time; }))
  .range([ 0, width ]);


  yScale
  .domain(d3.extent(data, function(d) { return d.value; }))
  .range([ height, 0 ]);

  initPlot(data)
  initAxis()

}


function updatePointsAncScale(data, duration)
{

  var tscale = d3.transition()
  .duration(1000)

  xScale
  .domain(d3.extent(data, function(d) { return d.time; }))
  .range([ 0, width ]);


  yScale
  .domain(d3.extent(data, function(d) { return d.value; }))
  .range([ height, 0 ]);
  
  svg.select(".x")
  .attr("transform", "translate(0," + height + ")")
  .transition(tscale)
  .call(yAxisCall.scale(xScale))

  svg.select(".y")
  .transition(tscale)
  .call(yAxisCall.scale(yScale))
    // Give these new data to update line
  
  updatePlot(data)

  updateAxis()
  

}

  var df = data.map(function(d){return {time: d.GAME_DATE, value:d.PTS} })

  plotPoint(df)
   
  // add the options to the button
  d3.select("#selectButton")
  .selectAll('myOptions')
  .data(allGroup)
  .enter()
  .append('option')
  .classed("player-graph-option", true) 
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button


  // A function that update the chart
  function update(selectedGroup) {

  // Create new data with the selection?
  var dataFilter = data.map(function(d){return {time: d.GAME_DATE, value:d[selectedGroup]} })
  //console.log(dataFilter);
    
    updatePointsAncScale(dataFilter,1000)

  }

    // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        return update(selectedOption);
    })

}

function DisplayGraph(props){
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
        console.log({"player Data": graphData});
        return BuildGraph4(graphData);
      })
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
      }, [player_route]);
    return(
      <div>
      <select id="selectButton"></select>
      <div id="my_dataviz"></div>
      </div>
   );  // trying to build a graph with the infomation 
}

function GraphCanvas(props){
    return (
      <div className={classNames.wrapperLarge}>
        <DisplayGraph url={props.url}/>
      </div>);
}

export default GraphCanvas;