import React from "react";
import "./App.scss";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import SignUp from "./components/signup/Signup";

function App() {
  return (
    <div className="container">
      {/* <Login /> */}
      {/* <SignUp /> */}
      <Profile />
    </div>
  );
}

export default App;
