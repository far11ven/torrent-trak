import React, { Component } from "react";
import axios from "axios";
import TrackerItem from "./tracker-item";
import Config from "../config";

class Home extends Component {
  state = {
    newTrackerName: "",
    trackerList: []
  };

  componentDidMount() {
    this.handleGetTracker();
  }

  handleGetTracker() {
    axios.get(Config.API.GET_TRACKER).then(response => {
      let newTrackerItems = this.state.trackerList.splice();
      newTrackerItems = newTrackerItems.concat(response.data.result);
      this.setState({ trackerList: newTrackerItems });
    });
  }

  handleDeleteTracker = (id) => {
    const queryParams = new URLSearchParams();
    queryParams.append('tracker_id', id);

    var headers = {
      "Content-Type": "application/json"
    };

    axios
    .delete(Config.API.DELETE_TRACKER, { params: queryParams, headers: headers })
    .then(response => {
      console.log("DELETE respose", response);
      if (response.status === 200) {
        this.handleGetTracker(); //refetches updated list
        this.showToastMessage("Topic Deleted successfully!!");
      }
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    const postBody = JSON.stringify({
      name: this.state.newTrackerName
    });
    var headers = {
      "Content-Type": "application/json"
    };

    axios
      .post(Config.API.SAVE_TRACKER, postBody, { headers: headers })
      .then(response => {
        console.log("POST respose", response);
        if (response.status === 200) {
          this.handleGetTracker(); //refetches updated list
          this.showToastMessage("Topic saved successfully!!");
        }
      });
  };

  showToastMessage(msg) {
    document.getElementById("toast").innerHTML = msg;
    document.getElementById("toast").style.display = "inline";

    setTimeout(function() {
      document.getElementById("toast").style.display = "none";
    }, 6000);
  }

  handleInputChange = event => {
    this.setState({ newTrackerName: event.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <input
              className="m-2"
              onChange={this.handleInputChange}
              type="text"
              name="title"
              placeholder="Add a tracker.."
            />
            <button
              className="btn btn-primary btn-sm m-2"
              disabled={!this.state.newTrackerName}
              type="submit"
            >
              {" "}
              Save Topic{" "}
            </button>
          </form>

          <div
            id="toast"
            className="item-body m-2"
            style={{
              padding: "2px",
              backgroundColor: "lightgreen",
              border: "1px black solid",
              display: "none"
            }}
          >
            {" "}
          </div>

          {this.state.trackerList.map(item => {
            return <div className = "p-2 mx-auto" key={item._id}>
               <button className="btn btn-primary" onClick={() => this.handleDeleteTracker(item._id)}> X </button>
              <TrackerItem item={item}/>
              </div>
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
