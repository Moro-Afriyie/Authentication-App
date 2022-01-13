import * as React from "react";
import "./EditProfile.scss";
import avatar from "../../assets/avatar.jpg";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEditProfileProps {}

const EditProfile: React.FunctionComponent<IEditProfileProps> = (props) => {
  return (
    <div className="edit-profile-details-box">
      <div className="back">
        <span className="material-icons">arrow_back_ios_new</span>
        <p>back</p>
      </div>
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
                  <div className="icon">
                    <span className="material-icons">photo_camera</span>
                  </div>
                </div>
                <p>CHANGE PHOTO</p>
              </label>
              <input type="file" name="photo" id="photo" />
            </div>
            <div className="form-control">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name..."
              />
            </div>
            <div className="form-control">
              <label htmlFor="bio">Bio</label>
              <textarea
                name="bio"
                id="bio"
                placeholder="Enter your bio..."
              ></textarea>
            </div>
            <div className="form-control">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder="Enter your phone..."
              />
            </div>
            <div className="form-control">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email..."
              />
            </div>
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password..."
              />
            </div>
            <button type="submit" className="submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
