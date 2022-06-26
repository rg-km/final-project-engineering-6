import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import Button from '../Button/Button';

import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import useTokenStore, { useAlertStore } from '../../config/Store';

// for menu logout
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
import FotoProfile from '../../images/img-profile.jpg';

import Logo from '../../images/logo.svg';
import { useGet } from '../../config/config';

const Navbar = ({ openSidebar }) => {
  const token = useTokenStore((state) => state.token);
  const setToken = useTokenStore((state) => state.setToken);
  const setShow = useAlertStore((state) => state.setShow);
  const setSucceed = useAlertStore((state) => state.setSucceed);
  const setMessage = useAlertStore((state) => state.setMessage);
  const [profileResult, profileStatus] = useGet('profile', token);

  const logout = () => {
    setShow(true);
    setSucceed(true);
    setMessage('You have successfully logout');
    setToken(null);
  };

  // hnadel menu user
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <header>
        <nav>
          <div className='menu_icon' onClick={openSidebar}>
            <MenuIcon />
          </div>
          <div className='logo'>
            <Link to='/'>
              <img src={Logo} alt='' />
            </Link>
          </div>
          {token ? (
            <div className='link'>
              <span className='badge'></span>
              <div className='user'>
                <Link to='/notifications'>
                  <NotificationsIcon
                    style={{ fontSize: '2rem', marginTop: '0.3rem' }}
                  />
                </Link>
              </div>
              <div className='notification'>
                {/* <Link to="/profile">
                  <AccountCircleIcon style={{ fontSize: "2rem" }} />
                </Link> */}
                <React.Fragment>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Tooltip title='Account settings'>
                      <IconButton
                        onClick={handleClick}
                        size='small'
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={open ? 'true' : undefined}
                      >
                        <img
                          src={
                            profileStatus
                              ? profileResult.avatar
                                ? `http://167.172.84.216:8080/${profileResult.avatar}`
                                : FotoProfile
                              : FotoProfile
                          }
                          alt='profile'
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    id='account-menu'
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem>
                      <Link to='/profile'>Profile</Link>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={logout}>
                      <ListItemIcon>
                        <Logout fontSize='small' />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </React.Fragment>
              </div>
            </div>
          ) : (
            <div className='link'>
              <Link to='/login' className='login'>
                <Button variant={'login'}>Login</Button>
              </Link>

              <Link to='/register'>
                <Button variant={'regis'}>Register</Button>
              </Link>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
