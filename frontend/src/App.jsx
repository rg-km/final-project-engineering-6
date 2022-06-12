import React, { useState } from "react";
import "./App.scss";
import Forum from "./pages/Forum/Forum";
import ForumDetail from "./pages/ForumDetail/ForumDetail";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Backdrop from "./components/Sidebar/Backdrop";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";

function App() {
  const [sidebar, setSidebar] = useState(false);
  const toogleSidebar = () => {
    setSidebar((prevState) => !prevState);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar openSidebar={toogleSidebar} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <div style={{ display: "flex" }}>
          <Backdrop Sidebar={sidebar} closeSidebar={toogleSidebar} />
          <Sidebar Sidebar={sidebar} />
          <Forum />
        </div>
        <ForumDetail />
      </BrowserRouter>
    </div>
  );
}

export default App;
