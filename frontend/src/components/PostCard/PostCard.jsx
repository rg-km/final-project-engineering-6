import React, { useState } from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import './PostCard.scss';

const PostCard = ({ page }) => {
  const [likeClicked, setLikeClicked] = useState(false);
  const [commentClicked, setCommentClicked] = useState(false);

  return (
    <div
      className={page === 'forum' ? 'post-card forum-post-card' : 'post-card'}
    >
      <div
        id='top-section'
        className={page === 'forum' ? 'forum-post' : 'forum-detail'}
      >
        {page === 'forum detail' && (
          <div className='user-section'>
            <div className='user-avatar'>
              <img src='' alt='user' />
            </div>
            <div className='user-info'>
              <div className='user-name'>Name</div>
              <div className='user-detail'>
                <p>Tipe User</p>
                <p>Universitas</p>
              </div>
            </div>
          </div>
        )}
        <div className='content'>
          <h2 className='post-title'>Lorem ipsum dolor sit amet.</h2>
          <div className='post-info'>posted 3 days ago</div>
          <p className='post-content'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi quos
            est harum modi enim corporis alias error tempora perspiciatis
            quaerat. Harum sequi modi at quod obcaecati veritatis. Illo,
            obcaecati tempore, voluptate consectetur non veritatis deserunt ipsa
            dolore praesentium vel maiores quod, nostrum cumque officiis? Odio
            cum voluptas distinctio quibusdam delectus fugiat, perferendis
            earum, assumenda ab quasi omnis velit quia cumque, qui nobis
            obcaecati! Ut voluptate animi officia minima numquam ducimus facere
            totam ullam hic aperiam voluptatibus, sed, nostrum quasi debitis
            mollitia dolorum tenetur soluta iste earum. Officia delectus itaque
            ipsam, odio ratione animi incidunt est voluptate voluptatum natus
            mollitia tempore.
          </p>
        </div>
      </div>
      <div
        id='bottom-section'
        className={page === 'forum' ? 'forum-post' : 'forum-detail'}
      >
        {page === 'forum' && (
          <div className='user-section'>
            <div className='user-avatar'>
              <img src='' alt='user' />
            </div>
            <div className='user-info'>
              <div className='user-name'>Name</div>
              <div className='user-detail'>
                <p>Tipe User</p>
                <p>Universitas</p>
              </div>
            </div>
          </div>
        )}
        <div className='activity-section'>
          <div className='like-info'>
            {page === 'forum' ? (
              <FavoriteIcon />
            ) : likeClicked ? (
              <FavoriteIcon
                onClick={() => {
                  setLikeClicked(false);
                }}
              />
            ) : (
              <FavoriteBorderIcon
                onClick={() => {
                  setLikeClicked(true);
                }}
              />
            )}
            123
          </div>
          <div className='comment-info'>
            {page === 'forum' ? (
              <ChatBubbleIcon />
            ) : commentClicked ? (
              <ChatBubbleIcon
                onClick={() => {
                  setCommentClicked(false);
                }}
              />
            ) : (
              <ChatBubbleOutlineIcon
                onClick={() => {
                  setCommentClicked(true);
                }}
              />
            )}
            456
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
