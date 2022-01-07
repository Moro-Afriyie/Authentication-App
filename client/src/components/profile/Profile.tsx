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
              {/* <i className="fa fa-caret-up" aria-hidden="true"></i> */}
            </div>
            <div className="drop-down__menu">
              <div className="drop-down__menu-links">
                <div className="link-item">
                  <span className="material-icons">account_circle</span>
                  <p>My Profile</p>
                </div>
                <div className="link-item">
                  <span className="material-icons">group</span>
                  <p>Group Chat</p>
                </div>

                <div className="linki-tem logout">
                  <span className="material-icons">exit_to_app</span>
                  <p>Logout</p>
                </div>
              </div>
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
