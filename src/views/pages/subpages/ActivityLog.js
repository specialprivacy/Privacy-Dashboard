import React, {Component} from "react";
import { generateRandomKey } from "../../../AppContainer";
import { getLabel } from "../../../util/VocabLabelsGenerator";
import DataTable from "react-data-table-component";
import JSONPretty from "react-json-pretty";
import Card from "material-ui/Card/Card";
import CardHeader from "material-ui/Card/CardHeader";
import CardText from "material-ui/Card/CardText";
import { ResponsiveCalendar } from "@nivo/calendar";

class ActivityLog extends Component {  
  render() {
    const self = this;

    const columns = [
      { name: "Date", selector: "date", sortable: true, compact: true, allowOverflow: false, wrap: true },
      { name: "Data", selector: "data", sortable: true, compact: true, allowOverflow: false, wrap: true },
      { name: "Purpose", selector: "purpose", sortable: true, compact: true, allowOverflow: false, wrap: true },
      { name: "Processing", selector: "processing", sortable: true, compact: true, allowOverflow: false, wrap: true },
      { name: "Storage", selector: "storage", sortable: true, allowOverflow: false, wrap: true },
      { name: "Recipient", selector: "recipient", sortable: true, allowOverflow: false, wrap: true },
    ];

    const ExpanableComponent = ({ data }) => <JSONPretty data={data.instanceData}></JSONPretty>;

    var from = this.props.data.sort((a, b) => a.timestamp - b.timestamp);
    var fromDay = "";
    var toDay = "";
    if (from.length > 0) {
      toDay = new Date(from[from.length-1].timestamp).toISOString().split("T")[0];
      fromDay = new Date(from[0].timestamp).toISOString().split("T")[0];
    }    

    var numYears = toDay.split("-")[0] - fromDay.split("-")[0] + 1;
  
    return (
      <div>
        <Card 
          className="custom-card" 
          expandable={true} 
          style={{marginTop: "20px"}}>
          <CardHeader
            avatar="images/heatMapAvatar.png"
            showExpandableButton={true}
            title={
              <div>
                <h4>Activity heat map</h4>
              </div>
            }
            subtitle={<span>Learn on which days your personal data has been processed how many times.</span>}>
          </CardHeader>
          <CardText expandable={true}>
            <div className="row">
              <div className="col-12">
                <div style={{height: numYears * 200 + "px"}}>
                  <ResponsiveCalendar
                    data={
                      this.props.data
                        .map((entry) => {
                          let date = new Date(entry.timestamp);
                          let day = date.toISOString().split("T")[0]
                          return {
                            day: day,
                          };
                        }).reduce((result, day) => {
                          let wasInside = false;
                          for (var i=0; i < result.length; i++) {
                            if (result[i].day === day.day) {
                              result[i].value += 1;
                              wasInside = true;
                            }
                          }
                          if (!wasInside) {
                            result.push({day: day.day, value: 1});
                          }
                          return result;
                        }, [])
                    }
                    from={fromDay}
                    to={toDay}
                    emptyColor="#eeeeee"
                    colors={[ "#61cdbb", "#97e3d5", "#e8c1a0", "#f47560" ]}
                    margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                    yearSpacing={40}
                    monthBorderColor="#ffffff"
                    dayBorderWidth={2}
                    dayBorderColor="#ffffff"
                    legends={[{
                      anchor: "bottom",
                      direction: "row",
                      translateY: 36,
                      itemCount: 4,
                      itemWidth: 42,
                      itemHeight: 36,
                      itemsSpacing: 14,
                      itemDirection: "right-to-left"
                    }]}
                  />            
                </div>
              </div>
            </div>
          </CardText>
        </Card>

        <Card 
          className="custom-card" 
          expandable={true} 
          style={{marginTop: "20px"}}>
          <CardHeader
            avatar="images/logAvatar.png"
            showExpandableButton={true}
            title={
              <div>
                <h4>Activity log</h4>
              </div>
            }
            subtitle={<span>Review the contents of the activity log.</span>}>
          </CardHeader>
          <CardText expandable={true}>
            <div className="row">
              <div className="col-12">
                <DataTable
                  pagination={true}
                  striped={true}
                  highlightOnHover={true}
                  expandableRows={true}
                  expandableRowsComponent={<ExpanableComponent/>}
                  columns={columns}
                  data={
                    this.props.data
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map((e) => {
                        var storage;
                        var recipient;

                        if (typeof self.props.application !== "undefined" &&
                            self.props.application.hasOwnProperty("controllerInfo")) {

                              if (e.storage === "http://www.specialprivacy.eu/vocabs/locations#OurServers") {
                                storage = 
                                  self.props.application.controllerInfo
                                    .filter((e) => e.controller)
                                    .map((e) => e.legalName)
                                    .join(", ");
                              }

                              if (e.recipient === "http://www.specialprivacy.eu/vocabs/recipients#Ours") {
                                recipient = 
                                  self.props.application.controllerInfo
                                    .filter((e) => !e.controller)
                                    .map((e) => e.legalName)
                                    .join(", ");
                              }
                        } else {
                          storage = getLabel(e.storage, true);
                          recipient = getLabel(e.recipient, true);
                        }

                        var dateObj = new Date(e.timestamp);
                        return {
                          id: generateRandomKey(),
                          date: dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString(),
                          data: getLabel(e.data, true),
                          purpose: getLabel(e.purpose, true),
                          processing: getLabel(e.processing, true),
                          storage: storage,
                          recipient: recipient,
                          instanceData: e,
                        }
                      })
                  }
                />                             
              </div>
            </div>
          </CardText>
        </Card>
      </div>
    )
  }
}

export default ActivityLog;
