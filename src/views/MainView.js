import React, {Component} from "react";
import Card from "material-ui/Card/Card";
import CardText from "material-ui/Card/CardText";
import AppBar from "material-ui/AppBar";
import Divider from "material-ui/Divider";
import "../styles/MainView.css";
import StartpageIcon from "material-ui/svg-icons/action/home";
import MyProfileIcon from "material-ui/svg-icons/action/account-circle";
import ControllerIcon from "material-ui/svg-icons/communication/business";
import MyDataIcon from "material-ui/svg-icons/action/assignment-ind";
import LogIcon from "material-ui/svg-icons/action/list";
import PermissionsIcon from "material-ui/svg-icons/action/gavel";
import HelpIcon from "material-ui/svg-icons/action/help";
import FaqIcon from "material-ui/svg-icons/communication/live-help";
import Startpage from "./Startpage";
import MyProfile from "./pages/subpages/MyProfile";
import Controller from "./pages/subpages/Controller";
import MyData from "./pages/subpages/MyData";
import ActivityLog from "./pages/subpages/ActivityLog";
import Permissions from "./pages/subpages/Permissions";
import Help from "./pages/subpages/Help";
import Faq from "./pages/subpages/Faq";
import DpoView from "./pages/subpages/DpoView";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import ContentCreate from "material-ui/svg-icons/content/create";
import ContentClear from "material-ui/svg-icons/content/clear";
import PanTool from "material-ui/svg-icons/action/pan-tool";
import MessageDialog from "../views/dialogs/MessageDialog";
import Snackbar from "material-ui/Snackbar";
import { event2text, instanceDataToText } from "../util/VocabLabelsGenerator";

class MainView extends Component {

  state = {
    snackbarOpen: false,
    snackbarMessage: "",

    messageOpen: false,
    messageSubject: -1,
    messageText: "",
    messageLogEntry: null,
    messageOkCallback: null,
    messageCancelCallback: null,
  }

  componentDidMount() {
    const self = this;
    window.onhashchange = () => {self.forceUpdate()}
  }

  toggleMessage = (type, logEntry, e, okCallback, cancelCallback) => {
    var okFn = () => {}
    var cnFn = okFn;
    if (typeof okCallback !== "undefined") {
      okFn = okCallback;
    }
    if (typeof cancelCallback !== "undefined") {
      cnFn = cancelCallback;
    }

    this.setState({
      messageOpen: true, 
      messageSubject: type,
      messageText: this.formulateMessage(type, logEntry),
      messageLogEntry: logEntry,
      messageOkCallback: okFn,
      messageCancelCallback: cnFn
    });
  };

  handleMessageDialog = () => {
    this.setState({messageOpen: false});
  };

  toggleSnackbar = (message) => {
    this.setState({snackbarOpen: true, snackbarMessage: message})
  }

  handleSnackbar = () => {
    this.setState({snackbarOpen: false});
  }

  formulateMessage = (sw, logEntry) => {
      var content = "Please respond to this request within one month (" + new Date(Date.now() + 2592000000).toDateString() + ") according to the General Data Protection Regulation Article 12(3).";
      switch (sw) {
          case 0:
            content = 
              "I hereby give consent in compliance with the General Data Protection Regulation Article 6(1) for the following processing of my personal data: "
              + "\r\n\r\n"
              + event2text(logEntry, "policy", false, true);
            break;        
          case 1:
            content = 
              "I hereby withdraw consent prior given for the permission seen below according to the General Data Protection Regulation Article 7(3)." 
              + "\r\n\r\n"
              + event2text(logEntry, "policy", false, true) 
              + "\r\n\r\n"
              + content;
            break;
          case 2:
            content = 
              "I hereby request rectification of my personal data (seen below) according to the General Data Protection Regulation Article 16." 
              + "\r\n\r\n"
              + event2text(logEntry, "", false, true) 
              + "\r\n\r\n"
              + instanceDataToText(logEntry.instanceData)
              + "\r\n\r\n"
              + content;
            break;
          case 3:
            content = "I hereby request erasure of my personal data (seen below) according to the General Data Protection Regulation Article 17." 
            + "\r\n\r\n"
            + event2text(logEntry, "", false, true) 
            + "\r\n\r\n"
            + instanceDataToText(logEntry.instanceData)
            + "\r\n\r\n"
            + content;
            break;
          default:
            content = "";
            break;
      }
      return content;
  };  

  GdprActionsMenu = (logEntry) => {
    return (
      <IconMenu
        iconButtonElement={<IconButton style={{marginTop: "-12px", marginRight: "-12px"}}><MoreVertIcon/></IconButton>}
        style={{position: "absolute", top: "12px", right: "12px"}}
        targetOrigin={{horizontal: "right", vertical: "bottom"}}
        anchorOrigin={{horizontal: "right", vertical: "bottom"}}
        useLayerForClickAway={true}>
        {/*<MenuItem leftIcon={<PanTool/>} onClick={this.toggleMessage.bind(null, 1, logEntry)}>Withdraw consent</MenuItem>*/}
        {/*<MenuItem leftIcon={<ContentCreate/>} onClick={this.toggleMessage.bind(null, 2, logEntry)}>Rectify</MenuItem>*/}
        <MenuItem leftIcon={<ContentClear/>} onClick={this.toggleMessage.bind(null, 3, logEntry)}>Erase</MenuItem>
      </IconMenu>
    )
  }

