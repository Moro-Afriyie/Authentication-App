import * as React from "react";
import "./Login.scss";
import logo from "../../assets/devchallenges.svg";
import { Link } from "react-router-dom";

const Login: React.FunctionComponent = () => {
  const handleGoogleLogin = async () => {
    window.open("http://localhost:8080/auth/google", "_self");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-box__logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="login-box__heading">
          <p>Login</p>
        </div>
        <form className="login-box__form">
          <div className="login-box__form-control">
            <i className="fa fa-envelope fa-lg" aria-hidden="true"></i>
            <input type="email" name="email" id="email" placeholder="Email" />
          </div>
          <div className="login-box__form-control">
            <i className="fa fa-lock fa-2x" aria-hidden="true"></i>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
            />
          </div>
          <button className="login-box__form-button" type="submit">
            Login
          </button>
        </form>
        <div className="login-box__socials">
          <p>or continue with these social profile</p>
          <div className="login-box__social-icons">
            <div className="icon" onClick={handleGoogleLogin}>
              <i className="fa fa-google fa-lg" aria-hidden="true"></i>
            </div>
            <div className="icon">
              <i
                className="fa fa-facebook-official fa-lg"
                aria-hidden="true"
              ></i>
            </div>
            <div className="icon">
              <i className="fa fa-twitter fa-lg" aria-hidden="true"></i>
            </div>
            <div className="icon">
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
