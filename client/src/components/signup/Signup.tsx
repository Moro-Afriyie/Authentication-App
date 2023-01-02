import * as React from "react";
import "./SignUp.scss";
import logo from "../../assets/devchallenges.svg";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/config";
import { useFormik } from "formik";
import axios from "axios";
import { useSignIn } from "react-auth-kit";

const SignUp: React.FunctionComponent = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.post(`${BASE_URL}/auth/register/`, values);
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
    window.open(`${BASE_URL}/auth/${account}`, "_self");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-box__logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="login-box__heading">
          <p>Sign Up</p>
        </div>
        <form className="login-box__form" onSubmit={formik.handleSubmit}>
          <div className="login-box__form-control">
            <i className="fa fa-user-circle-o fa-lg" aria-hidden="true"></i>
            <input
              type="text"
              name="name"
              id="name"
              value={formik.values.name}
              placeholder="User Name"
              required
              onChange={formik.handleChange}
            />
          </div>
          <div className="login-box__form-control">
            <i className="fa fa-envelope fa-lg" aria-hidden="true"></i>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </div>
          <div className="login-box__form-control">
            <i className="fa fa-lock fa-2x" aria-hidden="true"></i>
            <input
              type="password"
              name="password"
              id="password"
              value={formik.values.password}
              required
              placeholder="Password"
              onChange={formik.handleChange}
            />
          </div>
          <button className="login-box__form-button" type="submit">
            Sign Up
          </button>
        </form>
        <div className="login-box__socials">
          <p>or continue with these social profile</p>
          <div
            className="login-box__social-icons"
            onClick={() => handleSocialLogin("google")}
          >
            <div className="icon">
              <i className="fa fa-google fa-lg" aria-hidden="true"></i>
            </div>
            <div className="icon" onClick={() => handleSocialLogin("facebook")}>
              <i
                className="fa fa-facebook-official fa-lg"
                aria-hidden="true"
              ></i>
            </div>
            <div className="icon" onClick={() => handleSocialLogin("twitter")}>
              <i className="fa fa-twitter fa-lg" aria-hidden="true"></i>
            </div>
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
