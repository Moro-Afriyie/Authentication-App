import * as React from "react";
import "./Login.scss";
import logo from "../../assets/devchallenges.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { BASE_URL } from "../../utils/config";
import ErrorMessage from "../_shared/ErrorMessage";
import * as Yup from "yup";
import Loader from "../_shared/Loader";
import { useAppDispatch } from "../../utils/store/useRedux";
import { updateUser } from "../../utils/store/reducers/userSlice";
import Cookies from "js-cookie";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
  password: Yup.string()
    .min(5, "password should have a minimum of 5 characters")
    .max(20, "password should have a maximum of 20 characters")
    .required("password is required"),
});

const Login: React.FunctionComponent = () => {
  const location = useLocation();
  const { code, error } = queryString.parse(location.search);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState("");
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        const res = await axios.post(`${BASE_URL}/auth/login`, values);
        if (res.data.error) {
          setErrorMessage(res.data.message);
          setSubmitting(false);
          return;
        }
        setSubmitting(false);
        Cookies.set("token", res.data.token);
        dispatch(updateUser(res.data.user));
        navigate(`/profile/${res.data.user.id}`);
      } catch (error) {
        setSubmitting(false);
        if (error instanceof AxiosError && error?.response?.data) {
          setErrorMessage(error.response.data.message);
          return;
        }
        setErrorMessage("an unexpected error occured, please try again");
      }
    },
  });

  const fetchUser = async () => {
    try {
      formik.setSubmitting(true);
      const res = await axios.get(`${BASE_URL}/auth/login/success/`, {
        headers: { Authorization: `Bearer ${code}` },
        withCredentials: true,
      });

      if (res.data.error) {
        setErrorMessage(res.data.message);
        formik.setSubmitting(false);
        return;
      }
      formik.setSubmitting(false);
      Cookies.set("token", res.data.token);
      dispatch(updateUser(res.data.user));
      navigate(`/profile/${res.data.user.id}`);
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.data) {
        setErrorMessage(error.response.data.message);
        return;
      }
      setErrorMessage("an unexpected error occured, please try again");
      formik.setSubmitting(false);
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
      setErrorMessage(error as string);
    }
  }, []);

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
          <p>Login</p>
        </div>
        <form className="login-box__form" onSubmit={formik.handleSubmit}>
          <div>
            <div
              className="login-box__form-control"
              style={{
                border:
                  formik.errors.email && formik.touched.email
                    ? "1px solid red"
                    : "",
              }}
            >
              <i className="fa fa-envelope fa-lg" aria-hidden="true"></i>
              <input
                type="email"
                name="email"
                id="email"
                value={formik.values.email}
                placeholder="Email"
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
                required
                onChange={formik.handleChange}
              />
            </div>
            {formik.errors.password && formik.touched.password ? (
              <div className="form__error">{formik.errors.password}</div>
            ) : null}
          </div>
          <button className="login-box__form-button" type="submit">
            {formik.isSubmitting ? <Loader /> : "Login"}
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
            Don&apos;t have an account? <Link to="/register">SignUp</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
