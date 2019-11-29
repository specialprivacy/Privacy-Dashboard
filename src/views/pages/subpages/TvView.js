import React, { Component } from "react";

import Card from "material-ui/Card";
import CardMedia from "material-ui/Card/CardMedia";
import CardHeader from "material-ui/Card/CardHeader";
import CardText from "material-ui/Card/CardText";
import { backendUrl, defaultHeaders, generateRandomKey } from "../../../AppContainer";
import LinearProgress from "material-ui/LinearProgress";
import CircularProgress from "material-ui/CircularProgress";
import RaisedButton from "material-ui/RaisedButton";
import Divider from "material-ui/Divider";

var request = require("request");

export default class TvView extends Component {

  state = {
    window: 0,
    windowSize: 10,
    tvData: [],
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
      .filter((e) => (e.data === "http://www.specialprivacy.eu/vocabs/data#AudiovisualActivity"))  
      .sort((a, b) => b.instanceData.watched_on - a.instanceData.watched_on)
      .slice(this.state.window * this.state.windowSize, this.state.window * this.state.windowSize + this.state.windowSize)
      .forEach((e) => getMovieInfo(e, (movieInfo, logEntry) => {
        itemsProcessed++;
        if (movieInfo !== null) {
          tmpArray.push({extraInfo: movieInfo, logEntry: logEntry});
          if (itemsProcessed === self.state.windowSize) {
            self.setState({tvData: self.state.tvData.concat(tmpArray)});
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
            avatar="images/tvAvatar.png"
            showExpandableButton={true}
            title={
              <div>
                <h4>Your TV viewing information.</h4>
              </div>
            }
            subtitle={
              (this.props.interestProfile === null ||
               typeof this.props.interestProfile.filter((group) => group.dataCategory === "tv")[0] === "undefined") ? 
                <span>
                  We have collected {
                    new Intl.NumberFormat("en-US", { style: "decimal"})
                      .format(this.props.data
                        .filter((e) => (e.data === "http://www.specialprivacy.eu/vocabs/data#AudiovisualActivity")).length)
                  } TV shows and movies you have watched.
                </span> :
                "Derived keywords from your tv information: " + 
                this.props.interestProfile
                  .filter((group) => group.dataCategory === "tv")[0]
                  .keywords.map((e) => e.label)
                  .join(", ")                
            }>
          </CardHeader>
          <CardText expandable={true}>
            <div className="row">
              {
                this.state.tvData
                  .sort((a, b) => b.logEntry.instanceData.watched_on - a.logEntry.instanceData.watched_on)
                  .map((e) => {
                    return <div key={generateRandomKey()} className="col-md-6 col-lg-4 col-xl-3" style={{marginBottom: "20px"}}>
                        <Card>
                          <CardHeader
                            style={{overflow: "hidden"}}
                            textStyle={{display: "block"}}
                            title={
                              <div style={{display: "block"}}>
                                <div 
                                  style={{
                                    width: "100%", 
                                    whiteSpace: "nowrap", 
                                    overflow: "hidden", 
                                    textOverflow: "ellipsis",
                                    fontWeight: "bold",
                                  }}>
                                    {e.extraInfo.title}
                                  </div>
                                <div style={{float: "right"}}>{this.props.menu(e.logEntry)}</div>
                              </div>
                            }
                          />
                          <CardMedia>
                            <img src={"https://image.tmdb.org/t/p/w500/" + e.extraInfo.poster_path} title={e.extraInfo.title} alt={e.extraInfo.title} />
                          </CardMedia>
                          <CardText>
                            {e.extraInfo.overview.split(" ").slice(0, 30).join(" ") + " ..."}
                            <Divider style={{marginTop: "20px", marginBottom: "20px"}}/>
                            <div>Watched on: {new Date(e.logEntry.instanceData.watched_on).toLocaleDateString() + " " + new Date(e.logEntry.instanceData.watched_on).toLocaleTimeString()}</div>
                            <div>For: {e.logEntry.instanceData.duration / 100} minutes</div>
                            <div>From IP: {e.logEntry.instanceData.ip_address}</div>
                          </CardText>
                        </Card>                  
                      </div>
                  })
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

function getMovieInfo(logEntry, callback) {
  var options = {
    method: "get",
    url: backendUrl + "/movie",
    headers: defaultHeaders,
    qs: {
      movie: logEntry.instanceData.movie_title,
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
      if (body.result.total_results >= 1) {
        callback(body.result.results[0], logEntry);
      } else {
        callback(null, logEntry);
      }
    }
  });
}