  render() {
    const pages = {
      "#profile": { 
        title: "My profile", 
        element: <MyProfile interestProfile={this.props.interestProfile} menu={this.GdprActionsMenu} />, 
        icon: <MyProfileIcon /> 
      },
      "#controller": { 
        title: (this.props.application === null) ? "About" : "About " + this.props.application.name, 
        element: <Controller application={this.props.application} />, 
        icon: <ControllerIcon /> 
      },
      "#data": { 
        title: "My personal data", 
        element: <MyData data={this.props.data} interestProfile={this.props.interestProfile} menu={this.GdprActionsMenu} />, 
        icon: <MyDataIcon /> 
      },
      "#log": { 
        title: "Activity log", 
        element: <ActivityLog data={this.props.data} 
        application={this.props.application} />, 
        icon: <LogIcon /> 
      },
      "#permissions": { 
        title: "Permissions & policies", 
        element: <Permissions policies={this.props.policies} toggleMessage={this.toggleMessage} formulateMessage={this.formulateMessage} />, 
        icon: <PermissionsIcon /> 
      },
      "#help": { 
        title: "Help", 
        element: <Help />, 
        icon: <HelpIcon /> 
      },
      "#faq": { 
        title: "Frequently asked questions", 
        element: <Faq />, 
        icon: <FaqIcon /> 
      },
      "#dpo": { 
        title: "Data Protection Officer view", 
        element: <DpoView />, 
        icon: <FaqIcon /> 
      },
    };

    var page = {title: "Home", element: <Startpage pages={pages}/>, icon: <StartpageIcon/>}
    if (pages.hasOwnProperty(window.location.hash)) {
      page = pages[window.location.hash];
    }

    return (
      <div>
        <AppBar
          className="md-up-appbar"
          title={(this.props.application === null) ? "": <span>{this.props.application.name} - Privacy Settings</span>}
          showMenuIconButton={false}
          iconElementRight={this.props.appBarMenu}
        />
        <Card containerStyle={{paddingBottom: "0px"}}>
          <CardText id="content-container" style={{paddingBottom: "0px"}}>
            <h4><span className="headline">{page.icon}{page.title}</span></h4>
            <Divider/>
            <div className="row">
              <div className="col-12">
                {page.element}
              </div>
            </div>
          </CardText>
       </Card>
       <MessageDialog
          messageOpen={this.state.messageOpen}
          subject={this.state.messageSubject}
          text={this.state.messageText}
          handleMessageDialoge={this.handleMessageDialog}
          toggleSnackbar={this.toggleSnackbar}
          messageLogEntry={this.state.messageLogEntry}
          okCallback={this.state.messageOkCallback}
          cancelCallback={this.state.messageCancelCallback}
          addToData={this.props.addToData}
        />
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackbar}
        />        

        {/* TODO: update links, push things to GitHub special group */}
        <div id="footer">
          <p>
            <img src="https://www.specialprivacy.eu/images/ressources/EU_logos/eu.jpg" alt=""/>
          </p>
          <p>
            This project received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement
            <a title="Cordis Europa" href="http://cordis.europa.eu/project/rcn/206343_en.html" rel="noopener noreferrer" target="_blank">&nbsp;No. 731601</a>
          </p>
          <p>
            <a href="https://www.specialprivacy.eu/legal-notice" rel="noopener noreferrer" target="_blank">Legal Notice</a> | 
            <a href="https://www.specialprivacy.eu/privacy-policy" rel="noopener noreferrer" target="_blank">&nbsp;Privacy Policy</a>
          </p>
          <div style={{textAlign: "center"}}>
            <h5>Documentation and reporting:</h5>
              <p>
                <b>D4.1 Transparency dashboard and control panel release V1 (M16)</b> |&nbsp;
                <a href="https://www.specialprivacy.eu/images/documents/SPECIAL_D4.1_M16_V1.0.pdf">Report</a> |&nbsp;
                <a href="http://raschke.cc/SPECIAL-privacy-dashboard-V1/">Demo</a> |&nbsp;
                <a href="">Source code</a>
              </p>
              <p>
                <b>D4.2 Usability testing report V1 (M18)</b> |&nbsp;
                <a href="https://www.specialprivacy.eu/images/documents/SPECIAL_D4.2_M18_V1.0.pdf">Report</a> |&nbsp;
              </p>
              <p>
                <b>D4.3 Transparency dashboard and control panel release V2 (M25)</b> |&nbsp;
                <a href="https://www.specialprivacy.eu/images/documents/SPECIAL_D43_M25_V10.pdf">Report</a> |&nbsp;
                <a href="http://dashboard.specialprivacy.eu/">Demo</a> |&nbsp;
                <a href="">Source code</a>
              </p>
              <p>
                <b>D4.4 Usability testing report V2 (M27)</b> |&nbsp;
                <a href="https://www.specialprivacy.eu/images/documents/SPECIAL_D44_M27_V10.pdf">Report</a> |&nbsp;
              </p>
              <p>
                <b>D4.5 Transparency dashboard and control panel release final release (M35)</b> |&nbsp;
                <a href="">Report</a> |&nbsp;
                <a href="">Demo</a> |&nbsp;
                <a href="">Source code</a>
              </p>
          </div>
        </div>
      </div>
    );
  }
}

export default MainView;
