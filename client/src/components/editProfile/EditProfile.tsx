import * as React from "react";
import "./EditProfile.scss";
import avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import axios from "axios";
import { useFormik } from "formik";

const EditProfile: React.FunctionComponent = () => {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  console.log(auth());
  // TODO: handle password and images on the backend side
  const formik = useFormik({
    initialValues: {
      name: auth()?.name,
      bio: auth()?.bio,
      email: auth()?.email,
      phoneNumber: auth()?.phoneNumber,
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.put(
          "http://localhost:8080/users/",
          values,
          {
            headers: { Authorization: authHeader() },
          }
        );
        console.log("response: ", response.data.user);
        // update the  authState with the new data from the server
      } catch (error) {
        console.log("error: ", error);
      }
    },
  });

  return (
    <div className="edit-profile-details-box">
      <Link className="back" to="/profile/username">
        <span className="material-icons">arrow_back_ios_new</span>
        <p>back</p>
      </Link>
      <div className="edit-details-info">
        <div className="edit-details-info__header">
          <p className="bold">Change Info</p>
          <p className="light">Changes will be reflected to every services</p>
        </div>
        <div className="edit-details-info__form">
          <form onSubmit={formik.handleSubmit}>
            <div className="change-photo">
              <label htmlFor="photo">
                <div
                  className="photo-icon"
                  style={{ backgroundImage: `url(${auth()?.photo || avatar})` }}
                >
                  <div className="icon">
                    <span className="material-icons">photo_camera</span>
                  </div>
                </div>
              </label>
              <p>CHANGE PHOTO</p>
              <input type="file" name="photo" id="photo" accept="image/*" />
            </div>
            <div className="form-control">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name..."
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="form-control">
              <label htmlFor="bio">Bio</label>
              <textarea
                name="bio"
                id="bio"
                placeholder="Enter your bio..."
                onChange={formik.handleChange}
                value={formik.values.bio}
              ></textarea>
            </div>
            <div className="form-control">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Enter your phone..."
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
              />
            </div>
            <div className="form-control">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                readOnly
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
