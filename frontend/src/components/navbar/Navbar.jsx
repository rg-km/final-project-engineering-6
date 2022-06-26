import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import Button from "../Button/Button";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useTokenStore from "../../config/Store";

// for menu logout
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import Logo from "../../images/logo.svg";

const Navbar = ({ openSidebar }) => {
  const token = useTokenStore((state) => state.token);

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
          <div className="menu_icon" onClick={openSidebar}>
            <MenuIcon />
          </div>
          <div className="logo">
            <Link to="/">
              <img src={Logo} alt="" />
            </Link>
          </div>
          {token ? (
            <div className="link">
              <span className="badge"></span>
              <div className="user">
                <Link to="/notifications">
                  <NotificationsIcon style={{ fontSize: "2rem", marginTop: "0.3rem" }} />
                </Link>
              </div>
              <div className="notification">
                {/* <Link to="/profile">
                  <AccountCircleIcon style={{ fontSize: "2rem" }} />
                </Link> */}
                <React.Fragment>
                  <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                    <Tooltip title="Account settings">
                      <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }} aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined}>
                        <Avatar sx={{ width: 32, height: 32 }}></Avatar>
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem>
                      <Link to="/profile">Profile</Link>
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </React.Fragment>
              </div>
            </div>
          ) : (
            <div className="link">
              <Link to="/login" className="login">
                <Button variant={"login"}>Login</Button>
              </Link>

              <Link to="/register">
                <Button variant={"regis"}>Register</Button>
              </Link>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
