import React from "react";
import "./Backdrop.scss";

function Backdrop({ Sidebar, closeSidebar }) {
  return <div className={Sidebar ? "backdrop backdrop-open" : "backdrop"} onClick={closeSidebar}></div>;
}

export default Backdrop;
