import React, { useState } from "react";
import "../../css/Login.css";
import LoginSvg from "../../assets/login.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

export default function Login(props) {
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordToggle, setPasswordToggle] = useState(true);

  let emailChange = (e) => {
    setEmail(e.target.value);
  };

  let passwordChange = (e) => {
    setPassword(e.target.value);
  };

  let togglePassword = (e) => {
    setPasswordToggle(!passwordToggle);
  };

  let loginFunction = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      let { data } = await axios.post(
        process.env.REACT_APP_API_URL + "/api/login",
        {
          username: email,
          password: password,
        }
      );
      props.onLogin(data);
      setLoader(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data);
      }
      setLoader(false);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <div className="login-image">
          <img src={LoginSvg} className="img-fluid" alt="Login" />
        </div>
        <div className="login-div">
          <div className="h2 text-center">Login</div>
          <form onSubmit={loginFunction}>
            <div className="form-group">
              <label htmlFor="email">
                Email address<sup className="text-danger">*</sup>
              </label>
              <input
                type="email"
                className={
                  error && error["username"]
                    ? "border-danger form-control"
                    : "form-control"
                }
                placeholder="Enter email"
                autoFocus
                autoComplete="off"
                value={email}
                id="email"
                onChange={emailChange}
              />
              <small
                className={
                  error ? "text-sm text-danger" : "d-none text-sm text-danger"
                }
              >
                {error && error["username"]}
              </small>
            </div>
            <label htmlFor="password">
              Password<sup className="text-danger">*</sup>
            </label>
            <div className="input-group">
              <input
                type={passwordToggle ? "password" : "text"}
                className={
                  error && error["password"]
                    ? "border-danger form-control"
                    : "form-control"
                }
                placeholder="Enter password"
                value={password}
                id="password"
                onChange={passwordChange}
              />
              <div
                className="input-group-append cursor-pointer"
                onClick={togglePassword}
              >
                <span className="input-group-text">
                  {passwordToggle ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <small
              className={
                error ? "text-sm text-danger" : "d-none text-sm text-danger"
              }
            >
              {error && error["password"]}
            </small>
            <div className="text-center mt-4">
              <button
                type="submit"
                disabled={loader}
                className="btn btn-md login-btn text-white"
              >
                Submit&nbsp;
                {loader ? (
                  <div
                    className="spinner-border text-white spinner-border-sm"
                    role="status"
                  ></div>
                ) : (
                  ""
                )}
              </button>
            </div>
            <div className="text-center mt-4">
              <h6 onClick={props.onRegisterClick}>
                Don't have account?&nbsp;
                <span className="action-text">Create account</span>
              </h6>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
