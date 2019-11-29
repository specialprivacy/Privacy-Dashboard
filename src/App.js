import React, {Component} from "react";
import "./styles/App.css";
import {backendUrl, defaultHeaders} from "./AppContainer";
import MainMenu from "./views/MainMenu";
import MainView from "./views/MainView";
import Badge from "material-ui/Badge";
import CommunicationEmail from "material-ui/svg-icons/communication/email";
import MessageSection from "./views/dialogs/MessageSectionDialog";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import SignOut from "material-ui/svg-icons/action/power-settings-new";

var request = require("request");

class App extends Component {

  state = {
    data: [],
    numberMessages: 0,
    showMessageBadge: false,
    messageSectionOpen: false
  };

  componentDidMount() {
    const self = this;

    var options = {
      method: "get",
      url: backendUrl + "/log/pull",
      headers: defaultHeaders,
      qs: {
        from: Date.now() - 1000 * 60 * 60 * 24 * 365 * 3,
        to: Date.now()
      },
      json: true
    }
    request(options, function(err, res, body) {
      if (err) {
        return
      }

      if (!body.success) {
        self.setState({error: true, errorMsg: body.message});
      } else {
        self.setState({data: body.result});
      }
      self.forceUpdate();
    });
  }

  addToData = (entry) => {
    this.setState({data: this.state.data.concat([entry])});
  }

  toggleMessageSectionOpen = () => {
    this.setState({messageSectionOpen: !this.state.messageSectionOpen});
  };

  AppBarMenu = <span>
    <Badge
      badgeContent={this.state.numberMessages}
      secondary={true}
      badgeStyle={{top: -4, right: -4,zIndex: 9}}
      style={{padding: 0, display: (this.state.showMessageBadge) ? "inline" : "none"}}>
        <IconButton
          iconStyle={{color: "white"}}
          onClick={this.toggleMessageSectionOpen}>
          <CommunicationEmail/>
        </IconButton>
    </Badge>
    <IconButton
      iconStyle={{color: "white"}}
      style={{display: (this.state.showMessageBadge) ? "none" : "inline"}}
      onClick={this.toggleMessageSectionOpen}>
      <CommunicationEmail/>
    </IconButton>
    <IconButton 
      className="logout-btn"
      tooltip="Sign out" 
      tooltipPosition="top-center" 
      onClick={() => {this.props.setLoggedIn(false, "")}}>
      <SignOut/>
    </IconButton>
  </span>

  render() {
    return (
      <div id="main-container" className="container-fluid">
        <AppBar
          className="xs-sm-appbar"
          title={(this.props.application === null) ? "": <span>{this.props.application.name} - Privacy Settings</span>}
          showMenuIconButton={false}
          iconElementRight={this.AppBarMenu}
        />

        <div className="row">
          <div className="col-lg-3">
            <MainMenu 
              setLoggedIn={this.props.setLoggedIn}
              application={this.props.application}
            />
          </div>

          <div id="main-view-container" className="col-lg-9">
            <MainView 
              appBarMenu={this.AppBarMenu} 
              data={this.state.data} 
              addToData={this.addToData}
              setLoggedIn={this.props.setLoggedIn} 
              application={this.props.application}
              policies={this.props.policies}
              interestProfile={this.props.interestProfile}
            />
          </div>            
        </div>
        <MessageSection
          data={this.state.data} 
          messageSectionOpen={this.state.messageSectionOpen}
          toggleMessageSectionOpen={this.toggleMessageSectionOpen}
        />
      </div>
    );
  }
}

export default App;