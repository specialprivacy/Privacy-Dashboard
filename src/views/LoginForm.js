import React, {Component} from "react";
import Card from "material-ui/Card/Card";
import CardText from "material-ui/Card/CardText";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import {theme, backendUrl, apiKey} from "../AppContainer";
import "../styles/LoginForm.css";

var request = require('request');

class LoginForm extends Component {

  state = {
    error: false,
    errorMsg: "",
    btnDisabled: true,
  }

  signIn = () => {
    const self = this;
    self.setState({error: false, errorMsg: ""});

    var email = this.refs["inputEmail"].input.value;
    var password = this.refs["inputPassword"].input.value;

    var options = {
      method: "post",
      url: backendUrl + "/authenticate",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body: {
        username: email,
        password: password
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
        self.props.setLoggedIn(true, body.result);
      }

    });
  }

  handleTextInput = () => {
    var email = this.refs["inputEmail"].input.value;
    var password = this.refs["inputPassword"].input.value;

    this.setState({btnDisabled: !(email !== "" && password !== "")});
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-4 offset-xl-4 col-lg-6 offset-lg-3 col-sm-8 offset-sm-2">
            <Card id="login-form" style={{padding: "20px 70px"}}>
              <CardText>
                <div className="row">
                  <img src={theme.logo} alt={theme.name} style={{maxWidth: "95%", maxHeight: "225px", margin: "0 auto", marginBottom: "40px"}} />
                </div>
                <div className="row">
                  <h1>Sign in</h1>
                </div>
                <div className="row">
                  To access your privacy dashboard please log in with your service credentials.
                </div>
                <div className="row"
                  style={{display: (this.state.error) ? "block" : "none", color: "red", fontWeight: "bold", marginTop: "20px"}}>
                    {this.state.errorMsg}
                </div>
                <div className="row">
                  <TextField
                    ref="inputEmail"
                    floatingLabelText="Your email"
                    hintText="email@example.com"
                    fullWidth={true}
                    onChange={this.handleTextInput}
                  />
                </div>                
                <div className="row">
                  <TextField
                    ref="inputPassword"
                    floatingLabelText="Password"
                    hintText="******"
                    type="password"
                    fullWidth={true}
                    onChange={this.handleTextInput}
                  />
                </div>
                <div className="row">
                  <RaisedButton
                    primary={true}
                    label="Sign in"
                    onClick={this.signIn}
                    style={{margin: "0 auto", marginTop: "20px"}}
                    disabled={this.state.btnDisabled}
                  />
                </div>
                <div className="row">
                  <a href="#forgot-password" style={{margin: "0 auto", marginTop: "20px"}}>I forgot my password.</a>
                </div>
                <div className="row" style={{marginTop: "20px", textAlign: "left"}}>
                  <small>
                    This privacy dashboard is provided by {theme.name}.
                    You can find more on <a href={theme.website} target="_blank" rel="noopener noreferrer">{theme.website}</a>.
                    For further information, please contact <a href={"mailto:" + theme.email}>{theme.email}</a>.
                  </small>
                </div>
              </CardText>
            </Card>
          </div>
        </div>
      </div>
      
    )
  }

}

export default LoginForm;