import React, { Component } from "react";

import Card from "material-ui/Card";
import CardHeader from "material-ui/Card/CardHeader";
import CardText from "material-ui/Card/CardText";
import { generateRandomKey, backendUrl, defaultHeaders } from "../../../AppContainer";
import LinearProgress from "material-ui/LinearProgress";
import CircularProgress from "material-ui/CircularProgress";
import RaisedButton from "material-ui/RaisedButton";

var request = require("request");

export default class BrowsingView extends Component {

  state = {
    window: 0,
    windowSize: 10,
    browsingData: [],
    loading: false,
  }

  loadExtraInfo = (newExpandedState) => {
    if (!newExpandedState) {
      return;
    }

    this.setState({loading: true, window: this.state.window + 1});
    this.forceUpdate();

    setTimeout(function() {
      self.setState({loading: false});
    }, 7500);    

    const self = this;
    var itemsProcessed = 0;
    var tmpArray = [];
    this.props.data
      .filter((e) => (e.data === "http://www.specialprivacy.eu/vocabs/data#OnlineActivity"))  
      .sort((a, b) => b.instanceData.timestamp - a.instanceData.timestamp)
      .slice(this.state.window * this.state.windowSize, this.state.window * this.state.windowSize + this.state.windowSize)
      .forEach((e) => getWebInfo(e, (webInfo, logEntry) => {
        itemsProcessed++;
        if (webInfo !== null) {
          tmpArray.push({extraInfo: webInfo, logEntry: logEntry});
          if (itemsProcessed === self.state.windowSize) {
            self.setState({browsingData: self.state.browsingData.concat(tmpArray)});
            self.forceUpdate();
            setTimeout(function() {
              self.setState({loading: false});
            }, 2500);
          }
        }
      }));
  }

  render() {
    if (typeof this.props.data === "undefined") {
      return (<div></div>);
    }

    return (
      <div>
        <Card 
          className="custom-card" 
          expandable={true} 
          style={{marginTop: "20px"}}
          onExpandChange={this.loadExtraInfo}
          >
          <LinearProgress mode="indeterminate" style={{display: (this.state.loading) ? "block" : "none"}} />
          <CardHeader
            avatar="images/browsingAvatar.png"
            showExpandableButton={true}
            title={
              <div>
                <h4>Your browsing behavior information.</h4>
              </div>
            }
            subtitle={
              (this.props.interestProfile === null ||
               typeof this.props.interestProfile.filter((group) => group.dataCategory === "browsing")[0] === "undefined") ? 
                <span>
                  We have collected {
                    new Intl.NumberFormat("en-US", { style: "decimal"})
                      .format(this.props.data
                        .filter((e) => (e.data === "http://www.specialprivacy.eu/vocabs/data#OnlineActivity")).length)
                  } websites you have visited.
                </span> :
                "Derived keywords from your browsing information: " + 
                this.props.interestProfile
                  .filter((group) => group.dataCategory === "browsing")[0]
                  .keywords.map((e) => e.label)
                  .join(", ")
            }>
          </CardHeader>
          <CardText expandable={true}>
            <div className="row">
              {
                this.state.browsingData
                  .sort((a, b) => b.logEntry.instanceData.timestamp - a.logEntry.instanceData.timestamp)
                  .map((e) => {
                    var img = "images/placeholder.png";
                    if (e.extraInfo.hasOwnProperty("og:image")) {
                      img = e.extraInfo["og:image"];
                    } else if (e.extraInfo.hasOwnProperty("twitter:image")) {
                      img = e.extraInfo["twitter:image"];
                    }
                    return (
                      <div 
                        key={generateRandomKey()} 
                        className="col-12" 
                        style={{marginBottom: "20px"}}
                        >
                        <Card className="col-12">
                          <CardHeader
                            avatar={img}
                            title={<b>{e.extraInfo.title}<div style={{float: "right"}}>{this.props.menu(e.logEntry)}</div></b>}
                            subtitle={
                              <div>
                                <a href={new URL(e.logEntry.instanceData.url).origin} title={e.extraInfo.title} target="noopener noreferrer">
                                  {new URL(e.logEntry.instanceData.url).origin}
                                </a> - visited: 
                                <b>{new Date(e.logEntry.timestamp).toLocaleString("en-GB")}</b>
                              </div>
                            }
                          />                        
                          <CardText style={{paddingTop: "0", paddingBottom: "10px"}}>
                            {e.extraInfo.description}
                          </CardText>
                        </Card>                  
                      </div>
                  )})
              }
            </div>
            <div className="row">
              <CircularProgress style={{margin: "0 auto", display: (this.state.loading) ? "block" : "none"}} />
            </div>
            <div className="row">
              <RaisedButton 
                label="Load more" 
                primary={true}
                style={{margin: "0 auto"}}
                onClick={this.loadExtraInfo}
              />
            </div>            
          </CardText>
      </Card>
    </div>
    )
  }
}

function getWebInfo(logEntry, callback) {
  
  var options = {
    method: "get",
    url: backendUrl + "/link",
    headers: defaultHeaders,
    qs: {
      url: new URL(logEntry.instanceData.url).origin,
    }
  }

  request(options, async function(err, res, body) {
    if (err) {
      return
    }

    body = JSON.parse(body);
    
    if (!body.success) {
      callback(null, logEntry);
    } else {
      callback(body.result, logEntry);
    }
  });
}
