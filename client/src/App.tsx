import React from "react";
import "./App.scss";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import SignUp from "./components/signup/Signup";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <Login />
      {/* <SignUp /> */}
      {/* <Profile /> */}
    </div>
  );
}

export default App;
