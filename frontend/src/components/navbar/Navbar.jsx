import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = () => {
  // const [user, setUser] = useState({});
  const [isLoggedIn, setIsloggedin] = useState(true);
  return (
    <div>
      <header>
        <nav>
          <div className="menu_icon">
            <MenuIcon />
          </div>
          <div className="logo">BASIS___</div>
          {isLoggedIn ? (
            <div className="link">
              <div className="user">
                <Link to="#">
                  <NotificationsIcon style={{ fontSize: "2rem" }} />
                </Link>
              </div>
              <div className="notification">
                <Link to="#">
                  <AccountCircleIcon style={{ fontSize: "2rem" }} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="link">
              <Link to="#" className="regis">
                Register
              </Link>
              <Link to="#" className="login">
                Login
              </Link>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
