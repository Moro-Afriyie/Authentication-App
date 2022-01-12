import * as React from "react";
import "./ProfileDetails.scss";

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
      {/* <div className="profile-details-box__info"> */}
      <ul className="profile-details-box__info">
        <li className="profile-details-box__info-controls">
          <div className="profile">
            <p className="ligt-bold">Profile</p>
            <p className="light">Some info may be visible to other people</p>
          </div>
          <div className="edit">Edit</div>
        </li>
        <li className="photo">phone</li>
        <li className="name">name</li>
        <li className="bio">bio</li>
        <li className="phone-number">number</li>
        <li className="email">email</li>
        <li className="password">password</li>
      </ul>
      {/* </div> */}
    </div>
  );
};

export default ProfileDetails;
