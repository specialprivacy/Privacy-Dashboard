import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import ActionSend from "material-ui/svg-icons/content/send";
import {backendUrl, defaultHeaders} from "../../AppContainer";

var request = require("request");
const requestTypes = ["Give consent", "Withdraw consent", "Request rectification", "Request erasure", "Request data portability"];

class MessageDialog extends Component {

  sendMessage = () => {
    const self = this;
    const logEntry = {
      data: "http://www.specialprivacy.eu/vocabs/data#Message",
      purpose: "http://www.specialprivacy.eu/vocabs/purposes#Admin",
      processing: "http://www.specialprivacy.eu/vocabs/processing#Transfer",
      storage: "http://www.specialprivacy.eu/vocabs/locations#OurServers",
      recipient: "http://www.specialprivacy.eu/vocabs/recipients#Ours",
      timestamp: Date.now(),
      instanceData: {
        message: document.getElementById("textField").value,
        data: this.props.messageLogEntry,
        type: requestTypes[this.props.subject],
        typeId: this.props.subject,
        date: Date.now(),  
      },
    };

    var options = {
      method: "post",
      url: backendUrl + "/log/push/raw",
      headers: defaultHeaders,
      body: logEntry,
      json: true
    }
    request(options, function(err, res, body) {
      if (err) {
        return
      }

      if (!body.success) {
        console.log(body.message);
      } else {
        self.props.addToData(logEntry);
        console.log(body.message);
      }
      self.props.toggleSnackbar(body.message);
    });
  }

  render() {
    return (
      <Dialog
        open={this.props.messageOpen}
        onRequestClose={this.props.handleMessageDialoge}
        actions={[
          <FlatButton
            label="Cancel"
            secondary={true}
            onClick={() => {
              this.props.cancelCallback();
              this.props.handleMessageDialoge();
            }}
          />,
          <FlatButton
            label="Send request"
            icon={<ActionSend />}
            primary={true}
            onClick={() => {
              this.props.okCallback();
              this.props.handleMessageDialoge();
              this.sendMessage();
            }}
          />,
        ]}
      >
        <TextField
          id="textField"
          floatingLabelText="Message"
          multiLine={true}
          fullWidth={true}
          rows={2}
          rowsMax={7}
          defaultValue={this.props.text}
        />
      </Dialog>
    );
  }

}

export default MessageDialog;