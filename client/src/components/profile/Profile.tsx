import * as React from "react";
import "./Profile.scss";
import logo from "../../assets/devchallenges.svg";
import avatar from "../../assets/avatar.jpg";

const Profile: React.FunctionComponent = () => {
  return (
    <div className="profile-container">
      <div className="profile">
        <div className="profile__nav">
          <div className="profile__nav-logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="profile__nav-avatar">
            <div className="profile__nav-avatar-controls">
              <div className="avatar">
                <img src={avatar} alt="profile picture" />
              </div>
              <p>Xanthe Neal</p>
              <i className="fa fa-caret-down" aria-hidden="true"></i>
            </div>
            <div className="drop-down__menu">
              <h1>menu</h1>
            </div>
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
