import * as React from "react";
import "./Login.scss";
import logo from "../../assets/devchallenges.svg";

const Login: React.FunctionComponent = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-box__logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="login-box__heading">
          <p>Join thousands of learners from</p>
          <p>around the world </p>
        </div>
        <div className="login-box__body">
          <p className="mobile-text">
            Master web development by making real-life projects. There are
            multiple paths for you to choose
          </p>
          <div className="desktop-text">
            <p>Master web development by making real-life</p>
            <p>projects. There are multiple paths for you to </p>
            <p>choose</p>
          </div>
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
            Start coding now
          </button>
        </form>
        <div className="login-box__socials">
          <p>or continue with these social profile</p>
          <div className="login-box__social-icons">
            <div className="icon">
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
            Don&apos;t have an account? <a href="#">SignUp</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
