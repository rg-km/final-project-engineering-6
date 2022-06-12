import React, { useState } from "react";
import "./App.scss";
import Forum from "./pages/Forum/Forum";
import ForumDetail from "./pages/ForumDetail/ForumDetail";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Backdrop from "./components/Sidebar/Backdrop";

function App() {
  const [sidebar, setSidebar] = useState(false);
  const toogleSidebar = () => {
    setSidebar((prevState) => !prevState);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar openSidebar={toogleSidebar} />
        <Backdrop Sidebar={sidebar} closeSidebar={toogleSidebar} />
        <div style={{ display: "flex" }}>
          <Sidebar Sidebar={sidebar} />
          <Forum />
        </div>
        <ForumDetail />
      </BrowserRouter>
    </div>
  );
}

export default App;
