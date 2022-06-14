import React from 'react';
import { Link } from 'react-router-dom';
import PostContent from '../Post Content/PostContent';
import './PostCard.scss';

const PostCard = ({ page }) => {
  return (
    <Link to={'/forum-detail'}>
      <div
        className={page === 'forum' ? 'post-card forum-post-card' : 'post-card'}
        style={{ backgroundColor: page === 'comment' && '#f4f4f4' }}
      >
        <PostContent page={page} />
      </div>
    </Link>
  );
};

export default PostCard;
