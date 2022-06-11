import React from "react";
import "./Navbar.scss";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  return (
    <div>
      <header>
        <nav>
          <div className="menu_icon">
            <MenuIcon />
          </div>
          <div className="logo">BASIS___</div>
          <div className="link">
            <a href="#" className="regis">
              Register
            </a>
            <a href="#" className="login">
              Login
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
