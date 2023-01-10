import * as React from "react";
import logo from "../../assets/devchallenges.svg";
import avatar from "../../assets/avatar.png";
import "./NavBar.scss";
import { useAppDispatch, useAppSelector } from "../../utils/store/useRedux";
import Cookies from "js-cookie";
import { removeUser } from "../../utils/store/reducers/userSlice";
import { useNavigate } from "react-router-dom";

const NavBar: React.FunctionComponent = () => {
  const [menu, setMenu] = React.useState(false);
  const currentUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleShowDropdownMenu = () => {
    setMenu((prev) => !prev);
  };
  return (
    <div className="profile__nav">
      <div className="profile__nav-logo">
        <img src={logo} alt="logo" />
      </div>
      <div className="profile__nav-avatar">
        <div
          className="profile__nav-avatar-controls"
          onClick={handleShowDropdownMenu}
        >
          <div className="avatar">
            <img src={currentUser.photo || avatar} alt="profile picture" />
          </div>
          <p>{currentUser.name}</p>
          {menu ? (
            <i className="fa fa-caret-up" aria-hidden="true"></i>
          ) : (
            <i className="fa fa-caret-down" aria-hidden="true"></i>
          )}
        </div>
        {menu && (
          <div className="drop-down__menu">
            <ul className="drop-down__menu-links">
              <li className="link-item profile active">
                <span className="material-icons">account_circle</span>
                <p>My Profile</p>
              </li>
              <li className="link-item group">
                <span className="material-icons">group</span>
                <p>Group Chat</p>
              </li>
              <hr />
              <li
                className="link-item logout"
                onClick={() => {
                  dispatch(removeUser);
                  Cookies.remove("token");
                  navigate("/login");
                }}
              >
                <span className="material-icons">exit_to_app</span>
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
