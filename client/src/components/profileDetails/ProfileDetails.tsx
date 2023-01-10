import * as React from "react";
import "./ProfileDetails.scss";
import avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../utils/store/useRedux";

const ProfileDetails: React.FunctionComponent = () => {
  const currentUser = useAppSelector((state) => state.user);
  console.log("currentUser: ", currentUser);

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
            <img src={currentUser.photo || avatar} alt="profile image" />
          </div>
        </li>
        <li>
          <p className="left-text">Name</p>
          <p className="right-text">{currentUser.name}</p>
        </li>
        <li>
          <p className="left-text">Bio</p>
          <p className="right-text">{currentUser.bio}</p>
        </li>
        <li>
          <p className="left-text">phone</p>
          <p className="right-text">{currentUser.phoneNumber}</p>
        </li>
        <li>
          <p className="left-text">Email</p>
          <p className="right-text">{currentUser.email}</p>
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
