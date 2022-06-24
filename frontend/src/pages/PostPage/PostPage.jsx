import React from "react";
import FormInput from "../../components/FormInput/FormInput";
import ForumForm from "../../components/ForumForm/ForumForm";
import PostCard from "../../components/PostCard/PostCard";
import SearchIcon from "@mui/icons-material/Search";
import "./PostPage.scss";

const PostPage = ({ page, type }) => {
  const handleChange = (e) => {};

  const handleSearch = () => {};

  return (
    <div className="page">
      {type === "post" && (
        <div className="search-container">
          <div className="search-bar">
            <FormInput type={"text"} placeholder={"Search for post title"} name={"search"} onChange={handleChange} />
            <SearchIcon onClick={handleSearch} />
          </div>
          <div className="search-dropdown">
            <select name="sort" id="sort" defaultValue="" onChange={handleChange}>
              <option value="" disabled>
                Sort by
              </option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most comments">By Most Comments</option>
              <option value="most likes">By Most Likes</option>
            </select>
            <select name="filter" id="filter" defaultValue="" onChange={handleChange}>
              <option value="" disabled>
                Filter by Category
              </option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="Psychology">Psychology</option>
              <option value="Social Politics">Social Politics</option>
              <option value="Engineering">Engineering</option>
              <option value="Technology">Technology</option>
            </select>
          </div>
        </div>
      )}
      <div className="post-container">{type === "post" ? <PostCard page={page} type={type} /> : type === "form" && <ForumForm page={page} />}</div>
    </div>
  );
};

export default PostPage;
