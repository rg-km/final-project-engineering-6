import React from 'react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import './PostCard.scss';

const PostCard = () => {
  return (
    <div className='post-card'>
      <div id='top-section' className='forum-post'>
        <div className='content'>
          <h2 className='post-title'>Lorem ipsum dolor sit amet.</h2>
          <div className='post-info'>posted 3 days ago</div>
          <p className='post-content'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
            obcaecati ipsum nesciunt incidunt veniam. Assumenda repudiandae ipsa
            blanditiis provident expedita quis dolore quia omnis? Maiores
            voluptates modi recusandae aspernatur voluptatum!
          </p>
        </div>
      </div>
      <div id='bottom-section' className='forum-post'>
        <div className='user-section'>
          <div className='user-avatar'>
            <img src='' alt='user' />
          </div>
          <div className='user-info'>
            <div className='user-name'>Name</div>
            <div className='user-detail'>Tipe User . Universitas</div>
          </div>
        </div>
        <div className='activity-section'>
          <div className='like-info'>
            <FavoriteIcon />
            123
          </div>
          <div className='comment-info'>
            <ChatBubbleIcon />
            456
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
