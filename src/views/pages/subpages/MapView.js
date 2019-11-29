import React, { Component } from "react";

import Card from "material-ui/Card";
import CardHeader from "material-ui/Card/CardHeader";
import CardText from "material-ui/Card/CardText";

import {Map, TileLayer, Polyline, Marker} from "react-leaflet";
import {generateRandomKey} from "../../../AppContainer";
import DataTable from "react-data-table-component";
import LinearProgress from "material-ui/LinearProgress";
import CircularProgress from "material-ui/CircularProgress";

var request = require("request");

export default class MapView extends Component {

  state = {
    windowSize: 5,
    locationData: [],
    loading: false,
  }

  openCard = (newExpandedState) => {
    if (!newExpandedState) {
      return;
    }

    // totalsRows can have an arbitrary value here
    this.loadExtraInfo(1, -1);
  }

  loadExtraInfo = (page, totalRows) => {
    var window = page - 1;
    this.setState({loading: true});
    this.forceUpdate();

    setTimeout(function() {
      self.setState({loading: false});
    }, 7500);    

    const self = this;
    var itemsProcessed = 0;
    var tmpArray = [];
    this.props.data
      .filter((e) => (e.data === "http://www.specialprivacy.eu/vocabs/data#Location"))  
      .sort((a, b) => b.instanceData.timestamp - a.instanceData.timestamp)
      .slice(window * this.state.windowSize, window * this.state.windowSize + this.state.windowSize)
      .forEach((e) => getLocationInfo(e, (locationInfo, logEntry) => {
        itemsProcessed++;
        if (locationInfo !== null) {
          tmpArray.push({extraInfo: locationInfo, logEntry: logEntry});
          if (itemsProcessed === self.state.windowSize) {
            self.setState({locationData: tmpArray});
            self.forceUpdate();
            setTimeout(function() {
              self.setState({loading: false});
            }, 2500);
          }
        }
      }));
  }  

  render() {
    const self = this; 

    const columns = [
      { name: "Date", selector: "date", sortable: true, compact: true, maxWidth: "150px" },
      { name: "Address", selector: "streetName", sortable: true, compact: true, allowOverflow: false, wrap: true },
      { name: "", selector: "menu", sortable: true, compact: true, maxWidth: "64px" },
    ];

    return (
      <div>
        <Card 
          className="custom-card" 
          expandable={true} 
          style={{marginTop: "20px"}}
          onExpandChange={this.openCard}>
          <LinearProgress mode="indeterminate" style={{display: (this.state.loading) ? "block" : "none"}} />
          <CardHeader
            avatar="images/locationAvatar.png"
            showExpandableButton={true}
            title={
              <div>
                <h4>Your location information.</h4>
              </div>
            }
            subtitle={
              (this.props.interestProfile === null ||
               typeof this.props.interestProfile.filter((group) => group.dataCategory === "location")[0] === "undefined") ?
                <span>
                  We have collected {
                    new Intl.NumberFormat("en-US", { style: "decimal"})
                      .format(this.props.data
                        .filter((e) => (e.data === "http://www.specialprivacy.eu/vocabs/data#Location"))
                        .length)
                    } 
                  &nbsp;locations.
                </span> :
                "Derived keywords from your location information: " + 
                this.props.interestProfile
                  .filter((group) => group.dataCategory === "location")[0]
                  .keywords.map((e) => e.label)
                  .join(", ")
            }>
          </CardHeader>
          <CardText expandable={true}>
            <div className="row">
              <div className="col-lg-6">
                <DataTable
                  title={
                    <h5>
                      <div style={{float: "left"}}>Dates and addresses</div>
                      <CircularProgress size={20} style={{float: "left", marginLeft: "20px", display: (this.state.loading) ? "block" : "none"}} />
                    </h5>
                  }
                  columns={columns}
                  pagination={true}
                  paginationServer={true}
                  paginationPerPage={5}
                  paginationTotalRows={
                    this.props.data
                      .filter((e) => (e.data === "http://www.specialprivacy.eu/vocabs/data#Location"))
                      .length
                  }
                  paginationRowsPerPageOptions={[5]}
                  onChangePage={this.loadExtraInfo}
                  striped={true}
                  highlightOnHover={true}
                  onRowClicked={(e) => {
                    this.refs.map.leafletElement.panTo([e.originalEntry.logEntry.instanceData.lat, e.originalEntry.logEntry.instanceData.lon]);
                  }}
                  data={
                    this.state.locationData
                      .sort((a, b) => b.logEntry.instanceData.timestamp - a.logEntry.instanceData.timestamp)
                      .map((e) => {
                        var dateObj = new Date(e.logEntry.instanceData.timestamp);
                        return {
                          id: generateRandomKey(),
                          date: dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString(),
                          streetName: e.extraInfo.display_name,
                          originalEntry: e,
                          menu: self.props.menu(e.logEntry)
                        }
                      })
                  }
                />         
              </div>
              <div className="col-lg-6">
                <Map
                  ref="map"
                  center={
                    (this.state.locationData.length > 0) ? 
                    [this.state.locationData[0].logEntry.instanceData.lat, this.state.locationData[0].logEntry.instanceData.lon] : [0, 0]
                  }
                  zoom={18}
                  zoomControl={true}
                  style={{height: "400px", borderRadius: "15px", boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 6px"}}>
                  <TileLayer
                    url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
                  />
                  {
                    this.state.locationData.map((e) => {
                      return (
                        <Marker  
                          key={generateRandomKey()} 
                          position={[e.logEntry.instanceData.lat, e.logEntry.instanceData.lon]} 
                        />
                      )
                    })
                  }
                  <Polyline positions={this.state.locationData.map((e) => [e.logEntry.instanceData.lat, e.logEntry.instanceData.lon])}/>
                </Map>
              </div>
            </div>

   
          </CardText>
      </Card>
    </div>
    )
  }
}

function getLocationInfo(logEntry, callback) {
  if (!logEntry.instanceData.hasOwnProperty("lat") || 
      !logEntry.instanceData.hasOwnProperty("lon")) {
        callback(null, logEntry);
        return;
      }

  var options = {
    method: "get",
    url: "https://nominatim.openstreetmap.org/reverse",
    qs: {
      format: "json",
      lat: logEntry.instanceData.lat,
      lon: logEntry.instanceData.lon
    }
  }

  request(options, async function(err, res, body) {
    if (err) {
      callback(null, logEntry);
    } else {
      callback(JSON.parse(body), logEntry);
    }
  });
}
