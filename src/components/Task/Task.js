import React from "react";
import "../../css/Task.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function Task(props) {
  return (
    <div className="task">
      <div className="task-detail">
        <h4>{props.task.title}</h4>
        <p className="task-user">
          <small className="text-muted">Created by</small>
          &nbsp;{props.task.user.name}
        </p>
      </div>
      <div className="task-action">
        <span
          className={
            props.task.status === 0
              ? "text-primary h5 cursor-pointer pr-2"
              : "d-none"
          }
          onClick={() => {
            props.onEditTask(
              props.task.title,
              props.task.description,
              props.task.id
            );
          }}
        >
          <FaEdit />
        </span>
        <span
          className={
            props.task.status !== 1 ? "text-danger h5 cursor-pointer" : "d-none"
          }
          onClick={() => {
            props.onDeleteTask(props.task.title, props.task.id);
          }}
        >
          {<FaTrash />}
        </span>
      </div>
    </div>
  );
}

export default Task;
