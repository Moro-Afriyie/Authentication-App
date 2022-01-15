import * as React from "react";
import "./ProfileDetails.scss";
import avatar from "../../assets/avatar.jpg";
import { Link } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProfileDetailsProps {}

const ProfileDetails: React.FunctionComponent<IProfileDetailsProps> = (
  props
) => {
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
          <Link className="edit" to="/settings/profile">
            Edit
          </Link>
          {/* <div className="edit">
            Edit</div> */}
        </li>
        <li>
          <p className="left-text">photo</p>
          <div className="image">
            <img src={avatar} alt="profile image" />
          </div>
        </li>
        <li>
          <p className="left-text">Name</p>
          <p className="right-text">Xanthe Neal</p>
        </li>
        <li>
          <p className="left-text">Bio</p>
          <p className="right-text">
            I am a software developer and a big fan of devchallenges...
          </p>
        </li>
        <li>
          <p className="left-text">phone</p>
          <p className="right-text">908249274292</p>
        </li>
        <li>
          <p className="left-text">Email</p>
          <p className="right-text">xanthe.neal@gmail.com</p>
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
