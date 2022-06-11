import React from "react";
import "./Sidebar.scss";
import { MenuSidebar } from "./MenuSidebar";

const Sidebar = () => {
  return (
    <aside className="Sidebar">
      <ul className="SidebarList">
        {MenuSidebar.map((item, index) => {
          return (
            <li
              key={index}
              className="row"
              id={window.location.pathname == item.link ? "active" : ""}
              onClick={() => {
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
