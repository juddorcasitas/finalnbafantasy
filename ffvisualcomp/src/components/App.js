import React, {Component} from 'react';
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import LandingTemp from './landing/landing_page'
import PlayerProfile from './player/player-profile'
import GraphCanvas from './player/player-graph'
import classNames from '../components/utils/class-css'
import '../assets/App.css'

class AppMain extends Component{

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle(e){
    this.setState({open: !this.state.open});
  }

  handleClose(e){
    if (this.state.open === true){
      this.setState({open: false});
    }
  }

  render () {
    const contentStyle = {  transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)' };
    if (this.state.open) {
      contentStyle.marginLeft = 200;
    }
    return (
      <div className={classNames.main} onClick={(e) => this.handleClose(e)}
      style={contentStyle}>
        <Router>
        <Button
          label="Toggle Drawer"
          onClick={e => this.handleToggle(e)}
        >&#8594; &nbsp;Full Menu</Button>
        <Drawer 
            width={300}
            open={this.state.open}        >
          <MenuItem component={Link} to="/">More Info</MenuItem>
          <MenuItem component={Link} to="/player-profile">Player Statistics</MenuItem>
          <MenuItem component={Link} to="/team-builder">Create a Team</MenuItem>
          <MenuItem component={Link} to="/login">Sign Up</MenuItem>
          <MenuItem component={Link} to="/player-graph">Graphs</MenuItem>

        </Drawer>
        <Switch>
          <Route exact path="/" component={LandingTemp}>
            </Route>
          <Route path="/player-profile/:playerURL?" component={PlayerProfile}/>
          <Route path="/player-graph/:playerURL?" component={GraphCanvas}/>
        </Switch>
      </Router>
      </div>
    );
  }
}

export default AppMain;
