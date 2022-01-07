import * as React from "react";
import "./Profile.scss";
import logo from "../../assets/devchallenges.svg";

const Profile: React.FunctionComponent = () => {
  return (
    <div className="profile-container">
      <div className="profile">
        <div className="profile__nav">
          <div className="profile__nav-logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="profile__nav-avatar">
            <h1>Avatar</h1>
          </div>
        </div>
        <div className="profile__info">
          <div className="profile__info-header"></div>
          <div className="profile__info-details"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
