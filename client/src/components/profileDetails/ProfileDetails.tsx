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
      <div className="profile-details-box__info">
        <h1>Info</h1>
      </div>
    </div>
  );
};

export default ProfileDetails;
