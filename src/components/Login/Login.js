import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../css/Login.css";
import LoginSvg from "../../assets/login.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login({ setToken }) {
  const [error] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordToggle, setPasswordToggle] = useState(true);

  let icon = <FaEye />;
  if (!passwordToggle) {
    icon = <FaEyeSlash />;
  }

  let emailChange = (e) => {
    setEmail(e.target.value);
  };

  let passwordChange = (e) => {
    setPassword(e.target.value);
  };

  let togglePassword = (e) => {
    setPasswordToggle(!passwordToggle);
  };

  let loginFunction = (e) => {
    e.preventDefault();
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <div className="login-image">
          <img src={LoginSvg} className="img-fluid" alt="Login" />
        </div>
        <div className="login-div">
          <div className="h2 text-center">Login</div>
          <div className={error ? "" : "d-none"}>{error}</div>
          <form onSubmit={loginFunction}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                autoFocus
                value={email}
                id="email"
                onChange={emailChange}
              />
            </div>
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <input
                type={passwordToggle ? "password" : "text"}
                className="form-control"
                placeholder="Enter password"
                value={password}
                id="password"
                onChange={passwordChange}
              />
              <div
                className="input-group-append cursor-pointer"
                onClick={togglePassword}
              >
                <span className="input-group-text">{icon}</span>
              </div>
            </div>
            <div className="text-center mt-2">
              <button type="submit" className="btn btn-md login-btn text-white">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
