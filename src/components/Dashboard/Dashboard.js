import React, { useState } from "react";
import "../../css/Dasboard.css";
export default function Dashboard() {
  const [error] = useState(null);
  const [title, setTitle] = useState("");

  let titleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className="dashboard-container">
      <div className="container mt-5">
        <h2>Add a new task</h2>
        <div className="form-group">
          <label htmlFor="title">
            Title<sup className="text-danger">*</sup>
          </label>
          <input
            type="text"
            className={
              error && error["title"]
                ? "border-danger form-control"
                : "form-control"
            }
            placeholder="Enter title"
            autoFocus
            value={title}
            id="email"
            onChange={titleChange}
          />
          <small
            className={
              error ? "text-sm text-danger" : "d-none text-sm text-danger"
            }
          >
            {error && error["title"]}
          </small>
        </div>
      </div>
    </div>
  );
}
