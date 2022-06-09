import React from "react";
import "./Navbar.scss";

const Navbar = () => {
  return (
    <div>
      <header>
        <nav>
          <div className="logo">BASIS</div>
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
