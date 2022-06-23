import React from "react";
import "./Sidebar.scss";
import { MenuSidebar } from "./MenuSidebar";
import { Link } from "react-router-dom";
import Logo from "../../images/logo.svg";

const Sidebar = ({ Sidebar }) => {
  return (
    <aside className={Sidebar ? "sidebar sidebar-open" : "sidebar"}>
      <Link to="/">
        <img src={Logo} alt="" />
      </Link>
      <ul className="SidebarList">
        {MenuSidebar.map((item, index) => {
          return (
            <li
              key={index}
              className="row"
              id={window.location.pathname === item.link ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                window.location.pathname = item.link;
              }}
            >
              <div id="icon" className="title">
                {item.icon}{" "}
              </div>
              <div id="title" className="title">
                {item.title}
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
