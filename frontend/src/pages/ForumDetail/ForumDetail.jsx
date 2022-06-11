import React from 'react';
import PostCard from '../../components/PostCard/PostCard';
import './ForumDetail.scss';

const ForumDetail = () => {
  return (
    <div className='forum-detail-page'>
      <div className='forum-detail-container'>
        <div className='forum-detail-post'>
          <PostCard page={'forum detail'} />
        </div>
        <div className='comment-post'>
          <PostCard page={'comment'} />
          <PostCard page={'comment'} />
          <PostCard page={'comment'} />
        </div>
      </div>
    </div>
  );
};

export default ForumDetail;
