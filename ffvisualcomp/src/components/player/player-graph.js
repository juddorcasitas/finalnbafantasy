import React, {useState, useEffect} from 'react'
import classNames from '../utils/class-css'
import SearchBar from '../search/search'
import {
    useParams
} from 'react-router-dom'
import * as d3 from "d3";
import '../../assets/Graph.css'
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


function BuildGraph4(props)
{
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

function initPlot(data)
{
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

function updatePlot(data)
{
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



function BuildGraph3(props)
{
  var allGroup = ["PTS", "AST", "BLK","DREB",'WL','TOV','REB']

  var parseDate = d3.timeParse("%d/%m/%Y"); 
 // set the dimensions and margins of the graph
 var margin = {top: 10, right: 30, bottom: 30, left: 60},
 width = 800 - margin.left - margin.right,
 height = 400 - margin.top - margin.bottom;
 // append the svg object to the body of the page

 var chartDiv = document.getElementById("my_dataviz");

 var svg = d3.select(chartDiv)
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

 var data = props.query
 data.forEach(function(d) {
  d.GAME_DATE = parseDate(d.GAME_DATE);
})

  var x = d3.scaleTime()
  .domain(d3.extent(data, function(d) { return d.GAME_DATE; }))
  .range([ 0, width ]);
  var y = d3.scaleLinear()
  .domain(d3.extent(data, function(d) { return d.PTS; }))
  .range([ height, 0 ]);

  var xScale = d3.scaleLinear()
  var yScale = d3.scaleLinear()

  var xAxisCall = d3.axisBottom()
  var yAxisCall = d3.axisLeft()

  svg.append("g")
  .attr("class", "x axis")  
  .attr("transform", "translate(0," + height + ")")
  .call(xAxisCall.scale(x));

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxisCall.scale(y));
      
  var line = svg.append("path")
  .datum(data)
  .attr("class", "gLine")
  .attr("fill", "none")
  .attr("stroke", "#69b3a2")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { return x(d.GAME_DATE) })
    .y(function(d) { return y(d.PTS) })
    )

       // Three function that change the tooltip when user hover / move / leave a cell
       var mouseover = function(d) {
        Tooltip
          .style("opacity", 1)
          console.log(d.value)
      }
      var mousemove = function(d) {
        Tooltip
          .html("Exact value: " + d.PTS)
          .style("left", d3.select(this).attr("cx") + "px")     
          .style("top", d3.select(this).attr("cy") + "px");
      }
      var mouseleave = function(d) {
        Tooltip
          .style("opacity", 0)
      }
    
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
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


        // add the options to the button
        d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) { return d; }) // text showed in the menu
        .attr("value", function (d) { return d; }) // corresponding value returned by the button


  // A function that update the chart
  function update(selectedGroup) {

  // Create new data with the selection?
  var dataFilter = data.map(function(d){return {time: d.GAME_DATE, value:d[selectedGroup]} })
  //console.log(dataFilter);
    

      var x = d3.scaleTime()
      .domain(d3.extent(dataFilter, function(d) { return d.time; }))
      .range([ 0, width ]);
      var y = d3.scaleLinear()
      .domain(d3.extent(dataFilter, function(d) { return d.value; }))
      .range([ height, 0 ]);
      var t = d3.transition()
      .duration(500)
  
      svg.select(".x")
          .transition(t)
          .call(yAxisCall.scale(x))
      
      svg.select(".y")
          .transition(t)
          .call(yAxisCall.scale(y))
      
        
        // Give these new data to update line
        line
            .datum(dataFilter)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
              .x(function(d) { return x(+d.time) })
              .y(function(d) { return y(+d.value) })
            )
        dot
          .data(dataFilter)
          .transition()
          .duration(1000)
            .attr("cx", function(d) { return x(+d.time) })
            .attr("cy", function(d) { return y(+d.value) })

          var x = svg.selectAll(".x")
          .data(dataFilter)
            
        var newX = x.enter().select("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            
        x.merge(newX).transition(t).call(xAxisCall)

        var y = svg.selectAll(".y")
            .data(dataFilter)
            
        var newY = y.enter().select("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,0)")

        y.merge(newY).transition(t).call(yAxisCall)

}

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        return update(selectedOption);
    })
    // create a tooltip
    var Tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
        
 


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
        return BuildGraph5(graphData);
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

function BuildGraph5(props)
{
  var allGroup = ["PTS", "AST",'REB', "BLK",'TOV', "DREB"]

  var allGroup = ["valueA", "valueB", "valueC"]

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


  var mapDataToGroup = function(DataMap) {
    var readyData = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: data.map(function(d) {
          return {time: d.time, value: +d[grpName]};
        })
      };
    });
  }

  var changeTheOpacity = function(d){
    // is the element currently visible ?
    currentOpacity = d3.selectAll("." + d.name).style("opacity")
    // Change the opacity: from 0 to 1 or from 1 to 0
    d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)
  }

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

function initPlot(data)
{
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

function updatePlot(data)
{
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


function GraphController(playerDataJson)
{
  var playerDataList = [];
  var GraphList = [];
  var chartDiv = document.getElementById("my_dataviz");

  function addPlayerData(pData)
  {
    playerDataList.push(pData);
  }

  function updateGraph()
  {
    
  }

}

export default GraphCanvas;