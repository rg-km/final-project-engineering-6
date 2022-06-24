import React, { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LinkIcon from '@mui/icons-material/Link';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import './PostContent.scss';
import useTokenStore from '../../config/Store';
import { useAPI } from '../../config/api';
import Photo from '../../images/img-profile.jpg';

const PostContent = ({ data, page, type }) => {
  const [likeClicked, setLikeClicked] = useState(false);
  const [totalLike, setTotalLike] = useState(
    type === 'comment' || page === 'survey' || type === 'reply'
      ? data.total_like
      : data.like_count
  );
  const [commentClicked, setCommentClicked] = useState(false);
  const [userData, setUserData] = useState({});
  const token = useTokenStore((state) => state.token);
  const { post, del } = useAPI((state) => state);

  const handleChange = (eventValue, eventName) => {
    setUserData((previousValues) => {
      return {
        ...previousValues,
        [eventName]: eventValue,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // data post_id, comment, parent_comment_id
    const input = document.getElementsByClassName('comment-input');
    const body = {
      comment: userData.comment,
    };
    if (type === 'detail') {
      body.post_id = data.id;
    } else {
      body.post_id = data.post_id;
      body.parent_comment_id = data.id;
    }
    console.log(body);

    const result = await post('comments', body, token);

    if (result.status === 200) {
      setUserData({});
      input[0].value = '';
      window.alert('Comment Submitted');
      setCommentClicked(false);
    } else {
      window.alert('Submit Failed');
    }
  };

  const clickLike = async () => {
    if (!likeClicked) {
      if (type === 'detail') {
        const result = await post(`post/${data.id}/likes`, {}, token);

        if (result.status === 200) {
          window.alert('Post Liked');
          setTotalLike(totalLike + 1);
          setLikeClicked(true);
        }
      } else if (type === 'comment' || type === 'reply') {
        const result = await post(`comments/${data.id}/likes`, {}, token);

        if (result.status === 200) {
          window.alert('Comment Liked');
          setTotalLike(totalLike + 1);
          setLikeClicked(true);
        }
      }
    } else {
      if (type === 'detail') {
        const result = await del(`post/${data.id}/likes`, token);

        if (result.status === 200) {
          window.alert('Post Disliked');
          setTotalLike(totalLike - 1);
          setLikeClicked(false);
        }
      } else if (type === 'comment' || type === 'reply') {
        const result = await del(`comments/${data.id}/likes`, token);

        if (result.status === 200) {
          window.alert('Comment Disliked');
          setTotalLike(totalLike - 1);
          setLikeClicked(false);
        }
      }
    }
  };
  const imgStyle = {
    width: '4rem',
    height: '4.3rem',
    borderRadius: '50%',
  };

  return (
    <div className='content-container'>
      <div
        id='top-section'
        className={type === 'post' ? 'post-content' : 'detail-content'}
      >
        {type !== 'post' && (
          <div className='user-section'>
            <div className='user-avatar'>
              <img
                src={
                  data.profile_image
                    ? `http://167.172.84.216:8080/${data.profile_image}`
                    : Photo
                }
                alt='user'
                width={'50rem'}
                style={imgStyle}
              />
            </div>
            <div className='user-info'>
              <div className='user-name'>
                {type === 'comment' || type === 'reply'
                  ? data.author_name
                  : data.author.name}
              </div>
              {type !== 'comment' && type !== 'reply' && (
                <div className='user-detail'>
                  <p>
                    {data.author.role[0].toUpperCase() +
                      data.author.role.substring(1)}
                  </p>
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
          {type === 'detail' && page === 'forum' && data.images[0] && (
            <img
              src={`http://167.172.84.216:8080/${data.images[0].url}`}
              alt='Description'
            />
          )}

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
              <img
                src={
                  data.profile_image
                    ? `http://167.172.84.216:8080/${data.profile_image}`
                    : Photo
                }
                alt='user'
              />
            </div>
            <div className='user-info'>
              <div className='user-name'>{data.author.name}</div>
              <div className='user-detail'>
                <p>
                  {data.author.role[0].toUpperCase() +
                    data.author.role.substring(1)}
                </p>
                <p>{data.author.institute}</p>
              </div>
            </div>
          </div>
        )}

        <div className='activity-section'>
          {data.reward && type === 'post' && (
            <p className='reward-info'>
              <EmojiEventsIcon />
              {data.reward}
            </p>
          )}
          <div className='like-info'>
            {likeClicked ? (
              <FavoriteIcon onClick={clickLike} />
            ) : (
              <FavoriteBorderIcon onClick={clickLike} />
            )}
            {totalLike}
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
              onChange={(e) => handleChange(e.target.value, e.target.name)}
              value={userData.comment ? userData.comment : ''}
            ></textarea>
            <button className='comment-btn' onClick={handleSubmit}>
              Comment
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostContent;
