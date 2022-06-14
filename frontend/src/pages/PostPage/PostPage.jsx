import React from 'react';
import ForumForm from '../../components/ForumForm/ForumForm';
import PostCard from '../../components/PostCard/PostCard';
import './PostPage.scss';

const PostPage = ({ page, type }) => {
  return (
    <div className='page'>
      <div className='post-container'>
        {type === 'post' ? (
          <PostCard page={page} type={type} />
        ) : (
          type === 'form' && <ForumForm />
        )}
      </div>
    </div>
  );
};

export default PostPage;
