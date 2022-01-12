import * as React from "react";
import "./Profile.scss";
import ProfileDetails from "../profileDetails/ProfileDetails";
import EditProfile from "../editProfile/EditProfile";
import NavBar from "../navbar/NavBar";

const Profile: React.FunctionComponent = () => {
  return (
    <div className="profile-container">
      <NavBar />
      <div className="profile__info-box">
        {/* <ProfileDetails /> */}
        <EditProfile />
      </div>
    </div>
  );
};

export default Profile;
