import React from 'react';
import { Link } from 'react-router-dom';
import useTokenStore from '../../Store';
import PostContent from '../Post Content/PostContent';
import './PostCard.scss';

const PostCard = ({ data, page, type }) => {
  const token = useTokenStore((state) => state.token);
  const replies = data.reply;

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
          replies.map((reply) => {
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
// author_id: 1
// author_name: "Radit"
// comment: "Comment 2"
// created_at: "2022-06-11T19:33:02.3861157+07:00"
// id: 2
// parent_comment_id: 1
// post_id: 1
// reply: []
// total_like: 0
// total_reply: 0
