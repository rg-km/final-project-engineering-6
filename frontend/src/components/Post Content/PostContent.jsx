import React, { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LinkIcon from '@mui/icons-material/Link';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import './PostContent.scss';

const PostContent = ({ data, page, type }) => {
  const [likeClicked, setLikeClicked] = useState(false);
  const [commentClicked, setCommentClicked] = useState(false);

  return (
    <div className='content-container'>
      <div
        id='top-section'
        className={type === 'post' ? 'post-content' : 'detail-content'}
      >
        {type !== 'post' && (
          <div className='user-section'>
            <div className='user-avatar'>
              <img src='' alt='user' />
            </div>
            <div className='user-info'>
              <div className='user-name'>
                {type === 'comment' || type === 'reply'
                  ? data.author_name
                  : data.author.name}
              </div>
              {type !== 'comment' && type !== 'reply' && (
                <div className='user-detail'>
                  <p>{data.author.role}</p>
                  <p>{data.author.institute}</p>
                </div>
              )}
            </div>
          </div>
        )}
        <div className='content'>
          {(type !== 'comment' || type !== 'reply') && (
            <>
              <h2 className='content-title'>{data.title}</h2>
              <div className='content-info'>{data.created_at}</div>
            </>
          )}
          <p className='content-description'>
            {type === 'comment' || type === 'reply'
              ? data.comment
              : data.description}
          </p>
          {/* {type ==='detail'&& } */}
          <img src={data.images} alt='Description' />
          {page === 'survey' && type === 'detail' && (
            <>
              <div className='content-link'>
                <LinkIcon />
                <a href={data.link} target='_blank' rel='noreferrer'>
                  {data.link}
                </a>
              </div>
              {data.reward && (
                <p className='content-reward'>
                  <EmojiEventsIcon />
                  {data.reward}
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <div
        id='bottom-section'
        className={type === 'post' ? 'post-content' : 'detail-content'}
      >
        {type === 'post' && (
          <div className='user-section'>
            <div className='user-avatar'>
              <img src='' alt='user' />
            </div>
            <div className='user-info'>
              <div className='user-name'>{data.author.name}</div>
              <div className='user-detail'>
                <p>{data.author.role}</p>
                <p>{data.author.institute}</p>
              </div>
            </div>
          </div>
        )}

        <div className='activity-section'>
          {data.reward && (
            <p className='reward-info'>
              <EmojiEventsIcon />
              {data.reward}
            </p>
          )}
          <div className='like-info'>
            {likeClicked ? (
              <FavoriteIcon
                onClick={() => {
                  type !== 'post' && setLikeClicked(false);
                }}
              />
            ) : (
              <FavoriteBorderIcon
                onClick={() => {
                  setLikeClicked(true);
                }}
              />
            )}
            {type === 'comment' || page === 'survey' || type === 'reply'
              ? data.total_like
              : data.like_count}
          </div>
          <div className='comment-info'>
            {commentClicked ? (
              <ChatBubbleIcon
                onClick={() => {
                  type !== 'post' && setCommentClicked(false);
                }}
              />
            ) : (
              <ChatBubbleOutlineIcon
                onClick={() => {
                  setCommentClicked(true);
                }}
              />
            )}
            {type === 'comment' || type === 'reply'
              ? data.total_reply
              : page === 'survey'
              ? data.total_comment
              : data.comment_count}
          </div>
        </div>
      </div>
      {commentClicked && (
        <form className='input-section'>
          <div className='flex-1'></div>
          <div className='flex-9'>
            <textarea
              name='comment'
              className='comment-input'
              rows='5'
            ></textarea>
            <button
              className='comment-btn'
              onClick={() => {
                setCommentClicked(false);
              }}
            >
              Comment
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostContent;
