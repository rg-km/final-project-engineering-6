import React, { useState } from 'react';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Backdrop from './components/Sidebar/Backdrop';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Button from './components/Button/Button';
import PostPage from './pages/PostPage/PostPage';
import DetailPage from './pages/DetailPage/DetailPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import NotificationsPage from './pages/NotificationsPage/NotificationsPage';
import useTokenStore from './config/Store';
import HomePage from './pages/HomePage/HomePage';
import PageNotFound from "./pages/PageNotFound/PageNotFound";

function App() {
  const [sidebar, setSidebar] = useState(false);
  const token = useTokenStore((state) => state.token);

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
    <div className='App'>
      <BrowserRouter>
        {/* <Alerts severity="success" message="This is a warning aler" /> */}
        <Navbar openSidebar={toogleSidebar} />
        <div style={{ display: 'flex' }}>
          <Backdrop Sidebar={sidebar} closeSidebar={toogleSidebar} />
          <Sidebar Sidebar={sidebar} />
        </div>

        {token && <Button variant={'add-post'}>+</Button>}

        <Routes>
          <Route path='/' default element={<HomePage />} />
          <Route path='register' element={<Register />} />
          <Route path='login' element={<Login />} />
          <Route path='forum'>
            <Route index element={<PostPage page={'forum'} type={'post'} />} />
            <Route
              path=':id'
              element={<DetailPage page={'forum'} type={'detail'} />}
            />
            <Route
              path='form'
              element={<PostPage page={'forum'} type={'form'} />}
            />
          </Route>
          <Route path='survey'>
            <Route index element={<PostPage page={'survey'} type={'post'} />} />
            <Route
              path=':id'
              element={<DetailPage page={'survey'} type={'detail'} />}
            />
            <Route
              path='form'
              element={<PostPage page={'survey'} type={'form'} />}
            />
          </Route>
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/notifications' element={<NotificationsPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
