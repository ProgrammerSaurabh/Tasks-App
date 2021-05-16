import "../../css/Dasboard.css";
import getAxiosHelper from "../../helpers/getAxiosHelper";
import postAxiosHelper from "../../helpers/postAxiosHelper";
import deleteAxiosHelper from "../../helpers/deleteAxiosHelper";
import putAxiosHelper from "../../helpers/putAxiosHelper";
import React, { Component } from "react";
import Task from "../Task/Task";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NoDataSvg from "../../assets/no-task.svg";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
import { Helmet } from "react-helmet";

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      error: null,
      tasks: [],
      title: "",
      description: "",
      due_date: new Date(),
      loader: false,
      token: null,
      edit: false,
      task: null,
    };
  }

  async componentDidMount() {
    try {
      let { data } = await getAxiosHelper(
        process.env.REACT_APP_API_URL + "/api/tasks"
      );

      let tasks_ = data.tasks;
      tasks_.map((task) => {
        task["due_date"] = new Date(task["due_date"]);

        return task;
      });

      this.setState({
        tasks: tasks_,
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

  dueDateChange = (date) => {
    this.setState({
      due_date: date,
    });
  };

  checkStatus = (e) => {
    e.preventDefault();

    if (!this.state["edit"]) {
      this.createTask();
      return;
    }

    this.updateTask();
  };

  createTask = async () => {
    this.setState({
      loader: true,
    });

    try {
      let { data } = await postAxiosHelper(
        process.env.REACT_APP_API_URL + "/api/tasks",
        {
          title: this.state["title"],
          description: this.state["description"],
          due_date: moment(this.state["due_date"]).format("YYYY-MM-DD HH:mm"),
        }
      );

      const tokenString = sessionStorage.getItem("token");
      const userToken = JSON.parse(tokenString);

      let createdTask = {
        id: data.task.id,
        title: data.task.title,
        description: data.task.description,
        status: 0,
        due_date: new Date(data.task.due_date),
        user: {
          id: userToken?.user?.id,
          name: userToken?.user?.name,
        },
      };

      let tasks_ = [createdTask, ...this.state["tasks"]];

      this.setState({
        tasks: tasks_,
        title: "",
        description: "",
        due_date: new Date(),
        loader: false,
      });

      toast("Task created successfully", {
        type: "success",
        delay: "2000",
        position: "top-center",
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

  deleteTask = async (title, id) => {
    if (window.confirm("Are you sure you want to delete " + title + " task")) {
      await deleteAxiosHelper(
        process.env.REACT_APP_API_URL + "/api/tasks/" + id
      )
        .then((res) => {
          let tasks_ = this.state["tasks"].filter((task) => task.id !== id);

          this.setState({
            tasks: tasks_,
          });

          toast(res.data.message, {
            type: "error",
            delay: "2000",
            position: "top-center",
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  editTask = (title, description, due_date, id) => {
    this.setState({
      title: title,
      description: description,
      due_date: due_date,
      edit: true,
      task: id,
    });
  };

  completeTask = async (id) => {
    await putAxiosHelper(
      process.env.REACT_APP_API_URL + "/api/tasks/" + id + "/complete"
    )
      .then((res) => {
        let tasks_ = this.state["tasks"].map((task) => {
          if (task.id === id) {
            task.status = 1;
            task.updatedAt = new Date();
          }
          return task;
        });

        this.setState({
          tasks: tasks_,
        });

        toast(res.data.message, {
          type: "success",
          delay: "2000",
          position: "top-center",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  updateTask = async () => {
    this.setState({
      loader: true,
    });

    await putAxiosHelper(
      process.env.REACT_APP_API_URL + "/api/tasks/" + this.state["task"],
      {
        title: this.state["title"],
        description: this.state["description"],
      }
    )
      .then((res) => {
        toast(res.data.message, {
          type: "success",
          delay: "2000",
          position: "top-center",
        });

        let tasks_ = this.state["tasks"];

        tasks_.map((task) => {
          if (task.id === this.state["task"]) {
            task.title = this.state["title"];
            task.description = this.state["description"];
          }
          return task;
        });

        this.setState({
          tasks: tasks_,
          title: "",
          description: "",
          due_date: new Date(),
          loader: false,
          task: null,
          edit: false,
        });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          this.setState({
            error: error.response.data,
          });
        }
        this.setState({
          loader: false,
        });
      });
  };

  render() {
    return (
      <div className="dashboard-container">
        <Helmet>
          <title>
            {"Tasks (" + this.state["tasks"].length + ") - Task App"}
          </title>
        </Helmet>
        <div className="jumbotron pt-4">
          <div className="container">
            <div className="pb-3 d-flex justify-content-end align-items-center">
              <button
                type="button"
                className="btn btn-md login-btn text-white"
                onClick={this.props.onLogout}
              >
                Logout
              </button>
            </div>
            <h2>{this.state["edit"] ? "Edit task" : "Add a new task"}</h2>
            <form onSubmit={this.checkStatus}>
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
                  autoComplete="off"
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
                  autoComplete="off"
                  placeholder="Enter description"
                  value={this.state["description"]}
                  onChange={this.descriptionChange}
                  rows="2"
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
              <div>
                <label htmlFor="due-date">Due date</label>
                <div
                  className={
                    this.state["error"] && this.state["error"]["due_date"]
                      ? "task-datepicker task-error"
                      : "task-datepicker"
                  }
                >
                  <DateTimePicker
                    id="due-date"
                    onChange={this.dueDateChange}
                    value={this.state["due_date"]}
                    disabled={this.state["edit"]}
                    disableCalendar={this.state["edit"]}
                    disableClock={this.state["edit"]}
                    minDate={new Date()}
                  />
                </div>
                <small
                  className={
                    this.state["error"]
                      ? "text-sm text-danger"
                      : "d-none text-sm text-danger"
                  }
                >
                  {this.state["error"] && this.state["error"]["due_date"]}
                </small>
              </div>
              <div className="text-left mt-4">
                <button
                  type="submit"
                  disabled={this.state["loader"]}
                  className="btn btn-md login-btn text-white"
                >
                  {this.state["edit"] ? "Save" : "Create"}&nbsp;
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
        <ToastContainer />
        {this.state["tasks"].length === 0 ? (
          <div className="text-center h3 text-white py-5">
            <div className="no-data-container">
              <img src={NoDataSvg} className="img-fluid" alt="No data" />
            </div>
            <h3 className="pt-2">No tasks</h3>
          </div>
        ) : (
          <div className="container d-flex justify-content-center align-items-center flex-column">
            {this.state["tasks"].map((task) => {
              return (
                <Task
                  task={task}
                  key={task.id}
                  onDeleteTask={this.deleteTask}
                  onEditTask={this.editTask}
                  onCompleteTask={this.completeTask}
                ></Task>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default Dashboard;
