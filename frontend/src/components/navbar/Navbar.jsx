import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import Button from "../Button/Button";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = ({ openSidebar }) => {
  // const [user, setUser] = useState({});
  const [isLoggedIn, setIsloggedin] = useState(true);
  return (
    <div>
      <header>
        <nav>
          <div className="menu_icon" onClick={openSidebar}>
            <MenuIcon />
          </div>
          <div className="logo">BASIS___</div>
          {isLoggedIn ? (
            <div className="link">
              <div className="user">
                <Link to="/notifications">
                  <NotificationsIcon style={{ fontSize: "2rem" }} />
                </Link>
              </div>
              <div className="notification">
                <Link to="/profile">
                  <AccountCircleIcon style={{ fontSize: "2rem" }} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="link">
              <Link to="/login" className="login">
                <Button variant={"login"}>Login</Button>
              </Link>

              <Link to="/register">
                <Button variant={"regis"}>Register</Button>
              </Link>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
