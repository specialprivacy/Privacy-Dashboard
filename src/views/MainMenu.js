import React, {Component} from "react";

import List from "material-ui/List";
import ListItem from "material-ui/List/ListItem";
import Subheader from "material-ui/Subheader";
import Card from "material-ui/Card";
import CardText from "material-ui/Card/CardText";
import Tabs from "material-ui/Tabs";
import Tab from "material-ui/Tabs/Tab";
import Badge from "material-ui/Badge";
import Divider from "material-ui/Divider";

import "../styles/MainMenu.css";

import Startpage from "material-ui/svg-icons/action/home";
import MyProfile from "material-ui/svg-icons/action/account-circle";
import Controller from "material-ui/svg-icons/communication/business";
import MyData from "material-ui/svg-icons/action/assignment-ind";
import Log from "material-ui/svg-icons/action/list";
import Permissions from "material-ui/svg-icons/action/gavel";
import BackIcon from "material-ui/svg-icons/navigation/arrow-back";
// import Help from "material-ui/svg-icons/action/help";
// import Faq from "material-ui/svg-icons/communication/live-help";
import ExitToApp from "material-ui/svg-icons/action/exit-to-app";

import { generateRandomKey, backToAppUrl, apiKey } from "../AppContainer";

class MainMenu extends Component {

  render() {
    const startHash = "#start"
    const tabStyle = {
      background: "white", 
      width: "auto", 
      padding: "0 20px", 
      color: "black", 
      borderRadius: "0 0 10px 10px", 
      border: "0 2px 2px 0 solid lightgrey"
    };

    var router = [{
      name: "About", 
      entries: [
        {label: "My profile", icon: <MyProfile/>, hash: "#profile", badge: false},
        {label: (this.props.application === null) ? "About": "About " + this.props.application.name, icon: <Controller />, hash: "#controller", badge: false},
    ]}, {
      name: "My personal data",
      entries: [
        {label: "My data", icon: <MyData/>, hash: "#data", badge: false},
        {label: "My activity log", icon: <Log/>, hash: "#log", badge: false},
        {label: "My permissions", icon: <Permissions/>, hash: "#permissions", badge: false},
    ]}, /*{
      name: "Guide",
      entries: [
        {label: "Help", icon: <Help/>, hash: "#help", badge: false},
        {label: "FAQ", icon: <Faq/>, hash: "#faq", badge: false},
    ]}*/]

    if (apiKey === "38895e56-554f-4ca0-ab1c-4716482d2882") {
      router[0].entries.push({label: "Go to MyProximus", icon: <ExitToApp/>, href: "https://www.proximus.be/login", badge: false})
    }

    return (
      <div id="main-menu">
        <Card className="d-none d-lg-block d-xl-block">
          <CardText>
            <List>
              {
                (backToAppUrl) ? 
                  <ListItem
                    leftIcon={<BackIcon/>}
                    primaryText="Back to app"
                    onClick={() => window.location.href = backToAppUrl}
                    style={{borderRadius: "20px"}}
                  /> :
                  <div></div>
              }
              <ListItem
                leftIcon={<Startpage/>}
                primaryText="Home"
                onClick={() => window.location.hash = startHash}
                style={{borderRadius: "20px"}}
              />
              {
                router.map((group) => {
                  return (
                    <div key={generateRandomKey()}>
                      <Subheader>{group.name}</Subheader>
                      <Divider/>
                      {
                        group.entries.map((entry) => {
                          return (
                            <ListItem
                              key={generateRandomKey()}
                              leftIcon={entry.icon}
                              primaryText={entry.label}
                              rightIcon={(entry.badge) ? <Badge badgeContent="!" primary={true}/> : <span></span>}
                              onClick={() => {
                                if (entry.hasOwnProperty("hash")) {
                                  window.location.hash = entry.hash;
                                } else if (entry.hasOwnProperty("href")) {
                                  window.location.href = entry.href;
                                }
                              }}
                              style={{borderRadius: "20px"}}
                            />
                          )
                        })
                      }
                    </div>     
                  )
                })
              }
            </List>
          </CardText>
        </Card>

        <Tabs 
          ref="tabs"
          className="d-block d-lg-none d-xl-none" 
          style={{overflowX: "scroll"}}
          tabItemContainerStyle={{background: "#fff"}}
          inkBarStyle={{display: "none"}}>
            <Tab 
              icon={<Startpage/>}
              label="Home"
              onActive={(tab) => {window.location.hash = startHash;}}
              style={tabStyle}
            />
          {
            router.map((group) => {
              return group.entries.map((entry) => {
                return (
                  <Tab 
                    key={generateRandomKey()}
                    icon={entry.icon}
                    label={entry.label} 
                    onActive={(tab) => {window.location.hash = entry.hash;}}
                    style={tabStyle}
                  />
                )
              })
            })
          }
        </Tabs>
      </div>
    );
  };
}

export default MainMenu;
