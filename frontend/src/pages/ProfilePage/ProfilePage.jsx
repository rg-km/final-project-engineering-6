import React from "react";
import "./ProfilePage.scss";
import FotoProfile from "./img-profile.png";
import EditIcon from "@mui/icons-material/Edit";
import PostUser from "../PostUser/PostUser";
import FormInput from "../../components/FormInput/FormInput";
import Btn from "../../components/Button/Button";

import Tabs from "../../components/Tabs/Tabs";
import TabPane from "../../components/Tabs/TabPane";

import { Link } from "react-router-dom";

import PropTypes from "prop-types";
// import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// import Typography from "@mui/material/Typography";

// Modals Edit Profile
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
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
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
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
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="profile-page">
      <div className="post-user">
        <p>My Post</p>
        <Tabs>
          <TabPane name="Post" key="1">
            <div className="post">
              <PostUser page={"forum"} type={"post"} />
              <PostUser page={"forum"} type={"post"} />
              <PostUser page={"forum"} type={"post"} />
            </div>
            {/* Post */}
          </TabPane>
          <TabPane name="Survey" key="2">
            {/* Content of Tab Pane 2 */}
            {<PostUser page={"survey"} type={"post"} />}
            {<PostUser page={"survey"} type={"post"} />}
          </TabPane>
          <TabPane name="Event" key="3">
            You've never done a post event
          </TabPane>
        </Tabs>
      </div>
      <div className="profile">
        <div className="profile-image">
          <img src={FotoProfile} alt="profile" />
        </div>
        <div className="profile-info">
          <p className="name">Mawar Melati</p>
          <hr />
          <p className="institute">Universitas Bunga Indonesia</p>
          <hr />
          <p className="email">mawarmelati@gmail.com</p>
          <div className="edit">
            <Link to>
              <EditIcon style={{ color: "f48023" }} onClick={handleClickOpen} />
            </Link>
          </div>

          <div className="modal">
            <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
              <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Update Your Profile
              </BootstrapDialogTitle>
              <DialogContent dividers>
                <img src={FotoProfile} alt="" width={"60px"} height={"65px"} style={{ borderRadius: "50%" }} />
                Change photo profile
                <FormInput type={"file"} />
                <FormInput value={"Mawar Melati"} />
                <FormInput value={"mawarmelati@gmail.com"} />
                <FormInput placeholder={"Old Password"} />
                <FormInput placeholder={"New Password"} />
              </DialogContent>
              <DialogActions>
                {/* <Button autoFocus onClick={handleClose} variant="login">
                  Save changes
                </Button> */}
                <Btn variant="login">Save Changes</Btn>
              </DialogActions>
            </BootstrapDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
