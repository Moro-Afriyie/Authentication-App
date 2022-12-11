import * as React from "react";
import "./Login.scss";
import logo from "../../assets/devchallenges.svg";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";

const Login: React.FunctionComponent = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const location = useLocation();
  const { code } = queryString.parse(location.search);

  const handleSocialLogin = (account: string) => {
    window.open(`http://localhost:8080/auth/${account}`, "_self");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("email: ", email);
    console.log("password: ", password);
  };

  React.useEffect(() => {
    if (code) {
      // make a request to the backend and get the user details + a new token
      console.log("token: ", code);
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
        <form className="login-box__form" onSubmit={(e) => handleLogin(e)}>
          <div className="login-box__form-control">
            <i className="fa fa-envelope fa-lg" aria-hidden="true"></i>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Email"
              required
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
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
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
