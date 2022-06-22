import React from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../../components/PostCard/PostCard';
import { useGet } from '../../config';
import useTokenStore from '../../Store';
import './DetailPage.scss';

const DetailPage = ({ page, type }) => {
  const token = useTokenStore((state) => state.token);
  const { id } = useParams();

  const [result, status] = useGet(
    page === 'forum'
      ? `post/${id}`
      : page === 'survey' && `questionnaires/${id}`,
    token
  );
  const [comments, commentStatus] = useGet(`comments?postID=${id}`);

  return (
    <div className='detail-page'>
      <div className='detail-container'>
        {status && <PostCard data={result} page={page} type={type} />}
        <div className='comment-container'>
          {commentStatus &&
            comments.map((comment) => {
              return (
                <PostCard
                  key={comment.id}
                  data={comment}
                  page={page}
                  type={'comment'}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
//   author_id: 1
// author_name: "Radit"
// comment: "Comment 1"
// created_at: "2022-06-11T19:33:02.3861157+07:00"
// id: 1
// parent_comment_id: null
// post_id: 1
// reply: (2) [{…}, {…}]
// total_like: 0
// total_reply: 2
