import React, {Component} from 'react'
import classNames from '../utils/class-css'

class PlayerProfile extends Component{
    constructor(props){
        this.state = {
            firstName = "",
            lastName = "",
            profileImage = "",
            jersey = "",
            currentTeam = "",
            isActive = "",
            heightFeet = "",
            heightMeters = "",
            weightPounds = "",
            weightKilos = "",
            dateOfBirth = "",
            pastTeams = [],
            position = "",
            personId = "",
            debut = "",
            College = "",
            Country = ""
        }
    }

    fetchPlayerInfo(){
        
    }

    render(){
        return(
            <div className={classNames.wrapperLarge}>
                
            </div>
        );
    }
}