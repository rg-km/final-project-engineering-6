import React from 'react';
import PostContent from '../Post Content/PostContent';
import './PostCard.scss';

const PostCard = ({ page }) => {
  return (
    <div
      className={page === 'forum' ? 'post-card forum-post-card' : 'post-card'}
    >
      <PostContent page={page} />
    </div>
  );
};

export default PostCard;
