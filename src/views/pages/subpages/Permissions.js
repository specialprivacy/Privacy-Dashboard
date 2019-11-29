import React, {Component} from "react";
import {generateRandomKey, backendUrl, defaultHeaders} from "../../../AppContainer";
import { event2text } from "../../../util/VocabLabelsGenerator";
import Toggle from "material-ui/Toggle";
import IconButton from "material-ui/IconButton";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import DataTable from "react-data-table-component";
import JSONPretty from "react-json-pretty";
import HelpIcon from "material-ui/svg-icons/action/help-outline";
import "../../../styles/Permissions.css";
import Divider from "material-ui/Divider";

var request = require("request");

class Permissions extends Component {

  state = {
    open: false,
    policy: null,
    policies: null,
  }

  syncConsent = () => {
    var options = {
      method: "post",
      url: backendUrl + "/user",
      qs: {
        attribute: "consent"
      },
      headers: defaultHeaders,
      body: this.props.policies,
      json: true,
    }
    request(options, function(err, res, body) {
      if (err) {
        return
      }
      
      if (!body.success) {
        // TODO: implement error handling
      } else {
        // console.log(body.message)
      }
    });
  }

  render() {
    if (this.props.policies === null) {
      return <div></div>;
    }

    const self = this;
    const columns = [
      { name: "Permission", selector: "permissionToggle", sortable: false, compact: true, left: true, minWidth: "100px" },
      { name: "Policy", selector: "policyText", sortable: true, compact: true, allowOverflow: false, wrap: true, grow: 4 },
      { name: "More", selector: "dialogOpener", sortable: false, compact: true, left: true, minWidth: "75px", maxWidth: "100px" },
    ];

    const ExpanableComponent = ({ data }) => <JSONPretty data={data.originalElement}></JSONPretty>;

    return (
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
              this.props.policies.dataCategories
                .map((e) => {
                  return {
                    id: generateRandomKey(),
                    dialogOpener:
                      <IconButton onClick={() => {this.setState({open: true, policy: e})}}>
                        <HelpIcon />
                      </IconButton>,
                    permissionToggle: 
                      <Toggle
                        label={(!e.consent) ? "No " : "Yes"}
                        defaultToggled={e.consent}
                        onToggle={(event, isInputChecked) => {
                          var msg = 0;
                          if (!isInputChecked) {
                            msg = 1;
                          }
                          self.props.toggleMessage(msg, e, null,
                            () => {
                              e.consent = !e.consent; 
                              self.syncConsent();
                              self.forceUpdate();  
                            }, 
                            () => {
                              // TODO: action aborted by user
                            });
                        }}
                      />,
                    policyText: event2text(e, "policy", true, false),
                    originalElement: e,
                  }
                })
            }      
          />     
        </div>
        <Dialog
          title="Learn more about this policy"
          className="policy-dialog"
          open={this.state.open}
          onRequestClose={() => {this.setState({open: false})}}
          autoScrollBodyContent={true}
          contentStyle={{ width: (window.innerWidth > 992) ? "35%" : "85%", maxWidth: "none" }}
          actions={[
            <FlatButton
              label="Close"
              primary={true}
              onClick={() => {this.setState({open: false})}}
            />
          ]}
        >
          {
            (this.state.policy === null) ? 
              <div></div> :
              <div style={{paddingTop: "20px"}}>
                <h5>Description</h5>
                <Divider/>
                <p>{event2text(this.state.policy, "policy")}</p>
                <h5>What happens if I do not consent?</h5>
                <Divider/>
                <p>
                  If you do not consent to this policy, the service provided to you might not function properly or at all.
                  &nbsp;<b>Please note: </b> When choosing to withdraw consent, personal data affected by this policy won't be deleted, 
                  if it is used for different purposes for which consent was given from you. <br/> To delete your personal data, 
                  please issue a request to erasure.
                </p>
                <h5>Which risks are involved?</h5>
                <Divider/>
                <p>
                  As for any data disclosure, risks are involved such as accidental data disclosure, 
                  unwanted disclosure of secondary information, misuse of personal data,
                  unauthorized or unwanted data sharing with third parties and so on. <br />
                  To prevent any of the above mentioned scenarios to happen, we apply state-of-the-art
                  safeguards to protect your personal data.
                </p>
              </div>
          }
        </Dialog>
      </div>
    )
  }
}

export default Permissions;
