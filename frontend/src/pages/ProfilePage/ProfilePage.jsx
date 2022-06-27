import React, { useEffect, useState } from 'react';
import './ProfilePage.scss';
import FotoProfile from '../../images/img-profile.jpg';
import EditIcon from '@mui/icons-material/Edit';
import PostUser from '../PostUser/PostUser';
import FormInput from '../../components/FormInput/FormInput';
import Btn from '../../components/Button/Button';

import Tabs from '../../components/Tabs/Tabs';
import TabPane from '../../components/Tabs/TabPane';

import PropTypes from 'prop-types';
// import Button from "@mui/material/Button";
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useGet } from '../../config/config';
import useTokenStore, { useAlertStore } from '../../config/Store';
import { useAPI } from '../../config/api';
// import Typography from "@mui/material/Typography";

// Modals Edit Profile
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

// End Modals Edit Profile

const ProfilePage = () => {
  const [tab, setTab] = useState(false);
  const [userData, setUserData] = useState({});
  const token = useTokenStore((state) => state.token);
  const [open, setOpen] = React.useState(false);
  const { put, patch } = useAPI((state) => state);
  const uploadData = new FormData();
  const setShow = useAlertStore((state) => state.setShow);
  const setSucceed = useAlertStore((state) => state.setSucceed);
  const setMessage = useAlertStore((state) => state.setMessage);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const tabClick = (e) => {
    e.preventDefault();
    setTab(!tab);
    setUserData((previousValues) => {
      return {
        ...previousValues,
        avatar: '',
      };
    });
  };

  const handleChange = (eventValue, eventName) => {
    setUserData((previousValues) => {
      return {
        ...previousValues,
        [eventName]: eventValue,
      };
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (userData.image) uploadData.append('avatar', userData.image);

    // console.log(uploadData);
    const result = await patch(
      'profile',
      {
        name: userData.name,
        email: userData.email,
      },
      token
    );

    setShow(true);
    if (result.status === 200) {
      if (userData.image) {
        const imageResult = await put(`profile/avatar`, uploadData, token);

        if (imageResult.status === 200) {
          setMessage('Profile updated, please refresh');
          setSucceed(true);
          setOpen(false);
        } else {
          setMessage('Error in updating profile');
          setSucceed(false);
          return;
        }
      }
      setMessage('Profile updated, please refresh');
      setSucceed(true);
      setOpen(false);
    } else {
      setMessage('Please update all data');
      setSucceed(false);
      return;
    }
  };

  const [profileResult, profileStatus] = useGet('profile', token);

  const [forumResult, forumStatus] = useGet('post?me=true', token);

  const [surveyResult, surveyStatus] = useGet('questionnaires?me=true', token);
  // console.log(profileResult);

  const activeStyle = {
    display: 'flex',
    backgroundColor: '#1682fd',
    border: 'none',
    width: '7rem',
    height: '2rem',
    color: ' white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px',
    margin: '0.5rem 0',
  };

  useEffect(() => {
    setUserData({
      name: profileResult.name,
      email: profileResult.email,
      avatar: profileResult.avatar,
    });
  }, [profileResult, open]);

  return (
    <div className='profile-page'>
      <div className='post-user'>
        <p className='profile-page-post'>My Post</p>
        <Tabs>
          <TabPane name='Post' key='1'>
            <div className='post'>
              {forumStatus &&
                forumResult.map((result) => {
                  return (
                    <PostUser
                      page={'forum'}
                      type={'post'}
                      data={result}
                      key={result.id}
                    />
                  );
                })}
            </div>
            {/* Post */}
          </TabPane>
          <TabPane name='Survey' key='2'>
            {/* Content of Tab Pane 2 */}
            {surveyStatus &&
              surveyResult.map((result) => {
                return (
                  <PostUser
                    page={'survey'}
                    type={'post'}
                    data={result}
                    key={result.id}
                  />
                );
              })}
          </TabPane>
        </Tabs>
      </div>
      <div className='profile'>
        <div className='profile-image'>
          <img
            src={
              profileResult.avatar
                ? `http://167.172.84.216/${profileResult.avatar}`
                : FotoProfile
            }
            alt='profile'
          />
        </div>
        <div className='profile-info'>
          {profileStatus && (
            <>
              <p className='name'>{profileResult.name}</p>
              <hr />
              <p className='role'>
                {profileResult.role[0].toUpperCase() +
                  profileResult.role.substring(1)}
              </p>
              <hr />
              <p className='institute'>
                {profileResult.institute}
                {profileResult.major && ` - ${profileResult.major}`}
                {profileResult.batch && ` - ${profileResult.batch}`}
              </p>
              <hr />
              <p className='email'>{profileResult.email}</p>
            </>
          )}
          <div className='edit'>
            <EditIcon style={{ color: 'f48023' }} onClick={handleClickOpen} />
          </div>

          <div className='modal'>
            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby='customized-dialog-title'
              open={open}
            >
              <BootstrapDialogTitle
                id='customized-dialog-title'
                onClose={handleClose}
              >
                Update Your Profile
              </BootstrapDialogTitle>
              <DialogContent dividers>
                <img
                  src={
                    profileResult.avatar
                      ? `http://167.172.84.216/${profileResult.avatar}`
                      : FotoProfile
                  }
                  alt='Profile'
                  width={'60px'}
                  height={'65px'}
                  style={{ borderRadius: '50%' }}
                />
                <div style={activeStyle} onClick={tabClick}>
                  {tab ? 'Upload Image' : 'Input Link'}
                </div>
                {tab ? (
                  <FormInput
                    type={'text'}
                    placeholder={'Image Link'}
                    name={'image'}
                    onChange={handleChange}
                    value={userData.image ? userData.image : ''}
                  />
                ) : (
                  <input
                    type='file'
                    name='image'
                    accept='image/png, image/jpeg'
                    onChange={(e) =>
                      handleChange(e.target.files[0], e.target.name)
                    }
                  />
                )}
                <FormInput
                  type={'text'}
                  placeholder={'Name'}
                  onChange={handleChange}
                  name={'name'}
                  value={userData.name ? userData.name : ''}
                />
                <FormInput
                  type={'email'}
                  placeholder={'Email'}
                  onChange={handleChange}
                  name={'email'}
                  value={userData.email ? userData.email : ''}
                />
              </DialogContent>
              <DialogActions>
                <div style={{ width: '100%' }} onClick={handleClick}>
                  <Btn variant='login'>Save Changes</Btn>
                </div>
              </DialogActions>
            </BootstrapDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
