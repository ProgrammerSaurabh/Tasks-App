import "../../css/Dasboard.css";
import getAxiosHelper from "../../helpers/getAxiosHelper";
import postAxiosHelper from "../../helpers/postAxiosHelper";
// import Task from "../Task/Task";
import React, { Component, useEffect } from "react";
import Task from "../Task/Task";

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      error: null,
      tasks: [],
      title: "",
      description: "",
      loader: false,
      token: null,
    };
  }

  async componentDidMount() {
    try {
      let { data } = await getAxiosHelper(
        process.env.REACT_APP_API_URL + "/api/tasks"
      );

      this.setState({
        tasks: data.tasks,
      });
    } catch (error) {
      console.log(error);
    }
  }

  titleChange = (e) => {
    this.setState({
      title: e.target.value,
    });
  };

  descriptionChange = (e) => {
    this.setState({
      description: e.target.value,
    });
  };

  createTask = async (e) => {
    e.preventDefault();

    this.setState({
      loader: true,
    });

    try {
      let { data } = await postAxiosHelper(
        process.env.REACT_APP_API_URL + "/api/tasks",
        {
          title: this.state["title"],
          description: this.state["description"],
        }
      );

      let tasks_ = [data.task, ...this.state["tasks"]];

      this.setState({
        tasks: tasks_,
        title: "",
        description: "",
        loader: false,
      });
    } catch (error) {
      if (error.response && error.response.data) {
        this.setState({
          error: error.response.data,
        });
      }
      this.setState({
        loader: false,
      });
    }
  };

  render() {
    return (
      <div className="dashboard-container">
        <div className="jumbotron">
          <div className="container">
            <h2>Add a new task</h2>
            <form onSubmit={this.createTask}>
              <div className="form-group">
                <label htmlFor="title">
                  Title<sup className="text-danger">*</sup>
                </label>
                <input
                  type="text"
                  className={
                    this.state["error"] && this.state["error"]["title"]
                      ? "border-danger form-control"
                      : "form-control"
                  }
                  placeholder="Enter title"
                  autoFocus
                  value={this.state["title"]}
                  id="title"
                  onChange={this.titleChange}
                />
                <small
                  className={
                    this.state["error"]
                      ? "text-sm text-danger"
                      : "d-none text-sm text-danger"
                  }
                >
                  {this.state["error"] && this.state["error"]["title"]}
                </small>
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  className={
                    this.state["error"] && this.state["error"]["description"]
                      ? "border-danger form-control"
                      : "form-control"
                  }
                  placeholder="Enter description"
                  value={this.state["description"]}
                  onChange={this.descriptionChange}
                  rows="5"
                ></textarea>
                <small
                  className={
                    this.state["error"]
                      ? "text-sm text-danger"
                      : "d-none text-sm text-danger"
                  }
                >
                  {this.state["error"] && this.state["error"]["description"]}
                </small>
              </div>
              <div className="text-left mt-4">
                <button
                  type="submit"
                  disabled={this.state["loader"]}
                  className="btn btn-md login-btn text-white"
                >
                  Submit&nbsp;
                  {this.state["loader"] ? (
                    <div
                      className="spinner-border text-white spinner-border-sm"
                      role="status"
                    ></div>
                  ) : (
                    ""
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="container">
          {this.state["tasks"].map((task) => {
            return <Task task={task}></Task>;
          })}
        </div>
      </div>
    );
  }
}

export default Dashboard;
