import React from "react";
import { Link } from "react-router-dom";
import PostContent from "../Post Content/PostContent";
import "./PostCard.scss";

const PostCard = ({ page, type }) => {
  return type === "post" ? (
    <Link to={page === "forum" ? "/forum-detail" : page === "survey" && "/survey-detail"}>
      <div className="detail-card post-card">
        <PostContent page={page} type={type} />
      </div>
    </Link>
  ) : (
    <div className="detail-card" style={{ backgroundColor: type === "comment" && "#f4f4f4" }}>
      <PostContent page={page} type={type} />
    </div>
  );
};

export default PostCard;
