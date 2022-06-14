import React, { useState } from 'react';
import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Backdrop from './components/Sidebar/Backdrop';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Button from './components/Button/Button';
import PostPage from './pages/PostPage/PostPage';
import DetailPage from './pages/DetailPage/DetailPage';

function App() {
  const [sidebar, setSidebar] = useState(false);

  const toogleSidebar = () => {
    setSidebar((prevState) => !prevState);
  };

  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar openSidebar={toogleSidebar} />
        <div style={{ display: 'flex' }}>
          <Backdrop Sidebar={sidebar} closeSidebar={toogleSidebar} />
          <Sidebar Sidebar={sidebar} />
        </div>

        <Button variant={'add-post'} link={'/post-forum'}>
          +
        </Button>

        <Routes>
          <Route
            path='/'
            default
            element={<PostPage page={'forum'} type={'post'} />}
          />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route
            path='/forum-detail'
            element={<DetailPage page={'forum'} type={'detail'} />}
          />
          <Route path='/post-forum' element={<PostPage type={'form'} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
