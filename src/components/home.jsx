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
    axios.get(Config.API.GET_TRACKER).then(response => {
      let newTrackerItems = this.state.trackerList.splice();
      newTrackerItems = newTrackerItems.concat(response.data.result);
      this.setState({ trackerList: newTrackerItems });
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
          this.showToastMessage(
            "Topic saved successfully!! Refresh to see updated list."
          );
        }
      });
  };

  showToastMessage(msg) {
    document.getElementById("toast").innerHTML = msg;
    document.getElementById("toast").style.display = "inline";

    setTimeout(function() {
      document.getElementById("toast").style.display = "none";
    }, 10000);
  }

  handleInputChange = event => {
    this.setState({ newTrackerName: event.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <form onSubmit={this.handleSubmit}>
            <label className="m-2">
              <input
                onChange={this.handleInputChange}
                type="text"
                name="title"
                className="m-2"
                placeholder="Add a tracker.."
              />
            </label>
            <button
              disabled={!this.state.newTrackerName}
              className="btn btn-primary btn-sm m-2"
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
            return <TrackerItem key={item._id} item={item} />;
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
