import * as React from "react";
import "./EditProfile.scss";
import avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import axios from "axios";
import { useFormik } from "formik";
import { BASE_URL } from "../../utils/config";
import * as Yup from "yup";
import Loader from "../_shared/Loader";

const EditProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "name should have a minimum of 5 characters")
    .max(30, "name should have a maximum of 20 characters")
    .nullable()
    .strict(),
  phoneNumber: Yup.string()
    .matches(/^\+\d{2}\d{9,}$/, {
      excludeEmptyString: true,
      message:
        "phone number should start with a plus sign, followed by the country code and national number",
    })
    .min(7, { excludeEmptyString: true })
    .max(15, { excludeEmptyString: true })
    .nullable()
    .notRequired(),
  email: Yup.string().email("Invalid email").nullable().strict(),
  password: Yup.string()
    .min(5, "password should have a minimum of 5 characters")
    .max(20, "password should have a maximum of 20 characters")
    .nullable()
    .strict(),
});

const EditProfile: React.FunctionComponent = () => {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();

  const formik = useFormik({
    initialValues: {
      name: auth()?.name || "",
      bio: auth()?.bio || "",
      email: auth()?.email || "",
      phoneNumber: auth()?.phoneNumber || "",
      photo: auth()?.photo,
      password: auth()?.password || "",
    },
    validationSchema: EditProfileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("photo: ", values.photo);

        const response = await axios.put(`${BASE_URL}/users`, values, {
          headers: {
            Authorization: authHeader(),
            "Content-Type": "multipart/form-data",
          },
        });
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
          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
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
              <input
                onChange={(event) => {
                  if (!event.target.files || event.target.files.length === 0)
                    return;
                  formik.setFieldValue("photo", event.target.files[0]);
                }}
                type="file"
                name="photo"
                id="photo"
                accept="image/*"
              />
            </div>
            <div>
              <div
                className="form-control"
                style={{
                  border:
                    formik.errors.email && formik.touched.email
                      ? "1px solid red"
                      : "",
                }}
              >
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
              {formik.errors.name && formik.touched.name ? (
                <div className="form__error">{formik.errors.name}</div>
              ) : null}
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
                value={formik.values.password}
                onChange={formik.handleChange}
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
