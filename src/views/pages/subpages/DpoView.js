import React, {Component} from "react";
import { generateRandomKey } from "../../../AppContainer";
import Card from "material-ui/Card";
// import CardMedia from "material-ui/Card/CardMedia";
// import CardTitle from "material-ui/Card/CardTitle";
import CardHeader from "material-ui/Card/CardHeader";
import CardText from "material-ui/Card/CardText";
import CardActions from "material-ui/Card/CardActions";
import FlatButton from "material-ui/FlatButton";
import SendIcon from "material-ui/svg-icons/content/send";
import ApproveIcon from "material-ui/svg-icons/action/done";
import DeclineIcon from "material-ui/svg-icons/navigation/close";
import { Divider } from "material-ui";

class DpoView extends Component {
  state = {
    requests: [{
      dataSubject: "testing2@testing.com",
      timestamp: 1566341772000,
      subject: "Erasure of personal data",
      concernedPersonalData: "Location",
      text: "I hereby request erasure of my location data.",
    }, {
      dataSubject: "testing3@testing.com",
      timestamp: 1566341672000,
      subject: "Rectification of personal data",
      concernedPersonalData: "TV",
      text: "I hereby request rectification of my TV viewing data.",
    }, {
      dataSubject: "test8@testing.com",
      timestamp: 1566341572000,
      subject: "Erasure of personal data",
      concernedPersonalData: "Location",
      text: "I hereby request erasure of my location data.",
    }, {
      dataSubject: "test000@testing.com",
      timestamp: 1566341472000,
      subject: "Erasure of personal data",
      concernedPersonalData: "Location",
      text: "I hereby request erasure of my location data.",
    }, {
      dataSubject: "user@testing.com",
      timestamp: 1566341472000,
      subject: "Withdrawl of consent",
      concernedPersonalData: "Location",
      text: "I hereby withdraw consent to process my location data.",
    },]
  }


  render() {
    return (
      <div>
        {
          this.state.requests
            .map((e) => {
              return (
                <div key={generateRandomKey()} className="col-12" style={{marginTop: "20px"}}>
                  <Card>
                    <CardHeader
                      title={<b>{e.subject}</b>}
                      subtitle={
                        <div style={{color: "black"}}>
                          <div><b>From: {e.dataSubject}</b></div>
                          <div><b>Received: {new Date(e.timestamp).toLocaleString()}</b></div>
                          <div><b>Respond until: {new Date(e.timestamp + 1000 * 60 * 60 * 24 * 30).toLocaleString()}</b></div>
                          <div><b>Personal Data: {e.concernedPersonalData}</b></div>
                        </div>
                      }
                    />                        
                    <CardText>
                      <Divider/>
                      <div style={{margin: "20px 0px"}}>{e.text}</div>
                      <Divider/>
                    </CardText>
                    <CardActions style={{textAlign: "right"}}>
                      <FlatButton
                        label="Send message"
                        icon={<SendIcon/>}
                        secondary={true}
                        onClick={() => {}}
                      />
                      <FlatButton
                        label="Decline"
                        icon={<DeclineIcon/>}
                        secondary={true}
                        onClick={() => {}}
                      />
                      <FlatButton
                        label="Approve"
                        icon={<ApproveIcon/>}
                        primary={true}
                        onClick={() => {}}
                      />
                    </CardActions>
                  </Card> 
                </div>
              )
            })
        }
      </div>
    )
  }
}

export default DpoView;