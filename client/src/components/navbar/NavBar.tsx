import * as React from "react";
import logo from "../../assets/devchallenges.svg";
import avatar from "../../assets/avatar.jpg";
import "./NavBar.scss";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface INavBarProps {}

const NavBar: React.FunctionComponent<INavBarProps> = (props) => {
  const [menu, setMenu] = React.useState(false);

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
            <img src={avatar} alt="profile picture" />
          </div>
          <p>Xanthe Neal</p>
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
              <li className="link-item logout">
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
