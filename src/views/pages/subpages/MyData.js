import React, {Component} from "react";
import MapView from "./MapView";
import TvView from "./TvView";
import BrowsingView from "./BrowsingView";
// import Divider from "material-ui/Divider";


class MyData extends Component {

  state = {
  }

  render() {
    var hasLocationData = (this.props.data.filter((e) => (e.data === "http://www.specialprivacy.eu/vocabs/data#Location")).length > 0);
    var hasTVData = (this.props.data.filter((e) => (e.data === "http://www.specialprivacy.eu/vocabs/data#AudiovisualActivity")).length > 0);
    var hasBrowsingData = (this.props.data.filter((e) => (e.data === "http://www.specialprivacy.eu/vocabs/data#OnlineActivity")).length > 0);

    return (
      <div className="row">
        <div className="col-12">

          {
            (hasLocationData) ? 
              <MapView 
                data={this.props.data} 
                interestProfile={this.props.interestProfile} 
                menu={this.props.menu}
              /> : 
              <div></div>
          }
          
          {
            (hasTVData) ? 
              <TvView 
                data={this.props.data} 
                interestProfile={this.props.interestProfile} 
                menu={this.props.menu}
              /> : 
              <div></div>
          }
          
          {
            (hasBrowsingData) ? 
              <BrowsingView 
                data={this.props.data} 
                interestProfile={this.props.interestProfile} 
                menu={this.props.menu}
              /> : 
              <div></div>
          }

        </div>
      </div>
    )
  }
}

export default MyData;