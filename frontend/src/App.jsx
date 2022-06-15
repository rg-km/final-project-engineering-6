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
import PostForm from "./pages/PostForm/PostForm";
import Button from "./components/Button/Button";

function App() {
  const [sidebar, setSidebar] = useState(false);
  const toogleSidebar = () => {
    setSidebar((prevState) => !prevState);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar openSidebar={toogleSidebar} />
        <div style={{ display: "flex" }}>
          <Backdrop Sidebar={sidebar} closeSidebar={toogleSidebar} />
          <Sidebar Sidebar={sidebar} />
        </div>

        <Button variant={"add-post"} link={"/post-forum"}>
          +
        </Button>

        <Routes>
          <Route path="/" default element={<Forum />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forum-detail" element={<ForumDetail />} />
          <Route path="/post-forum" element={<PostForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
