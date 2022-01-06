import * as React from "react";
import "./Login.scss";

const Login: React.FunctionComponent = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-box__logo"></div>
        <div className="login-box__heading">
          <p>Join thousands of learners from</p>
          <p>around the world </p>
        </div>
        <div className="login-box__body">
          <p>Master web development by making real-life</p>
          <p>projects. There are multiple paths for you to </p>
          <p>choose</p>
        </div>
        <form className="login-box__form"></form>
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
