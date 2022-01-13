import * as React from "react";
import "./EditProfile.scss";
import avatar from "../../assets/avatar.jpg";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEditProfileProps {}

const EditProfile: React.FunctionComponent<IEditProfileProps> = (props) => {
  return (
    <div className="edit-profile-details-box">
      <div className="back">back</div>
      <div className="edit-details-info">
        <div className="edit-details-info__header">
          <p className="bold">Change Info</p>
          <p className="light">Changes will be reflected to every services</p>
        </div>
        <div className="edit-details-info__form">
          <form>
            <div className="change-photo">
              <label htmlFor="photo">
                <div
                  className="photo-icon"
                  style={{ backgroundImage: `url(${avatar})` }}
                >
                  <span className="material-icons">photo_camera</span>
                </div>
                <p>CHANGE PHOTO</p>
              </label>
              <input type="file" name="photo" id="photo" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
