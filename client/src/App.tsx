import React from "react";
import "./App.scss";
import Login from "./components/login/Login";
import Profile from "./components/profile/Profile";
import SignUp from "./components/signup/Signup";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import ProfileDetails from "./components/profileDetails/ProfileDetails";
import EditProfile from "./components/editProfile/EditProfile";
import { RequireAuth } from "react-auth-kit";
import SnackBar from "./components/_shared/SnackBar";

function App() {
  return (
    <div className="container">
      {/* <SnackBar /> */}
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
        <Route
          path="*"
          element={
            <section className="page-404">
              <section className="error-container">
                <span className="four">
                  <span className="screen-reader-text">4</span>
                </span>
                <span className="zero">
                  <span className="screen-reader-text">0</span>
                </span>
                <span className="four">
                  <span className="screen-reader-text">4</span>
                </span>
              </section>
              <div style={{ fontSize: "1.5rem" }}>Page Not found</div>
              <div className="link-container">
                <Link to={"/"} className="more-link">
                  Back to homepage
                </Link>
              </div>
            </section>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
