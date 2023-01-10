import * as React from "react";
import "./EditProfile.scss";
import avatar from "../../assets/avatar.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { BASE_URL } from "../../utils/config";
import * as Yup from "yup";
import Loader from "../_shared/Loader";
import SnackBar from "../_shared/SnackBar";
import { useAppDispatch, useAppSelector } from "../../utils/store/useRedux";
import { updateUser } from "../../utils/store/reducers/userSlice";
import Cookies from "js-cookie";

const EditProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "name should have a minimum of 5 characters")
    .max(30, "name should have a maximum of 30 characters")
    .nullable()
    .strict(),
  bio: Yup.string()
    .max(500, "bio can be only 500 characters long")
    .nullable()
    .notRequired(),
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

interface ISnackbarState {
  message: string;
  success: boolean;
  show: boolean;
}

const EditProfile: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = React.useState<ISnackbarState | null>(null);
  const currentUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  console.log("current user: ", currentUser);

  const showSnackbar = (success: boolean, message: string) => {
    setSnackbar({
      message,
      success,
      show: true,
    });

    setTimeout(() => {
      setSnackbar(null);
    }, 5000);
  };

  const formik = useFormik({
    initialValues: {
      name: currentUser.name || "",
      bio: currentUser.bio || "",
      email: currentUser.email || "",
      phoneNumber: currentUser.phoneNumber || "",
      photo: currentUser.photo,
      password: currentUser.password || "",
    },
    validationSchema: EditProfileSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const response = await axios.put(`${BASE_URL}/users`, values, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSubmitting(false);
        if (response.data.error) {
          showSnackbar(false, response.data.message);
          return;
        }

        dispatch(updateUser(response.data.user));
        showSnackbar(true, response.data.message);
        // update the  authState with the new data from the server
      } catch (error) {
        if (error instanceof AxiosError && error?.response?.status == 401) {
          navigate(
            "/login?error=your session has expired please login to continue"
          );
        } else {
          setSubmitting(false);
          showSnackbar(false, "failed to update user, please try again..");
        }
      }
    },
  });

  return (
    <div className="edit-profile-details-box">
      {snackbar && (
        <SnackBar
          message={snackbar.message}
          success={snackbar.success}
          show={snackbar.show}
          handleClose={() => {
            setSnackbar(null);
          }}
        />
      )}
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
                  style={{
                    backgroundImage: `url(${currentUser.photo || avatar})`,
                  }}
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
              <div className="form-control">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name..."
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  style={{
                    border:
                      formik.errors.name && formik.touched.name
                        ? "1px solid red"
                        : "",
                  }}
                />
              </div>
              {formik.errors.name && formik.touched.name ? (
                <div className="form__error">{formik.errors.name}</div>
              ) : null}
            </div>

            <div>
              <div className="form-control">
                <label htmlFor="bio">Bio</label>
                <textarea
                  name="bio"
                  id="bio"
                  placeholder="Enter your bio..."
                  onChange={formik.handleChange}
                  value={formik.values.bio}
                  style={{
                    border:
                      formik.errors.bio && formik.touched.bio
                        ? "1px solid red"
                        : "",
                  }}
                ></textarea>
              </div>
              {formik.errors.bio && formik.touched.bio ? (
                <div className="form__error">{formik.errors.bio}</div>
              ) : null}
            </div>
            <div>
              <div className="form-control">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="Enter your phone..."
                  onChange={formik.handleChange}
                  value={formik.values.phoneNumber}
                  style={{
                    border:
                      formik.errors.phoneNumber && formik.touched.phoneNumber
                        ? "1px solid red"
                        : "",
                  }}
                />
              </div>
              {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
                <div className="form__error">{formik.errors.phoneNumber}</div>
              ) : null}
            </div>
            <div>
              <div className="form-control">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  style={{
                    border:
                      formik.errors.email && formik.touched.email
                        ? "1px solid red"
                        : "",
                  }}
                />
              </div>
              {formik.errors.email && formik.touched.email ? (
                <div className="form__error">{formik.errors.email}</div>
              ) : null}
            </div>

            <div>
              <div className="form-control">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password..."
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  style={{
                    border:
                      formik.errors.password && formik.touched.password
                        ? "1px solid red"
                        : "",
                  }}
                />
              </div>
              {formik.errors.password && formik.touched.password ? (
                <div className="form__error">{formik.errors.password}</div>
              ) : null}
            </div>
            <button type="submit" className="submit">
              {formik.isSubmitting ? <Loader /> : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
