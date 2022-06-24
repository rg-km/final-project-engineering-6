import React, { useState } from "react";
import "./App.scss";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Backdrop from "./components/Sidebar/Backdrop";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Button from "./components/Button/Button";
import PostPage from "./pages/PostPage/PostPage";
import DetailPage from "./pages/DetailPage/DetailPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage/NotificationsPage";
import HomePage from "./pages/HomePage/HomePage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

function App() {
  const [sidebar, setSidebar] = useState(false);
  const toogleSidebar = () => {
    setSidebar((prevState) => !prevState);
  };

  // const ProtectedRoute = ({ children }) => {
  //   const { token } = useAuth();
  //   if (!token) {
  //     return <Navigate to="/" />;
  //   }
  //   return children;
  // };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar openSidebar={toogleSidebar} />
        <div style={{ display: "flex" }}>
          <Backdrop Sidebar={sidebar} closeSidebar={toogleSidebar} />
          <Sidebar Sidebar={sidebar} />
        </div>

        <Button variant={"add-post"}>+</Button>

        <Routes>
          <Route path="/" default element={<HomePage />} />
          <Route path="/forum" default element={<PostPage page={"forum"} type={"post"} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forum-detail" element={<DetailPage page={"forum"} type={"detail"} />} />
          <Route path="/post-forum" element={<PostPage page={"forum"} type={"form"} />} />
          <Route path="/survey" default element={<PostPage page={"survey"} type={"post"} />} />
          <Route path="/survey-detail" element={<DetailPage page={"survey"} type={"detail"} />} />
          <Route path="/post-survey" element={<PostPage page={"survey"} type={"form"} />} />
          {/* <Route path="/profile" element={<PostPage page={"forum"} type={"post"} />} /> */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
