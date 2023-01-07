import * as React from "react";
import "./SignUp.scss";
import logo from "../../assets/devchallenges.svg";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/config";
import { useFormik } from "formik";
import axios from "axios";
import { useSignIn } from "react-auth-kit";
import ErrorMessage from "../_shared/ErrorMessage";
import * as Yup from "yup";

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "name should have a minimum of 5 characters")
    .max(30, "name should have a maximum of 20 characters")
    .required("name is required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  password: Yup.string()
    .min(5, "password should have a minimum of 5 characters")
    .max(20, "password should have a maximum of 20 characters")
    .required("password is required"),
});

const SignUp: React.FunctionComponent = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.post(`${BASE_URL}/auth/register/`, values);
        if (res.data.error) {
          setErrorMessage(res.data.message);
          return;
        }
        signIn({
          token: res.data.token,
          expiresIn: 3600,
          tokenType: "Bearer",
          authState: res.data.user,
        });
        navigate("/profile/username");
      } catch (error) {
        console.log("error: ", error);
      }
    },
  });

  const handleSocialLogin = (account: string) => {
    navigate("/login");
    window.open(`${BASE_URL}/auth/${account}`, "_self");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-box__logo">
          <img src={logo} alt="logo" />
        </div>
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            handleClose={() => setErrorMessage("")}
          />
        )}
        <div className="login-box__heading">
          <p>Sign Up</p>
        </div>
        <form className="login-box__form" onSubmit={formik.handleSubmit}>
          <div>
            <div
              className="login-box__form-control"
              style={{
                border:
                  formik.errors.name && formik.touched.name
                    ? "1px solid red"
                    : "",
              }}
            >
              <i className="fa fa-user-circle-o fa-lg" aria-hidden="true"></i>
              <input
                type="text"
                name="name"
                id="name"
                value={formik.values.name}
                placeholder="User Name"
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.name && formik.touched.name ? (
              <div className="form__error">{formik.errors.name}</div>
            ) : null}
          </div>
          <div>
            <div
              className="login-box__form-control"
              style={{
                border:
                  formik.errors.name && formik.touched.name
                    ? "1px solid red"
                    : "",
              }}
            >
              <i className="fa fa-envelope fa-lg" aria-hidden="true"></i>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.email && formik.touched.email ? (
              <div className="form__error">{formik.errors.email}</div>
            ) : null}
          </div>
          <div>
            <div
              className="login-box__form-control"
              style={{
                border:
                  formik.errors.password && formik.touched.password
                    ? "1px solid red"
                    : "",
              }}
            >
              <i className="fa fa-lock fa-2x" aria-hidden="true"></i>
              <input
                type="password"
                name="password"
                id="password"
                value={formik.values.password}
                placeholder="Password"
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.password && formik.touched.password ? (
              <div className="form__error">{formik.errors.password}</div>
            ) : null}
          </div>
          <button className="login-box__form-button" type="submit">
            Sign Up
          </button>
        </form>
        <div className="login-box__socials">
          <p>or continue with these social profile</p>
          <div className="login-box__social-icons">
            <div className="icon" onClick={() => handleSocialLogin("google")}>
              <i className="fa fa-google fa-lg" aria-hidden="true"></i>
            </div>
            <div className="icon" onClick={() => handleSocialLogin("facebook")}>
              <i
                className="fa fa-facebook-official fa-lg"
                aria-hidden="true"
              ></i>
            </div>
            {/* <div className="icon" onClick={() => handleSocialLogin("twitter")}>
              <i className="fa fa-twitter fa-lg" aria-hidden="true"></i>
            </div> */}
            <div className="icon" onClick={() => handleSocialLogin("github")}>
              <i className="fa fa-github fa-lg" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div className="login-box__link">
          <p>
            Already have an account?<Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
