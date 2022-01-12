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
        <h1>header</h1>
      </div>
      <div className="profile-details-box__info">
        <h1>Infor</h1>
      </div>
    </div>
  );
};

export default ProfileDetails;
