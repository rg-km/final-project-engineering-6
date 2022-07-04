import React from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../../components/PostCard/PostCard';
import { useGet } from '../../config/config';
import useTokenStore from '../../config/Store';
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
  const [comments, commentStatus] = useGet(`comments?postID=${id}`, token);

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
