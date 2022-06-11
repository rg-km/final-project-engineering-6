import React from 'react';
import PostContent from '../Post Content/PostContent';
import './PostCard.scss';

const PostCard = ({ page }) => {
  return (
    <div
      className={page === 'forum' ? 'post-card forum-post-card' : 'post-card'}
      style={{ backgroundColor: page === 'comment' && '#f4f4f4' }}
    >
      <PostContent page={page} />
    </div>
  );
};

export default PostCard;
