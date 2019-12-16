import React from "react"


function ComponentLeft(){
    <div class="headerComponentLeft">
        
    </div>
}

function ComponentCenter(){

}

function ComponentRight(){
    return(
        <div class="headerComponentRight">
        </div>
    );
}

function Header(props){
    return(<div>
        <div class="header">
            <ComponentLeft></ComponentLeft>
            <ComponentRight></ComponentRight>
            </div>
    </div>);
}