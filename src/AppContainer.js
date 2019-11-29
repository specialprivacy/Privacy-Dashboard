import React, {Component} from 'react';
import App from "./App";
import LoginForm from './views/LoginForm';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from "material-ui/styles/getMuiTheme";
import specialTheme from "./themes/specialTheme";
import proximusTheme from "./themes/proximusTheme";
import tlabsTheme from "./themes/tlabsTheme";
import reutersTheme from "./themes/reutersTheme";

export var theme = specialTheme;
var request = require("request");

var bUrl = "";
if (process.env.NODE_ENV === "production") {
  bUrl = "https://backend.special.tlabs.cloud/api";
} else {
  bUrl = "http://localhost:3000/api";
}

export const backendUrl = bUrl;

const themes = {
  special: specialTheme,
  proximus: proximusTheme,
  tlabs: tlabsTheme,
  reuters: reutersTheme
}

var key = "acadd8ae-1f8e-4148-9bb5-fe0d821e2a03";
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("theme") !== null && themes.hasOwnProperty(urlParams.get("theme"))) {
  key = themes[urlParams.get("theme")].apiKey;
}
export const apiKey = key;

var appUrl;
if (urlParams.get("backToAppUrl") !== null) {
  appUrl = urlParams.get("backToAppUrl");
}
export const backToAppUrl = appUrl;

export var defaultHeaders = {
  "Authorization": "Bearer " + window.localStorage.getItem(apiKey + ":token"),
  "Content-Type": "application/json",
  "x-api-key": apiKey
};

class AppContainer extends Component {

  state = {
    theme: specialTheme,
    loggedIn: false,
    application: null,
    policies: null,
    interestProfile: null,
  };

  componentDidMount() {
    var token = window.localStorage.getItem(apiKey + ":token");
    if (token !== null) {
      this.setLoggedIn(true, token);
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("theme") !== null && themes.hasOwnProperty(urlParams.get("theme"))) {
      this.setState({theme: themes[urlParams.get("theme")]});
      theme = themes[urlParams.get("theme")];
    }
  }

  getInterestProfile = () => {
    const self = this;

    var options = {
      method: "get",
      url: backendUrl + "/user",
      qs: {
        attribute: "interest-profile"
      },
      headers: defaultHeaders,
      json: true
    }
    request(options, function(err, res, body) {
      if (err) {
        return
      }
      if (!body.success) {
        console.log(body.message);
      } else {
        self.setState({interestProfile: body.result});
        self.forceUpdate();
      }
    });    
  }

  getApplication = () => {
    const self = this;

    var options = {
      method: "get",
      url: backendUrl + "/application",
      headers: defaultHeaders,
      json: true
    }
    request(options, function(err, res, body) {
      if (err) {
        return
      }
      if (!body.success) {
        console.log(body.message);
      } else {
        self.setState({application: body.result});
        self.forceUpdate();
      }
    });    
  }

  getPolicies = () => {
    const self = this;

    var options = {
      method: "get",
      url: backendUrl + "/consent",
      headers: defaultHeaders,
    }
    request(options, function(err, res, body) {
      if (err) {
        return
      }
      body = JSON.parse(body);
      if (!body.success || typeof body.result === "undefined") {
        console.log(body.message);
      } else {
        self.setState({policies: body.result});
        self.forceUpdate();
      }
    });    
  }

  setLoggedIn = (loggedIn, token) => {
    if (loggedIn) {
      window.localStorage.setItem(apiKey + ":token", token);
      defaultHeaders.Authorization = "Bearer " + window.localStorage.getItem(apiKey + ":token");
      this.getApplication();
      this.getPolicies();  
      this.getInterestProfile();  
    } else {
      window.localStorage.removeItem(apiKey + ":token");
    }
    this.setState({loggedIn: loggedIn, application: null, policies: null, interestProfile: null});
  }

  render() {
    var content;
    if (!this.state.loggedIn) {
      content = <LoginForm setLoggedIn={this.setLoggedIn} application={this.state.application} />
    } else {
      content = 
        <App 
          setLoggedIn={this.setLoggedIn} 
          application={this.state.application} 
          policies={this.state.policies}
          interestProfile={this.state.interestProfile}
        />
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(this.state.theme)}>
        <div>
          <div className="background-container">
            <div className="background-image" style={{background: theme.background}}/>
          </div>
          {content}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppContainer;


// https://stackoverflow.com/a/27747377
function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}

export const generateRandomKey = () => {
  var arr = new Uint8Array((12 || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
};