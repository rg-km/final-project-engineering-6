import React, { useEffect, useState } from 'react';
import './NotificationsPage.scss';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { useGet } from '../../config/config';
import useTokenStore, { useAlertStore } from '../../config/Store';
import { useAPI } from '../../config/api';

const NotificationsPage = () => {
  const token = useTokenStore((state) => state.token);
  const [results, status] = useGet('notifications', token);
  const { put } = useAPI((state) => state);
  const uploadData = new FormData();
  const setShow = useAlertStore((state) => state.setShow);
  const setSucceed = useAlertStore((state) => state.setSucceed);
  const setMessage = useAlertStore((state) => state.setMessage);

  const handleClick = async (id) => {
    console.log(typeof id);
    if (typeof id === 'number') {
      uploadData.append('notif_id', id);
      const res = await put('notifications/read', uploadData, token);

      setShow(true);
      if (res.status === 200) {
        setMessage('Notification read, please refresh');
        setSucceed(true);
      } else {
        setMessage('Error');
        setSucceed(false);
      }
      return;
    }

    const res = await put('notifications/read', {}, token);

    setShow(true);
    if (res.status === 200) {
      setMessage('Notification read, please refresh');
      setSucceed(true);
    } else {
      setMessage('Error');
      setSucceed(false);
    }
  };

  const changeDate = (dataDate) => {
    let result = 'posted a few hours ago';
    const year = new Date().getFullYear();
    const postYear = new Date(dataDate).getFullYear();

    if (year > postYear) {
      result = `posted ${year - postYear} years ago`;
      return result;
    }

    const month = new Date().getMonth();
    const postMonth = new Date(dataDate).getMonth();

    if (month > postMonth) {
      result = `posted ${month - postMonth} months ago`;
      return result;
    }

    const date = new Date().getDate();
    const postDate = new Date(dataDate).getDate();

    if (date > postDate) {
      result = `posted ${date - postDate} days ago`;
      return result;
    }
    return result;
  };

  return (
    <div className='notif'>
      <div className='header'>
        <h2>Notifications</h2>
        <p className='read' onClick={handleClick}>
          Mark all as read
        </p>
      </div>
      {status &&
        results.map((result) => {
          return (
            <div
              key={result.id}
              className={
                result.already_read ? 'notif-info' : 'notif-info info-read'
              }
              onClick={() => !result.already_read && handleClick(result.id)}
            >
              {!result.already_read && <span className='badge'></span>}

              <NotificationImportantIcon />
              <div className='info-info'>
                <p>
                  <span className='user'>{result.name}</span>{' '}
                  <span className='user-komen'>mengomentari Postingan</span>{' '}
                  <span>{result.post_title}</span>
                </p>
                <p className='time'>{changeDate(result.created_at)}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default NotificationsPage;
