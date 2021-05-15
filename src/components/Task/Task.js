import React from "react";

function Task({ task }) {
  return (
    <div className="task">
      <div>
        <h2>{task.title}</h2>
      </div>
    </div>
  );
}

export default Task;
