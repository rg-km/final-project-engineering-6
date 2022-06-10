import React from 'react';
import PostCard from '../../components/PostCard/PostCard';
import './Forum.scss';

const Forum = () => {
  return (
    <div className='forum'>
      <div className='forum-posts'>
        <PostCard page={'forum'} />
        <PostCard page={'forum'} />
        <PostCard page={'forum'} />
      </div>
    </div>
  );
};

export default Forum;
