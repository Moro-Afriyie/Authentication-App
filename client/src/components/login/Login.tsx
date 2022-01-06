import * as React from "react";
import "./Login.scss";

const Login: React.FunctionComponent = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-box__logo"></div>
        <div className="login-box__heading"></div>
        <div className="login-box__body"></div>
        <form className="login-box__form"></form>
        <div className="login-box__socials"></div>
        <div className="login-box__link"></div>
      </div>
    </div>
  );
};

export default Login;
