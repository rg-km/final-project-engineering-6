import React from "react";
import "./ProfilePage.scss";
import FotoProfile from "./img-profile.png";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="post-user">
        <p>Post User</p>
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
              <EditIcon style={{ color: "f48023" }} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
