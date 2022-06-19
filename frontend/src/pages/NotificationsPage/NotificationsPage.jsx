import React from "react";
import "./NotificationsPage.scss";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";

const NotificationsPage = () => {
  return (
    <div className="notif">
      <div className="header">
        <h2>Notifications</h2>
        <p className="read">Mark all as read</p>
      </div>
      <div className="notif-info info-read">
        <span className="badge"></span>
        <NotificationImportantIcon />
        <div className="info-info">
          <p>
            <span className="user"> User212 </span> <span className="user-komen">mengomentari Postingan</span> <a href="forum-detail">Apa itu DevOps!</a>
          </p>
          <p className="time">16 Jun, 2022</p>
        </div>
      </div>
      <div className="notif-info">
        <NotificationImportantIcon />
        <div className="info-info">
          <p>
            <span className="user"> MawarMelati </span> <span className="user-komen">mengomentari Postingan</span> <a href="forum-detail">Apa itu DevOps!</a>
          </p>
          <p className="time">16 Jun, 2022</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
