import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import LandingTemp from './landing/landing_page'
import PlayerProfile from './player/player-profile'
import classNames from '../components/utils/class-css'

import '../assets/App.css';

class AppMain extends Component{
  render () {
    return (
      <div className={classNames.main}>
      <Router>
        <div className={classNames.header}>
          <ul>
            <li>
              <Link to="/">More Info</Link>
            </li>
            <li>
              <Link to="/player-profile">Player Statistics</Link>
            </li>
            <li>
              <Link to="/team-builder">Create a Team</Link>
            </li>
            <li>
              <Link to="/login">Sign Up</Link>
            </li>
          </ul>
        </div>

        <Switch>
          <Route exact path="/">
            <LandingTemp />
          </Route>
          <Route path="/player-profile/:playerURL?" component={PlayerProfile}/>
        </Switch>

      </Router>
        <div className={classNames.home}>
        </div>
      </div>
    );
  }
}

export default AppMain;
