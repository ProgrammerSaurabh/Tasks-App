import React from "react";
import "../../css/Task.css";
import { FaEdit, FaTrash, FaCheck, FaCheckCircle } from "react-icons/fa";
import moment from "moment";
import useToken from "../../helpers/useToken";

function Task(props) {
  const { getUser } = useToken();

  const user = getUser();

  return (
    <div className="task">
      <div className="task-detail">
        <h4>{props.task.title}</h4>
        <p className="task-user">
          <small className="text-muted">Assigned to:</small>
          &nbsp;{props.task.user.name}
        </p>
        <p className={props.task.status === 1 ? "d-none" : "task-user"}>
          <small className="text-muted">Due date:</small>
          &nbsp;
          <small>
            {moment(props.task.due_date).format("DD/MM/YYYY hh:mm A")}
          </small>
        </p>
        <p className={props.task.status === 1 ? "task-user" : "d-none"}>
          <small className="text-muted">Completed on:</small>
          &nbsp;
          <small>
            {moment(props.task.updatedAt).format("DD/MM/YYYY hh:mm A")}
          </small>
        </p>
      </div>
      <div className="task-action">
        <span
          className={
            props.task.status === 0 && props.task.user.id === user.id
              ? "text-primary h5 cursor-pointer pr-2"
              : "d-none"
          }
          onClick={() => {
            props.onEditTask(
              props.task.title,
              props.task.description,
              props.task.due_date,
              props.task.id
            );
          }}
        >
          <FaEdit />
        </span>
        <span
          className={
            props.task.status !== 1 && props.task.user.id === user.id
              ? "text-danger h5 cursor-pointer pr-2"
              : "d-none"
          }
          onClick={() => {
            props.onDeleteTask(props.task.title, props.task.id);
          }}
        >
          {<FaTrash />}
        </span>
        <span
          className={
            props.task.status !== 1 && props.task.user.id === user.id
              ? "text-success h5 cursor-pointer"
              : "d-none"
          }
          onClick={() => {
            props.onCompleteTask(props.task.id);
          }}
        >
          {<FaCheck />}
        </span>
        <span
          className={props.task.status === 1 ? "text-success h5" : "d-none"}
        >
          {<FaCheckCircle />}
        </span>
      </div>
    </div>
  );
}

export default Task;
