import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dashboard from "../src/components/Dashboard/Dashboard";
import Login from "../src/components/Login/Login";
import Register from "../src/components/Register/Register";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import useToken from "./helpers/useToken";

function App() {
  const { token, saveToken, clearData } = useToken();
  const [register, setRegister] = useState(false);

  let toggleRegister = () => {
    setRegister(!register);
  };

  let logout = () => {
    clearData();
    window.location.reload();
  };

  let saveToken_ = (data) => {
    saveToken(data);
  };

  if (!token) {
    if (register) {
      return (
        <Register
          onRegisterClick={toggleRegister}
          onRegistered={toggleRegister}
        />
      );
    }
    return (
      <div>
        <Login onLogin={saveToken_} onRegisterClick={toggleRegister} />
      </div>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <Dashboard onLogout={logout} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
