import React from "react";
import "./App.scss";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import SignUp from "./components/signup/Signup";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfileDetails from "./components/profileDetails/ProfileDetails";
import EditProfile from "./components/editProfile/EditProfile";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/profile" element={<Profile />}>
          {/* <Route path=":username" element={<ProfileDetails />} /> */}
          <Route index element={<ProfileDetails />} />
          <Route path="username" element={<ProfileDetails />} />
          <Route path="settings" element={<EditProfile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/profile/username" replace />} />
      </Routes>
    </div>
  );
}

export default App;
