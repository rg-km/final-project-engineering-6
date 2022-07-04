import React from 'react';
import ForumForm from '../../components/ForumForm/ForumForm';
import PostCard from '../../components/PostCard/PostCard';
import './PostUser.module.scss';

const PostUser = ({ page, type, data }) => {
  return (
    <div className='user'>
      <div style={{ marginTop: '1rem' }} className='user-container'>
        {type === 'post' ? (
          <PostCard page={page} type={type} data={data} />
        ) : (
          type === 'form' && <ForumForm page={page} />
        )}
      </div>
    </div>
  );
};

export default PostUser;
