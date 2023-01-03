import * as React from "react";
import "./Login.scss";
import logo from "../../assets/devchallenges.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import { useSignIn } from "react-auth-kit";
import { useFormik } from "formik";
import { BASE_URL } from "../../utils/config";

const Login: React.FunctionComponent = () => {
  const location = useLocation();
  const { code, error } = queryString.parse(location.search);
  const signIn = useSignIn();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await axios.post(`${BASE_URL}/auth/login`, values);
        console.log("response: ", res.data.user);
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

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/login/success/`, {
        headers: { Authorization: `Bearer ${code}` },
        withCredentials: true,
      });

      signIn({
        token: res.data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: res.data.user,
      });
      navigate("/profile/username");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSocialLogin = (account: string) => {
    window.open(`${BASE_URL}/auth/${account}`, "_self");
  };

  React.useEffect(() => {
    if (code) {
      // make a request to the backend and get the user details + a new token
      fetchUser();
    } else if (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-box__logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="login-box__heading">
          <p>Login</p>
        </div>
        <form className="login-box__form" onSubmit={formik.handleSubmit}>
          <div className="login-box__form-control">
            <i className="fa fa-envelope fa-lg" aria-hidden="true"></i>
            <input
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              placeholder="Email"
              required
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
              placeholder="Password"
              required
              onChange={formik.handleChange}
            />
          </div>
          <button className="login-box__form-button" type="submit">
            Login
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
            Don&apos;t have an account? <Link to="/register">SignUp</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
