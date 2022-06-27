import React, { useEffect, useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LinkIcon from '@mui/icons-material/Link';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import './PostContent.scss';
import useTokenStore, {
  useAlertStore,
  useConfirmStore,
  useEditStore,
} from '../../config/Store';
import { useAPI } from '../../config/api';
import Photo from '../../images/img-profile.jpg';

const PostContent = ({ data, page, type }) => {
  const [totalLike, setTotalLike] = useState(
    type === 'comment' || page === 'survey' || type === 'reply'
      ? data.total_like
      : data.like_count
  );
  const token = useTokenStore((state) => state.token);
  const { post, del, put } = useAPI((state) => state);
  const [likeClicked, setLikeClicked] = useState(
    data.is_like ? data.is_like : false
  );
  const setShow = useAlertStore((state) => state.setShow);
  const setSucceed = useAlertStore((state) => state.setSucceed);
  const setMessage = useAlertStore((state) => state.setMessage);
  const editData = useEditStore((state) => state.data);
  const click = useEditStore((state) => state.click);
  const [userData, setUserData] = useState({});
  const [commentClicked, setCommentClicked] = useState(false);
  const setClick = useEditStore((state) => state.setClick);
  const editType = useConfirmStore((state) => state.page);
  const [date, setDate] = useState('');

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

    // if (!userData.comment) return;
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
    let result = null;

    if (click) {
      body.comment_id = data.id;
      result = await put('comments', body, token);
    } else {
      result = await post('comments', body, token);
    }

    setShow(true);
    if (result.status === 200) {
      setUserData({});
      input[0].value = '';
      setSucceed(true);
      setCommentClicked(false);
      if (click) {
        setClick(false);
        setMessage('Comment edited, please refresh');
      } else {
        setMessage('Comment posted, please refresh');
      }
    } else {
      setMessage('Error in posting comment');
      setSucceed(false);
    }
  };

  useEffect(() => {
    const changeDate = () => {
      const year = new Date().getFullYear();
      const postYear = new Date(data.created_at).getFullYear();

      if (year > postYear) {
        setDate(`posted ${year - postYear} years ago`);
        return;
      }

      const month = new Date().getMonth();
      const postMonth = new Date(data.created_at).getMonth();

      if (month > postMonth) {
        setDate(`posted ${month - postMonth} months ago`);
        return;
      }

      const date = new Date().getDate();
      const postDate = new Date(data.created_at).getDate();

      if (date > postDate) {
        setDate(`posted ${date - postDate} days ago`);
        return;
      }
    };
    changeDate();
  }, [data.created_at]);

  const clickLike = async () => {
    if (!likeClicked) {
      if (type === 'detail') {
        const result = await post(`post/${data.id}/likes`, {}, token);

        if (result.status === 200) {
          setTotalLike(totalLike + 1);
          setLikeClicked(true);
        }
      } else if (type === 'comment' || type === 'reply') {
        const result = await post(`comments/${data.id}/likes`, {}, token);

        if (result.status === 200) {
          setTotalLike(totalLike + 1);
          setLikeClicked(true);
        }
      }
    } else {
      if (type === 'detail') {
        const result = await del(`post/${data.id}/likes`, token);

        if (result.status === 200) {
          setTotalLike(totalLike - 1);
          setLikeClicked(false);
        }
      } else if (type === 'comment' || type === 'reply') {
        const result = await del(`comments/${data.id}/likes`, token);

        if (result.status === 200) {
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

  useEffect(() => {
    if (editType === type && data.id === editData.id) {
      console.log('data');
      setCommentClicked(click);
      handleChange(editData.comment, 'comment');
    }
  }, [click]);

  return (
    <div className='content-container'>
      <div
        id='top-section'
        className={type === 'post' ? 'post-content' : 'detail-content'}
      >
        {type === 'detail' && console.log(data)}
        {type !== 'post' && (
          <div className='user-section'>
            <div className='user-avatar'>
              <img
                src={
                  type === 'detail'
                    ? data.author.profile_image
                      ? `http://167.172.84.216/${data.author.profile_image}`
                      : Photo
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
              <div className='content-info'>{date}</div>
            </>
          )}
          <p className='content-description'>
            {type === 'comment' || type === 'reply'
              ? data.comment
              : data.description}
          </p>
          {type === 'detail' &&
            page === 'forum' &&
            data.images[0] &&
            data.images.map((image, index) => {
              return (
                <img
                  key={index}
                  src={`http://167.172.84.216/${data.images[0].url}`}
                  alt='Description'
                />
              );
            })}

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
                  data.author.profile_image
                    ? `http://167.172.84.216/${data.author.profile_image}`
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
            {type !== 'post' ? (
              likeClicked ? (
                <FavoriteIcon onClick={clickLike} />
              ) : (
                <FavoriteBorderIcon onClick={clickLike} />
              )
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
                  type !== 'post' && setClick(false);
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
