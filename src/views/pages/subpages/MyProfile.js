import React, {Component} from "react";

import Table from "material-ui/Table";
import TableBody from "material-ui/Table/TableBody";
import TableRow from "material-ui/Table/TableRow";
import TableRowColumn from "material-ui/Table/TableRowColumn";
import Card from "material-ui/Card/Card";
import CardHeader from "material-ui/Card/CardHeader";
import CardText from "material-ui/Card/CardText";
import { apiKey, generateRandomKey } from "../../../AppContainer";
import DataTable from "react-data-table-component";

class MyProfile extends Component {
  render() {
    const self = this;

    const user = JSON.parse(atob(window.localStorage.getItem(apiKey + ":token").split(".")[1])).subject;

    const columns = [
      { name: "Keyword", selector: "keyword", sortable: false, compact: true, allowOverflow: false, wrap: true },
      { name: "", selector: "menu", sortable: false, compact: true, allowOverflow: false, wrap: true },
    ];    

    return (
      <div className="row">
        <div className="col-12">
          <Card 
            className="custom-card" 
            expandable={true} 
            style={{marginTop: "20px"}}>
            <CardHeader
              avatar="images/credentialsAvatar.png"
              showExpandableButton={true}
              title={
                <div>
                  <h4>Account credentials</h4>
                </div>
              }
              subtitle={<span>Your username (in this case: email address) and password.
              </span>}>
            </CardHeader>
            <CardText expandable={true}>
              <div className="row">
                <div className="col-12">
                  <Table selectable={false}>
                    <TableBody displayRowCheckbox={false}>
                      <TableRow>
                        <TableRowColumn>Email address:</TableRowColumn>
                        <TableRowColumn><b>{user}</b></TableRowColumn>
                      </TableRow>
                      <TableRow>
                        <TableRowColumn>Password:</TableRowColumn>
                        <TableRowColumn>***</TableRowColumn>
                      </TableRow>
                    </TableBody>
                  </Table>                
                </div>
              </div>
            </CardText>
          </Card>
          
          {
            (this.props.interestProfile) ?
              <Card 
                className="custom-card" 
                expandable={true} 
                style={{marginTop: "20px"}}>
                <CardHeader
                  avatar="images/profileAvatar.png"
                  showExpandableButton={true}
                  title={
                    <div>
                      <h4>Derived interest profile</h4>
                    </div>
                  }
                  subtitle={<span>Preferences based on your personal data
                  </span>}>
                </CardHeader>
                <CardText expandable={true}>
                  <div className="row">
                    <div className="col-12">
                      {
                        (this.props.interestProfile === null) ?
                          <div></div> :
                          this.props.interestProfile
                            .map((group) => {
                              return (
                                <DataTable
                                  key={generateRandomKey()}
                                  title={<span>Based on {group.dataCategory} information</span>}
                                  pagination={true}
                                  striped={true}
                                  highlightOnHover={true}
                                  columns={columns}
                                  data={
                                    group.keywords
                                      .map((keyword) => {
                                        return {
                                          keyword: keyword.label,
                                          menu: self.props.menu({
                                            "data": "http://www.specialprivacy.eu/vocabs/data#Profile",
                                            "purpose": "http://www.specialprivacy.eu/vocabs/purposes#Marketing",
                                            "processing": "http://www.specialprivacy.eu/vocabs/processing#Derive",
                                            "storage": "http://www.specialprivacy.eu/vocabs/locations#OurServers",
                                            "recipient": "http://www.specialprivacy.eu/vocabs/recipients#Ours",
                                            "instanceData": {
                                              keyword: keyword.label,
                                              basedOn: group.dataCategory,
                                            }                                            
                                          })
                                        };
                                      })
                                  }
                                />
                              )
                            })

                      }
                    </div>
                  </div>
                </CardText>
              </Card>
            :
              <div></div>
          }
        </div>      
      </div>
    )
  }
}

export default MyProfile;