import React, {Component} from 'react';
import '../assets/App.css';

class AppMain extends Component{
  render () {
    return (
      <div className="App">
        <div className="App-header">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default AppMain;
