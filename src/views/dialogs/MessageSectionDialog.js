import React, { Component } from "react";

import List from "material-ui/List/List";
import ListItem from "material-ui/List/ListItem";
import Subheader from "material-ui/Subheader";
import Dialog from "material-ui/Dialog";
import Divider from "material-ui/Divider";
import Avatar from "material-ui/Avatar";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import Card from "material-ui/Card/Card";
import CardHeader from "material-ui/Card/CardHeader";
import CardText from "material-ui/Card/CardText";
import Toolbar from "material-ui/Toolbar/Toolbar";
import ToolbarTitle from "material-ui/Toolbar/ToolbarTitle";
import { theme, generateRandomKey } from "../../AppContainer";

import ArrowBack from "material-ui/svg-icons/navigation/arrow-back";

class MessageSection extends Component {

  state = {
    selectedItem: 0,
  }

  xsToggleClass = (flag) => {
    if (flag) {
      this.refs["message-list"].classList.add("d-none", "d-lg-block");
      this.refs["message"].classList.remove("d-none", "d-lg-block");
    } else {
      this.refs["message-list"].classList.remove("d-none", "d-lg-block");
      this.refs["message"].classList.add("d-none", "d-lg-block");
    }
  };

  selectItem = (index) => {
    this.xsToggleClass(true);
    this.setState({ selectedItem: index });
  };

  renderListItem = (e, index) => {
    var dateObj = new Date(e.date);
    var date = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
    return (
      <ListItem
        key={generateRandomKey()}
        primaryText={e.subject}
        secondaryText={date}
        leftAvatar={<Avatar>{e.subject.slice(0, 2).toUpperCase()}</Avatar>}
        onClick={this.selectItem.bind(null, index)}
      />
    );
  };

  renderCardItem = (e) => {
    var dateObj = new Date(e.date);
    var date = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();

    return (
      <Card
        key={generateRandomKey()}
        style={{ marginBottom: "20px" }}>
        <CardHeader
          title={e.subject}
          subtitle={date}
          avatar={<Avatar>{e.subject.slice(0, 2).toUpperCase()}</Avatar>}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>{e.text}</CardText>
      </Card>
    );
  };

  render() {
    const self = this;

    var messages = this.props.data
      .filter((e) => (e.data === "http://www.specialprivacy.eu/vocabs/data#Message"))
      .map((e) => {
        return {
          subject: (typeof e.instanceData.type !== "undefined" && e.instanceData.type !== null) ? e.instanceData.type : "%SUBJECT%",
          date: (typeof e.instanceData.date !== "undefined" && e.instanceData.date !== null) ? e.instanceData.date : 0,
          text: (typeof e.instanceData.message !== "undefined" && e.instanceData.message !== null) ? e.instanceData.message : "%MESSAGE%",
          answers: (e.instanceData.hasOwnProperty("answers")) ? e.instanceData.answers : [],
        }
      });

    var unAnsweredMessages = messages.filter((e) => e.answers.length === 0);
    var answeredMessages = messages.filter((e) => e.answers.length > 0);

    return (
      <Dialog
        title={<div>Messages</div>}
        open={this.props.messageSectionOpen}
        onRequestClose={this.props.toggleMessageSectionOpen}
        autoScrollBodyContent={true}
        contentStyle={{ width: "85%", maxWidth: "none" }}
        actions={[
          <FlatButton
            label="Close"
            primary={true}
            onClick={this.props.toggleMessageSectionOpen}
          />
        ]}
      >
        <div className="row" style={{ marginTop: "20px", marginBottom: "20px" }}>
          <div ref="message-list" className="col-lg-4">
            <List
              style={{ border: "1px solid rgb(224, 224, 224)" }}
            >
              <Subheader>Pending requests</Subheader>
              <Divider />
              {
                (unAnsweredMessages.length > 0) ?
                  unAnsweredMessages
                    .sort((a, b) => b.date - a.date)
                    .map((e) => self.renderListItem(e, messages.indexOf(e)))
                :
                  <div style={{textAlign: "center", padding: "20px"}}><i>No pending messages.</i></div>
              }
              <Divider />
              <Subheader>Answered requests</Subheader>
              <Divider />
              {
                (answeredMessages.length > 0) ?
                  answeredMessages
                    .sort((a, b) => b.date - a.date)
                    .map((e) => self.renderListItem(e, messages.indexOf(e)))
                :
                  <div style={{textAlign: "center", padding: "20px"}}><i>No answered messages.</i></div>
              }
            </List>
          </div>
          <div ref="message" className="col-lg-8 d-none d-lg-block">
            {
              (messages.length > 0) ?
                <div>
                  <Toolbar
                    style={{
                      height: "48px",
                      boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px",
                      color: "white",
                      background: theme.palette.primary1Color,
                    }}>
                    <IconButton
                      tooltip="Back to messages"
                      className="d-sm-block d-lg-none"
                      onClick={this.xsToggleClass.bind(null, false)}
                    >
                      <ArrowBack />
                    </IconButton>
                    <ToolbarTitle text={
                        <span>
                          {messages[this.state.selectedItem].subject}
                          &nbsp;from {
                            new Date(messages[this.state.selectedItem].date).toLocaleDateString() 
                            + " " 
                            + new Date(messages[this.state.selectedItem].date).toLocaleTimeString()
                          }
                          <small>{(messages[this.state.selectedItem].answers.length === 0) ? " (pending)" : " (answered)"}</small>
                        </span>
                      }
                    />
                  </Toolbar>
                  {
                    messages[this.state.selectedItem]
                      .answers
                        .sort((a, b) => b.date - a.date)
                        .map(this.renderCardItem)
                  }
                  {
                    this.renderCardItem(messages[this.state.selectedItem])
                  }
                </div>
              :
                <div></div>
            }
          </div>
        </div>
      </Dialog>
    );
  }

}

export default MessageSection;