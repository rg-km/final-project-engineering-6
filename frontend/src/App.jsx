import React, { useEffect, useState } from 'react';
import './App.scss';
import { useNavigate } from 'react-router-dom';
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
import useTokenStore, {
  useAlertStore,
  useConfirmStore,
  useDeleteStore,
  useEditStore,
} from './config/Store';
import HomePage from './pages/HomePage/HomePage';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import { Alert } from '@mui/material';
import { useAPI } from './config/api';

function App() {
  const [sidebar, setSidebar] = useState(false);
  const { del } = useAPI((state) => state);
  const token = useTokenStore((state) => state.token);
  const show = useAlertStore((state) => state.show);
  const setShow = useAlertStore((state) => state.setShow);
  const setSucceed = useAlertStore((state) => state.setSucceed);
  const setMessage = useAlertStore((state) => state.setMessage);
  const message = useAlertStore((state) => state.message);
  const succeed = useAlertStore((state) => state.succeed);
  const setShowConfirm = useConfirmStore((state) => state.setShow);
  const showConfirm = useConfirmStore((state) => state.show);
  const messageConfirm = useConfirmStore((state) => state.message);
  const confirmPage = useConfirmStore((state) => state.page);
  const id = useDeleteStore((state) => state.id);
  const data = useEditStore((state) => state.data);
  const setClick = useEditStore((state) => state.setClick);
  const type = useConfirmStore((state) => state.type);
  let navigate = useNavigate();

  const toogleSidebar = () => {
    setSidebar((prevState) => !prevState);
  };

  useEffect(() => {
    let countDown = 5;
    if (show === true) {
      const timer = setInterval(() => {
        if (show === true) countDown -= 1;

        if (countDown === 0) {
          setShow(false);
          clearInterval(timer);
        }
      }, 1000);
    }
  }, [show, setShow]);

  const clickDelete = async () => {
    if (confirmPage === 'comment') {
      const result = await del(`comments/${id}`, token);

      setShow(true);
      if (result.status === 200) {
        setMessage('Comment has been deleted, please refresh');
        setSucceed(true);
      } else {
        setMessage('Error in deleting comment');
        setSucceed(false);
      }
      return;
    }

    const result = await del(`${confirmPage}/${id}`, token);

    setShow(true);
    if (result.status === 200) {
      setMessage('Post has been deleted, please refresh');
      setSucceed(true);
    } else {
      setMessage('Error in deleting post');
      setSucceed(false);
    }
  };

  const clickEdit = async () => {
    if (confirmPage === 'comment') {
      setClick(true);
      return;
    }
    navigate(`/${confirmPage}/form`, { state: { data, state: 'edit' } });
  };

  // const ProtectedRoute = ({ children }) => {
  //   if (!token) {
  //     return <Navigate to="/" />;
  //   }
  //   return children;
  // };
  return (
    <div className='App'>
      <Navbar openSidebar={toogleSidebar} />
      <div style={{ display: 'flex' }}>
        <Backdrop Sidebar={sidebar} closeSidebar={toogleSidebar} />
        <Sidebar Sidebar={sidebar} />
      </div>

      {show && (
        <Alert
          severity={succeed ? 'success' : 'error'}
          style={{
            marginBottom: '1rem',
            position: 'fixed',
            bottom: '3rem',
            left: '3rem',
            zIndex: 20,
            opacity: 0.9,
          }}
        >
          {message}
        </Alert>
      )}
      {token && <Button variant={'add-post'}>+</Button>}

      {showConfirm && (
        <div id='confirmOverlay'>
          <div id='confirmBox'>
            <h2>{messageConfirm}</h2>

            <div id='confirmButtons'>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  if (type === 'edit') {
                    clickEdit();
                  } else {
                    clickDelete();
                  }
                }}
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

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
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
