import React, {useState, useEffect} from 'react'
import * as d3 from "d3";
import '../../assets/Graph.css'
import SingleGenericGraph from './single-generic-graph'
import $ from "jquery";


function ReturnDefault(props){
    return(<div>
        <h3>Build a graph</h3>
    </div>);
}

function changeTabs()
{
   var $tabs = $('.tabs');
   var $panels = $('.panels');

   $tabs.on('click', 'a', function(e){
    e.preventDefault();

    var id = $(this).attr('href');

    $panels.filter('[aria-hidden="false"]').attr('aria-hidden', true);
    $tabs.find('[aria-selected="true"]').attr('aria-selected', false);

    $(this).attr('aria-selected', true);
    $(id).attr('aria-hidden', false);
   })
}



function GraphController(playerDataJson)
{
//   var playerDataList = [];
  var GraphList = [];
  var chartDiv = document.getElementById("my_dataviz");
  var graphTabs = document.createElement("div")
  var graphContent = document.createElement("div")
  var tabList = []
  var grabTabList = []
  d3.select(graphTabs).attr("class","tab-group").append("ul").attr("role","tablist").attr("class", "tabs clearfix").attr("id", "graph-controller-bar")
  d3.select(graphContent).attr("class","tab-content")

  chartDiv.append(graphTabs)
  chartDiv.append(graphContent)

  var d2 = Object.assign({}, playerDataJson);

  //WIP FOR ADD TAB BUTTON
  // var AddButton = document.createElement("li")
  //   d3.select(AddButton)
  //   .attr("class", "add")
  //   .append("a")
  //   .html("+")
  //   .attr("class", "addTab")
  //   .attr("data-toggle","tab")
  //   .on("click",addGraph(d2))
    // graphTabs.append(AddButton)
    // tabList.push(AddButton)
  
  console.log(playerDataJson)

  var parseDate = d3.timeParse("%d/%m/%Y"); 

  var data = playerDataJson.query
  data.forEach(function(d) {
   d.GAME_DATE = parseDate(d.GAME_DATE);
   d.time = d.GAME_DATE
 })
 

  function addGraph(data)
  {
    var liID = GraphList.length + 1

    activateNew();


    var tab = document.createElement("li")
    d3.select(tab)
    .attr("role", "tab")
    .append("a")
    .attr("aria-selected","true")
    .html(liID.toString())
    .attr("class", "atab")
    .attr("href","#"+liID.toString()+"_tab")
    .attr("data-toggle","tab");

    
    tabList.push(tab)
    var graph = document.createElement("div")
    d3.select(graph)
    .attr("class","tab-pane")
    .attr("role","tabpanel")
    .attr("id",liID.toString()+"_tab")
    .attr("aria-hidden","false");

    d3.select(graphTabs).selectAll('ul').append(tab)
    grabTabList.push(graph)
    var g = SingleGenericGraph(graph,data)
    graphContent.append(graph)
    GraphList.push(g)
    

  }
  

  function activateNew()
  {
    tabList.forEach(
      function(d){
        console.log("PRINT TABS")
        console.log(d)
        d3.select(d)
        .selectAll("a")
        .attr("aria-selected","false")
      }
    )

    grabTabList.forEach(
      function(d){
        console.log("PRINT Graph")
        console.log(d)
        d3.select(d)
        .attr("aria-hidden","true")
      }
    )
  }

  addGraph(data)
  addGraph(data)
  addGraph(data)
  addGraph(data)
// function addPlayerData(pData)
// {
//    playerDataList.push(pData);
// }

//   function updateGraph()
//   {
    
//   }

changeTabs()

}

export default GraphController;