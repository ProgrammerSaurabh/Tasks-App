import React, { useState } from "react";
import "../../css/Login.css";
import RegisterSvg from "../../assets/register.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

export default function Register(props) {
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [passwordToggle, setPasswordToggle] = useState(true);
  const [confirmpasswordToggle, setConfirmPasswordToggle] = useState(true);

  let nameChange = (e) => {
    setName(e.target.value);
  };

  let emailChange = (e) => {
    setEmail(e.target.value);
  };

  let passwordChange = (e) => {
    setPassword(e.target.value);
  };

  let confirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  let togglePassword = (e) => {
    setPasswordToggle(!passwordToggle);
  };

  let toggleConfirmPassword = (e) => {
    setConfirmPasswordToggle(!confirmpasswordToggle);
  };

  let registerFunction = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      await axios.post(process.env.REACT_APP_API_URL + "/api/register", {
        name: name,
        username: email,
        password: password,
        confirm_password: confirm_password,
      });
      setLoader(false);
      props.onRegistered();
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
          <img src={RegisterSvg} className="img-fluid" alt="Register" />
        </div>
        <div className="login-div">
          <div className="h2 text-center">Register</div>
          <form onSubmit={registerFunction}>
            <div className="form-group">
              <label htmlFor="name">
                Name<sup className="text-danger">*</sup>
              </label>
              <input
                type="text"
                className={
                  error && error["name"]
                    ? "border-danger form-control"
                    : "form-control"
                }
                autoFocus
                autoComplete="false"
                placeholder="Enter name"
                value={name}
                id="name"
                onChange={nameChange}
              />
              <small
                className={
                  error ? "text-sm text-danger" : "d-none text-sm text-danger"
                }
              >
                {error && error["name"]}
              </small>
            </div>
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
                value={email}
                autoComplete="false"
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
            <label htmlFor="confirm_password" className="mt-3 d-block">
              Confirm Password<sup className="text-danger">*</sup>
            </label>
            <div className="input-group">
              <input
                type={confirmpasswordToggle ? "password" : "text"}
                className={
                  error && error["confirm_password"]
                    ? "border-danger form-control"
                    : "form-control"
                }
                placeholder="Enter confirm password"
                value={confirm_password}
                id="confirm_password"
                onChange={confirmPasswordChange}
              />
              <div
                className="input-group-append cursor-pointer"
                onClick={toggleConfirmPassword}
              >
                <span className="input-group-text">
                  {confirmpasswordToggle ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <small
              className={
                error ? "text-sm text-danger" : "d-none text-sm text-danger"
              }
            >
              {error && error["confirm_password"]}
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
                Already have account?&nbsp;
                <span className="action-text">Login</span>
              </h6>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
