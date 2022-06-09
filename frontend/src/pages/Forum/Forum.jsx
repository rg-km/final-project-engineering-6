import React from 'react';
import PostCard from '../../components/PostCard/PostCard';
import './Forum.scss';

const Forum = () => {
  return (
    <div className='forum'>
      <div className='forum-posts'>
        <PostCard />
        <PostCard />
        <PostCard />
      </div>
    </div>
  );
};

export default Forum;
