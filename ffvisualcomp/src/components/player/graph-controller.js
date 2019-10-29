import React, {useState, useEffect} from 'react'
import * as d3 from "d3";
import '../../assets/Graph.css'
import SingleGenericGraph from './single-generic-graph'

function ReturnDefault(props){
    return(<div>
        <h3>Build a graph</h3>
    </div>);
}




function GraphController(playerDataJson)
{
//   var playerDataList = [];
  var GraphList = [];
  var chartDiv = document.getElementById("my_dataviz");
  var graphTabs = d3.select(chartDiv).append("ul").attr("class", "nav nav-tabs")
  var graphContent = document.createElement("div")

  
  d3.select(graphContent).attr("class","tab-content")

  chartDiv.append(graphTabs)
  chartDiv.append(graphContent)

  function addGraph(data)
  {
    var tab = document.createElement("li")
    d3.select(tab).attr("class", "active").append("a").html("A").attr("class", "atab").attr("href","#a_tab").attr("data-toggle","tab")
    graphTabs.append(tab)
    var graph = document.createElement("div")
    d3.select(graph).attr("class","tab-pane").attr("id","a_tab")
    SingleGenericGraph(graph,data)
    graphContent.append(graph)

    var tab = document.createElement("li")
    d3.select(tab).attr("class", "active").append("a").html("B").attr("class", "atab").attr("href","#b_tab").attr("data-toggle","tab")
    graphTabs.append(tab)
    var graph = document.createElement("div")
    d3.select(graph).attr("class","tab-pane").attr("id","b_tab")
    SingleGenericGraph(graph,data)
    graphContent.append(graph)

  }
  
  $.ajaxSetup ({
    // Disable caching of AJAX responses
    // Used when debugging
    cache: false
});

// function addPlayerData(pData)
// {
//    playerDataList.push(pData);
// }

//   function updateGraph()
//   {
    
//   }



}

export default GraphController;