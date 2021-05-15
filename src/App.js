import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dashboard from "../src/components/Dashboard/Dashboard";
import Login from "../src/components/Login/Login";
import Register from "../src/components/Register/Register";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import useToken from "./helpers/useToken";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { token, saveToken } = useToken();
  const [register, setRegister] = useState(false);

  let toggleRegister = (show = false) => {
    if (show) {
      toast("Registered successfully", {
        type: "success",
        delay: "2000",
        position: "top-center",
      });
    }
    setRegister(!register);
  };

  let saveToken_ = (data) => {
    saveToken(data);
  };

  if (!token) {
    if (register) {
      return (
        <Register
          onRegistered={toggleRegister}
          onRegisterClick={toggleRegister}
        />
      );
    }
    return (
      <div>
        <Login onLogin={saveToken_} onRegisterClick={toggleRegister} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
