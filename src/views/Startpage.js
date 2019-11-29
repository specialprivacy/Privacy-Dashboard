import React, {Component} from "react";
import "../styles/Startpage.css";
import Card from "material-ui/Card";
import CardText from "material-ui/Card/CardText";
import Divider from "material-ui/Divider";
import { theme } from "../AppContainer";

class Startpage extends Component {

  render() {
    const iconStyle = {
      fill: theme.palette.accent1Color,
    }

    return (
      <div>
        <div className="row">
          <div className="col-12">
            
            <div>
              <Card 
                className="custom-card" 
                style={{marginTop: "20px"}}
                containerStyle={{paddingBottom: "0px"}}>
                <CardText style={{paddingBottom: "0px"}}>
                  <div className="row">
                    <div className="col-md-5">
                      <img className="img-fluid" src="images/service-data.svg" alt=""/>
                    </div>
                    <div className="col-md-7">
                      <h5>Check the data you provided us with!</h5>
                      <Divider style={{marginTop: "10px", marginBottom: "10px"}}/>
                      <p>You had to disclose certain personal information when signing up for this service.
                      This dashboard helps you to manage the information you provided us with when signing up for the service.</p>
                      <p style={{marginBottom: "0"}}>This information might be:</p>
                      <ul>
                        <li>email address, username and password.</li>
                        <li>real name and physical address</li>
                        <li>date of birth.</li>
                        <li>bank account information.</li>
                      </ul>
                    </div>
                  </div>
                </CardText>
              </Card>
            </div>

            <div>
              <Card 
                className="custom-card" 
                style={{marginTop: "20px"}}
                containerStyle={{paddingBottom: "0px"}}>
                <CardText style={{paddingBottom: "0px"}}>
                  <div className="row">
                    <div className="col-md-5">
                      <img className="img-fluid" src="images/derived-data.svg" alt=""/>
                    </div>
                    <div className="col-md-7">
                      <h5>Learn about the data we process while you're using our service.</h5>
                      <Divider style={{marginTop: "10px", marginBottom: "10px"}}/>
                      <p>When using the service and interacting with its features, you produce data we process.
                      We might also use data from other data sources for the service provision. Learn all about it in this dashboard.</p>
                      <p style={{marginBottom: "0"}}>Your personal data is:</p>
                      <ul>
                        <li>processed when using this service.</li>
                        <li>obtained from other sources, e.g. services if you gave us permission.</li>
                        <li>derived from your personal data.</li>
                      </ul>
                    </div>
                  </div>
                </CardText>
              </Card>
            </div>

            <div>
              <Card 
                className="custom-card" 
                style={{marginTop: "20px"}}
                containerStyle={{paddingBottom: "0px"}}>
                <CardText style={{paddingBottom: "0px"}}>
                  <div className="row">
                    <div className="col-md-5">
                      <img className="img-fluid" src="images/permissions.svg" alt=""/>
                    </div>
                    <div className="col-md-7">
                      <h5>Understand what you agreed with!</h5>
                      <Divider style={{marginTop: "10px", marginBottom: "10px"}}/>
                      <p>Terms and conditions, privacy policies and notices over notices, you dutifully agreed.
                      Understand what you agree with and express your disagreement when necessary.</p>
                      <p style={{marginBottom: "0"}}>This dashboard allows you to:</p>
                      <ul>
                        <li>... disagree with certain processing practices, while still being able to use the service.</li>
                        <li>... give permission to process your personal data.</li>
                        <li>... revoke permission to process your personal data.</li>
                      </ul>
                    </div>
                  </div>
                </CardText>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Startpage;
