import React, {Component} from "react";
import { generateRandomKey } from "../../../AppContainer";
import Card from "material-ui/Card";
import CardHeader from "material-ui/Card/CardHeader";
import CardText from "material-ui/Card/CardText";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import Helper from 'material-ui/svg-icons/action/help-outline';

class Controller extends Component {

  state = {
    expanded: [],
  }

  render() {
    if (this.props.application === null ||
        typeof this.props.application.controllerInfo === "undefined") {
      return (<div></div>);
    }

    return (
      <div style={{marginTop: "20px"}}>

        <div className="row">
          <div className="col-12">
            <h4>
              <span className="headline">Controller(s): </span>
              <IconButton
                tooltip={
                  <span>
                    ‘Controller’ means the natural or legal person, public authority, agency or other body which, <br/>
                    alone or jointly with others, determines the purposes and means of the processing of personal <br/>
                    data; where the purposes and means of such processing are determined by Union or Member State <br/>
                    law, the controller or the specific criteria for its nomination may be provided <br/>
                    for by Union or Member State law.
                  </span>
                }
                tooltipPosition="bottom-right"
                tooltipStyles={{fontSize: "16px", padding: "16px"}}
                iconStyle={{marginTop: "-12px"}}
              >
                <Helper/>
              </IconButton>
            </h4>
          </div>            
          {this.props.application.controllerInfo.filter((e) => e.controller).map((e) => renderEntity(e))}
        </div>

        <div className="row">
          <div className="col-12">
            <h4>
              <span className="headline">Processor(s): </span>
              <IconButton
                tooltip={
                  <span>
                    'Processor’ means a natural or legal person, public authority, agency or other <br />
                    body which processes personal data on behalf of the controller;
                  </span>
                }
                tooltipPosition="bottom-right"
                tooltipStyles={{fontSize: "16px", padding: "16px"}}
                iconStyle={{marginTop: "-12px"}}
              >
                <Helper/>
              </IconButton>              
            </h4>
          </div>            
          {this.props.application.controllerInfo.filter((e) => !e.controller).map((e) => renderEntity(e))}
        </div>
      </div>
    )
  }
}

function renderEntity(entity) {

  return (
    <div className="col-12" key={generateRandomKey()}>                  
      <Card className="custom-card">
        <CardHeader
          title={<div className="row">
            <div className="col-12">
              <h4>
                {entity.legalName}
                <IconButton
                  tooltip={
                    <span>
                      {entity.role}
                    </span>
                  }
                  tooltipPosition="bottom-center"
                  tooltipStyles={{fontSize: "16px", padding: "16px"}}
                  iconStyle={{marginTop: "-12px"}}
                >
                  <Helper/>
                </IconButton>
              </h4>
            </div>
          </div>}
          subtitle={<span>{entity.description.split(" ").slice(0, 30).join(" ")} ... - <b>Learn more.</b></span>}
          showExpandableButton={true}
          actAsExpander={true}
        />
        <CardText
          expandable={true}>
          <Divider />
          <div className="col-8 offset-2 text-center">
              <img 
                className="img-fluid" 
                src={entity.logo} 
                title={entity.legalName} 
                alt={entity.legalName} 
                style={{padding: "20px"}}
              />
            </div>
          <div className="col-12">
            {entity.description}
          </div>
          <div className="col-12">
            <table className="table table-hover table-responsive" style={{marginTop: "20px"}}>
              <tbody>
                <tr>
                  <td>Website:</td>
                  <td>
                    <a href={entity.website} title={entity.website} target="_blank" rel="noopener noreferrer">
                      {entity.website}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>E-Mail:</td>
                  <td>
                    <a href={"mailto:" + entity.contactEmail} title={entity.contactEmail} target="_blank" rel="noopener noreferrer">
                      {entity.contactEmail}
                    </a>                        
                  </td>
                </tr>
                <tr>
                  <td>Privacy policy:</td>
                  <td>
                    <a href={entity.privacyPolicy} title={entity.privacyPolicy} target="_blank" rel="noopener noreferrer">
                      {entity.privacyPolicy}
                    </a>                        
                  </td>
                </tr>
                <tr>
                  <td>Data protection officer:</td>
                  <td>
                    {
                      Object.values(entity.dpoContact)
                        .filter((e) => (typeof e !== "undefined" && e !== null && e !== ""))
                        .map((e) => {
                          if (e.startsWith("http")) {
                            return <span key={generateRandomKey()}><a href={e} title={e} target="_blank" rel="noopener noreferrer">{e}</a><br/></span>;
                          } else {
                            return <span key={generateRandomKey()}>{e}<br/></span>;
                          }
                        })
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardText>
      </Card>    
    </div>
  )
}

export default Controller;