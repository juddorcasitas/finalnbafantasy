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
  var graphTabs = document.createElement("div")
  var graphContent = document.createElement("div")
  var tabList = []
  d3.select(graphTabs).append("ul").attr("class", "nav nav-tabs").attr("id", "graph-controller-bar")
  d3.select(graphContent).attr("class","tab-content")

  chartDiv.append(graphTabs)
  chartDiv.append(graphContent)

  var d2 = Object.assign({}, playerDataJson);
  var AddButton = document.createElement("li")
    d3.select(AddButton)
    .attr("class", "add")
    .append("a")
    .html("+")
    .attr("class", "addTab")
    .attr("data-toggle","tab")
    .on("click",addGraph(d2))

    graphTabs.append(AddButton)
    tabList.push(AddButton)
  function addGraph(data)
  {
    var liID = GraphList.length + 1

    var tab = document.createElement("li")
    d3.select(tab)
    .attr("role", "tab")
    .append("a")
    .attr("aria-selected","true")
    .html(liID.toString())
    .attr("class", "atab")
    .attr("href","#"+liID.toString()+"_tab")
    .attr("data-toggle","tab");

    graphTabs.append(tab)
    if (tabList.length > 1)
    {
      tabList.forEach(
        function(d){
          console.log("PRINT TABS")
          console.log(d)
          d3.select(d)
          .attr("aria-selected","false")
        }
      )
    }
    tabList.push(tab)
    var graph = document.createElement("div")
    d3.select(graph)
    .attr("class","tab-pane")
    .attr("role","tabpanel")
    .attr("id",liID.toString()+"_tab");


    var g = SingleGenericGraph(graph,data)
    graphContent.append(graph)
    GraphList.push(g)

    
  }
  
  addGraph(playerDataJson)

// function addPlayerData(pData)
// {
//    playerDataList.push(pData);
// }

//   function updateGraph()
//   {
    
//   }



}

export default GraphController;