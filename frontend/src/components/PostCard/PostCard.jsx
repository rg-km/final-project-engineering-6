import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useTokenStore from '../../config/Store';
import PostContent from '../Post Content/PostContent';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './PostCard.scss';
import { useAPI } from '../../config/api';

const PostCard = ({ data, page, type }) => {
  const token = useTokenStore((state) => state.token);
  const { del } = useAPI((state) => state);
  let navigate = useNavigate();

  const clickEdit = async (check, datum) => {
    if (check === 'comment' || check === 'reply') {
      if (window.confirm('Edit this comment?') === true) {
        // const result = await del(`comments/${datum.id}`, token);
        // if (result.status === 200) {
        //   window.alert('Delete Succeed');
        // }
      }
      return;
    }
    if (window.confirm('Edit this post?') === true) {
      navigate(
        page === 'forum' ? '/forum/form' : page === 'survey' && '/survey/form',
        { state: { data, state: 'edit' } }
      );
    }
  };

  const clickDelete = async (check, datum) => {
    if (check === 'comment' || check === 'reply') {
      if (window.confirm('Delete this comment?') === true) {
        const result = await del(`comments/${datum.id}`, token);

        if (result.status === 200) {
          window.alert('Delete Succeed');
        }
      }
      return;
    }
    if (window.confirm('Delete this post?') === true) {
      const result = await del(
        page === 'forum'
          ? `post/${data.id}`
          : page === 'survey' && `questionnaires/${data.id}`,
        token
      );

      if (result.status === 200) {
        window.alert('Delete Succeed');
      }
    }
  };

  return type === 'post' ? (
    token ? (
      <div className='detail-card post-card'>
        {data.is_author && (
          <>
            <div className='edit' onClick={clickEdit}>
              <EditIcon style={{ color: 'f48023' }} />
            </div>
            <div className='delete' onClick={clickDelete}>
              <DeleteIcon style={{ color: 'red' }} />
            </div>
          </>
        )}
        <Link
          to={
            page === 'forum'
              ? `/forum/${data.id}`
              : page === 'survey' && `/survey/${data.id}`
          }
        >
          <PostContent data={data} page={page} type={type} />
        </Link>
      </div>
    ) : (
      <div className='detail-card post-card'>
        {data.is_author && (
          <>
            <div className='edit' onClick={clickEdit}>
              <EditIcon style={{ color: 'f48023' }} />
            </div>
            <div className='delete' onClick={clickDelete}>
              <DeleteIcon style={{ color: 'red' }} />
            </div>
          </>
        )}
        <PostContent data={data} page={page} type={type} />
      </div>
    )
  ) : (
    <div
      className='detail-card'
      style={{ backgroundColor: type === 'comment' && '#f4f4f4' }}
    >
      {data.is_author && type === 'comment' && (
        <>
          <div className='edit' onClick={() => clickEdit('comment', data)}>
            <EditIcon style={{ color: 'f48023' }} />
          </div>
          <div className='delete' onClick={() => clickDelete('comment', data)}>
            <DeleteIcon style={{ color: 'red' }} />
          </div>
        </>
      )}
      <PostContent data={data} page={page} type={type} />
      <div className='reply'>
        {type === 'comment' &&
          data.reply.map((reply) => {
            return (
              <div key={reply.id}>
                {reply.is_author && (
                  <div style={{ position: 'relative' }}>
                    <div
                      className='edit'
                      onClick={() => clickEdit('reply', reply)}
                      style={{ top: '1rem', right: '2.5rem' }}
                    >
                      <EditIcon style={{ color: 'f48023' }} />
                    </div>
                    <div
                      className='delete'
                      onClick={() => clickDelete('reply', reply)}
                      style={{ top: '1rem', right: '0' }}
                    >
                      <DeleteIcon style={{ color: 'red' }} />
                    </div>
                  </div>
                )}
                <PostContent data={reply} page={page} type={'reply'} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PostCard;
