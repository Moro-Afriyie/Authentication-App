import React from "react";
import "./App.scss";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import SignUp from "./components/signup/Signup";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfileDetails from "./components/profileDetails/ProfileDetails";
import EditProfile from "./components/editProfile/EditProfile";
import { RequireAuth } from "react-auth-kit";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route
          path="/profile"
          element={
            <RequireAuth loginPath={"/login"}>
              <Profile />
            </RequireAuth>
          }
        >
          <Route
            index
            element={
              <RequireAuth loginPath={"/login"}>
                <ProfileDetails />
              </RequireAuth>
            }
          />
          <Route
            path="username"
            element={
              <RequireAuth loginPath={"/login"}>
                <ProfileDetails />
              </RequireAuth>
            }
          />
          <Route
            path="settings"
            element={
              <RequireAuth loginPath={"/login"}>
                <EditProfile />
              </RequireAuth>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/" element={<Navigate to="/profile/username" replace />} />
      </Routes>
    </div>
  );
}

export default App;
