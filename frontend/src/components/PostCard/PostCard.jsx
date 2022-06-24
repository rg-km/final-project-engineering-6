import React from 'react';
import { Link } from 'react-router-dom';
import useTokenStore from '../../config/Store';
import PostContent from '../Post Content/PostContent';
import './PostCard.scss';

const PostCard = ({ data, page, type }) => {
  const token = useTokenStore((state) => state.token);

  return type === 'post' ? (
    token ? (
      <Link
        to={
          page === 'forum'
            ? `/forum/${data.id}`
            : page === 'survey' && `/survey/${data.id}`
        }
      >
        <div className='detail-card post-card'>
          <PostContent data={data} page={page} type={type} />
        </div>
      </Link>
    ) : (
      <div className='detail-card post-card'>
        <PostContent data={data} page={page} type={type} />
      </div>
    )
  ) : (
    <div
      className='detail-card'
      style={{ backgroundColor: type === 'comment' && '#f4f4f4' }}
    >
      <PostContent data={data} page={page} type={type} />
      <div className='reply'>
        {type === 'comment' &&
          data.reply.map((reply) => {
            return (
              <PostContent
                key={reply.id}
                data={reply}
                page={page}
                type={'reply'}
              />
            );
          })}
      </div>
    </div>
  );
};

export default PostCard;
