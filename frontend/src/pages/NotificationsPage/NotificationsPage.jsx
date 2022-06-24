import React, { useEffect, useState } from 'react';
import './NotificationsPage.scss';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { useGet } from '../../config/config';
import useTokenStore from '../../config/Store';
import { useAPI } from '../../config/api';

const NotificationsPage = () => {
  const token = useTokenStore((state) => state.token);
  const [results, status] = useGet('notifications', token);
  const [read, setRead] = useState(false);
  const [data, setData] = useState([]);
  const { put } = useAPI((state) => state);
  const uploadData = new FormData();

  const handleClick = async (id) => {
    if (id) {
      uploadData.append('notif_id', id);
      const res = await put('notifications/read', uploadData, token);

      if (res.status === 200) {
        window.alert('Berhasil Read 1');
        results.splice(results.indexOf(id), 1);
      } else {
        window.alert('Read Gagal 1');
      }
      return;
    }

    const res = await put('notifications/read', {}, token);

    if (res.status === 200) {
      window.alert('Berhasil Read');
      results.splice(results.indexOf(id), 1);
      setRead(false);
    } else {
      window.alert('Read Gagal');
    }
  };

  useEffect(() => {
    setData(results);
  }, [results]);

  useEffect(() => {
    setRead(data.already_read);
  }, [data.already_read]);

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
          console.log(result);
          return (
            <div
              className={read ? 'notif-info' : 'notif-info info-read'}
              onClick={() => handleClick(result.id)}
            >
              {!read && <span className='badge'></span>}

              <NotificationImportantIcon />
              <div className='info-info'>
                <p>
                  <span className='user'> User212 </span>{' '}
                  <span className='user-komen'>mengomentari Postingan</span>{' '}
                  <a href='forum-detail'>Apa itu DevOps!</a>
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
