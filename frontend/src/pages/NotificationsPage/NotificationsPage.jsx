import React, { useEffect, useState } from 'react';
import './NotificationsPage.scss';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { useGet } from '../../config/config';
import useTokenStore from '../../config/Store';
import { useAPI } from '../../config/api';

const NotificationsPage = () => {
  const token = useTokenStore((state) => state.token);
  const [results, status] = useGet('notifications', token);
  const { put } = useAPI((state) => state);
  const uploadData = new FormData();

  const handleClick = async (id) => {
    console.log(typeof id);
    if (typeof id === 'number') {
      uploadData.append('notif_id', id);
      const res = await put('notifications/read', uploadData, token);

      if (res.status === 200) {
        window.alert('Berhasil Read 1');
        // results.splice(results.indexOf(id), 1);
      } else {
        window.alert('Read Gagal 1');
      }
      return;
    }

    const res = await put('notifications/read', {}, token);

    if (res.status === 200) {
      window.alert('Berhasil Read');
      // setRead(false);
    } else {
      window.alert('Read Gagal');
    }
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
          console.log(result.already_read);
          return (
            <div
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
                <p className='time'>{result.created_at}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default NotificationsPage;
