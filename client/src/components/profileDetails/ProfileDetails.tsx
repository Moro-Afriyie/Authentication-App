import * as React from "react";
import "./ProfileDetails.scss";
import avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";

const ProfileDetails: React.FunctionComponent = () => {
  const auth = useAuthUser();

  return (
    <div className="profile-details-box">
      <div className="profile-details-box__header">
        <p className="bold">Personal info</p>
        <p className="faint">Basic info, like your name and photo</p>
      </div>
      <ul className="profile-details-box__info">
        <li className="profile-details-box__info-controls">
          <div className="profile">
            <p className="ligt-bold">Profile</p>
            <p className="light">Some info may be visible to other people</p>
          </div>
          <Link className="edit" to="/profile/settings">
            Edit
          </Link>
        </li>
        <li>
          <p className="left-text">photo</p>
          <div className="image">
            <img src={auth()?.photo || avatar} alt="profile image" />
          </div>
        </li>
        <li>
          <p className="left-text">Name</p>
          <p className="right-text">{auth()?.name}</p>
        </li>
        <li>
          <p className="left-text">Bio</p>
          <p className="right-text">{auth()?.bio}</p>
        </li>
        <li>
          <p className="left-text">phone</p>
          <p className="right-text">{auth()?.phoneNumber}</p>
        </li>
        <li>
          <p className="left-text">Email</p>
          <p className="right-text">{auth()?.email}</p>
        </li>
        <li className="password">
          <p className="left-text">Password</p>
          <p className="right-text">************</p>
        </li>
      </ul>
    </div>
  );
};

export default ProfileDetails;
