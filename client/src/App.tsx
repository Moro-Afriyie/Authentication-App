import React from "react";
import "./App.scss";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import SignUp from "./components/signup/Signup";
import { Routes, Route } from "react-router-dom";
import ProfileDetails from "./components/profileDetails/ProfileDetails";
import EditProfile from "./components/editProfile/EditProfile";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Profile />}>
          {/* <Route path=":username" element={<ProfileDetails />} /> */}
          <Route index element={<ProfileDetails />} />
          <Route path="/username" element={<ProfileDetails />} />
          <Route path="settings/profile" element={<EditProfile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
