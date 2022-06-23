import React, { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LinkIcon from "@mui/icons-material/Link";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import "./PostContent.scss";
import Photo from "../../images/img-profile.png";

const PostContent = ({ page, type }) => {
  const [likeClicked, setLikeClicked] = useState(false);
  const [commentClicked, setCommentClicked] = useState(false);

  const imgStyle = {
    width: "4rem",
    height: "4.3rem",
    borderRadius: "50%",
  };

  return (
    <div className="content-container">
      <div id="top-section" className={type === "post" ? "post-content" : "detail-content"}>
        {type !== "post" && (
          <div className="user-section">
            <div className="user-avatar">
              <img src={Photo} alt="user" width={"50rem"} style={imgStyle} />
            </div>
            <div className="user-info">
              <div className="user-name">Name</div>
              <div className="user-detail">
                <p>Tipe User</p>
                <p>Universitas</p>
              </div>
            </div>
          </div>
        )}
        <div className="content">
          {type !== "comment" && (
            <>
              <h2 className="content-title">Lorem ipsum dolor sit amet.</h2>
              <div className="content-info">posted 3 days ago</div>
            </>
          )}
          <p className="content-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi quos est harum modi enim corporis alias error tempora perspiciatis quaerat. Harum sequi modi at quod obcaecati veritatis. Illo, obcaecati tempore, voluptate consectetur non
            veritatis deserunt ipsa dolore praesentium vel maiores quod, nostrum cumque officiis? Odio cum voluptas distinctio quibusdam delectus fugiat, perferendis earum, assumenda ab quasi omnis velit quia cumque, qui nobis obcaecati! Ut voluptate
            animi officia minima numquam ducimus facere totam ullam hic aperiam voluptatibus, sed, nostrum quasi debitis mollitia dolorum tenetur soluta iste earum. Officia delectus itaque ipsam, odio ratione animi incidunt est voluptate voluptatum
            natus mollitia tempore.
          </p>
          {page === "survey" && type === "detail" && (
            <>
              <div className="content-link">
                <LinkIcon />
                <a href="https://forms.google.com" target="_blank" rel="noreferrer">
                  https://forms.google.com
                </a>
              </div>
              <p className="content-reward">
                <EmojiEventsIcon />
                100000
              </p>
            </>
          )}
        </div>
      </div>
      <div id="bottom-section" className={type === "post" ? "post-content" : "detail-content"}>
        {type === "post" && (
          <div className="user-section">
            <div className="user-avatar">
              <img src={Photo} alt="user" />
            </div>
            <div className="user-info">
              <div className="user-name">Name</div>
              <div className="user-detail">
                <p>Tipe User</p>
                <p>Universitas</p>
              </div>
            </div>
          </div>
        )}

        <div className="activity-section">
          {page === "survey" && type === "post" && (
            <p className="reward-info">
              <EmojiEventsIcon />
              100000
            </p>
          )}
          <div className="like-info">
            {likeClicked ? (
              <FavoriteIcon
                onClick={() => {
                  type !== "post" && setLikeClicked(false);
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
          <div className="comment-info">
            {commentClicked ? (
              <ChatBubbleIcon
                onClick={() => {
                  type !== "post" && setCommentClicked(false);
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
      {commentClicked && (
        <form className="input-section">
          <div className="flex-1"></div>
          <div className="flex-9">
            <textarea name="comment" className="comment-input" rows="5"></textarea>
            <button
              className="comment-btn"
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
