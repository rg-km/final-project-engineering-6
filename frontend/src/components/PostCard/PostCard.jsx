import React from 'react';
import { Link } from 'react-router-dom';
import useTokenStore, {
  useConfirmStore,
  useDeleteStore,
  useEditStore,
} from '../../config/Store';
import PostContent from '../Post Content/PostContent';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './PostCard.scss';

const PostCard = ({ data, page, type }) => {
  const token = useTokenStore((state) => state.token);
  const setShowConfirm = useConfirmStore((state) => state.setShow);
  const setConfirmData = useEditStore((state) => state.setData);
  const setConfirmType = useConfirmStore((state) => state.setType);
  const setMessageConfirm = useConfirmStore((state) => state.setMessage);
  const setConfirmPage = useConfirmStore((state) => state.setPage);
  const setId = useDeleteStore((state) => state.setId);

  const clickEdit = async (check, datum) => {
    setConfirmType('edit');
    if (check === 'comment' || check === 'reply') {
      setMessageConfirm('Edit this comment?');
      setShowConfirm(true);
      setConfirmData(datum);
      setConfirmPage('comment');
      return;
    }

    setMessageConfirm('Edit this post?');
    setShowConfirm(true);
    setConfirmPage(page);
    setConfirmData(data);
  };

  const clickDelete = async (check, datum) => {
    setConfirmType('delete');
    if (check === 'comment' || check === 'reply') {
      setMessageConfirm('Delete this comment?');
      setShowConfirm(true);
      setId(datum.id);
      setConfirmPage('comment');
      return;
    }

    setMessageConfirm('Delete this post?');
    setShowConfirm(true);
    setId(data.id);
    setConfirmPage(
      page === 'forum' ? `post` : page === 'survey' && `questionnaires`
    );
  };

  return type === 'post' ? (
    token ? (
      <div className='detail-card post-card'>
        {data.is_author && (
          <>
            <div className='edit' onClick={clickEdit}>
              <EditIcon style={{ color: 'f48023' }} />
            </div>
            <div className='delete' onClick={clickDelete}>
              <DeleteIcon style={{ color: 'red' }} />
            </div>
          </>
        )}
        <Link
          to={
            page === 'forum'
              ? `/forum/${data.id}`
              : page === 'survey' && `/survey/${data.id}`
          }
        >
          <PostContent data={data} page={page} type={type} />
        </Link>
      </div>
    ) : (
      <div className='detail-card post-card'>
        {data.is_author && (
          <>
            <div className='edit' onClick={clickEdit}>
              <EditIcon style={{ color: 'f48023' }} />
            </div>
            <div className='delete' onClick={clickDelete}>
              <DeleteIcon style={{ color: 'red' }} />
            </div>
          </>
        )}
        <PostContent data={data} page={page} type={type} />
      </div>
    )
  ) : (
    <div
      className='detail-card'
      style={{ backgroundColor: type === 'comment' && '#f4f4f4' }}
    >
      {data.is_author && type === 'comment' && (
        <>
          <div className='edit' onClick={() => clickEdit('comment', data)}>
            <EditIcon style={{ color: 'f48023' }} />
          </div>
          <div className='delete' onClick={() => clickDelete('comment', data)}>
            <DeleteIcon style={{ color: 'red' }} />
          </div>
        </>
      )}
      <PostContent data={data} page={page} type={type} />
      <div className='reply'>
        {type === 'comment' &&
          data.reply.map((reply) => {
            return (
              <div key={reply.id}>
                {reply.is_author && (
                  <div style={{ position: 'relative' }}>
                    <div
                      className='edit'
                      onClick={() => clickEdit('reply', reply)}
                      style={{ top: '1rem', right: '2.5rem' }}
                    >
                      <EditIcon style={{ color: 'f48023' }} />
                    </div>
                    <div
                      className='delete'
                      onClick={() => clickDelete('reply', reply)}
                      style={{ top: '1rem', right: '0' }}
                    >
                      <DeleteIcon style={{ color: 'red' }} />
                    </div>
                  </div>
                )}
                <PostContent data={reply} page={page} type={'reply'} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PostCard;
