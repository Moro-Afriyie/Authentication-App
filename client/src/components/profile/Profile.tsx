import * as React from "react";
import "./Profile.scss";
import NavBar from "../navbar/NavBar";
import { Outlet } from "react-router-dom";
import axios from "axios";

const Profile: React.FunctionComponent = () => {
  return (
    <div className="profile-container">
      <NavBar />
      <div className="profile__info-box">
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
