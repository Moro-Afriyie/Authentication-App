import * as React from "react";
import "./SignUp.scss";
import logo from "../../assets/devchallenges.svg";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../utils/config";

const SignUp: React.FunctionComponent = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [userName, setUserName] = React.useState("");

  const handleSocialLogin = (account: string) => {
    window.open(`${BASE_URL}/auth/${account}`, "_self");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("email: ", email);
    console.log("password: ", password);
    console.log("userName: ", userName);
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
        <form className="login-box__form" onSubmit={(e) => handleLogin(e)}>
          <div className="login-box__form-control">
            <i className="fa fa-user-circle-o fa-lg" aria-hidden="true"></i>
            <input
              type="text"
              name="userName"
              id="userName"
              value={userName}
              placeholder="User Name"
              required
              onChange={(e) => setUserName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="login-box__form-control">
            <i className="fa fa-lock fa-2x" aria-hidden="true"></i>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              required
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
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
