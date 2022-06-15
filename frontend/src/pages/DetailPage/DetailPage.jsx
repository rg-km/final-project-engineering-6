import React from 'react';
import PostCard from '../../components/PostCard/PostCard';
import './DetailPage.scss';

const DetailPage = ({ page, type }) => {
  return (
    <div className='detail-page'>
      <div className='detail-container'>
        <PostCard page={page} type={type} />
        <div className='comment-container'>
          <PostCard page={page} type={'comment'} />
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
