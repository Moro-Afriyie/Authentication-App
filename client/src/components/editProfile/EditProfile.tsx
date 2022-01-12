import * as React from "react";
import "./EditProfile.scss";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEditProfileProps {}

const EditProfile: React.FunctionComponent<IEditProfileProps> = (props) => {
  return (
    <div className="edit-profile-details-box">
      <div className="back">back</div>
      <div className="edit-details-info"></div>
    </div>
  );
};

export default EditProfile;
