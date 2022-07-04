import React from "react";
import "../../App.scss";
import "./HomePage.scss";
import Banner from "../../images/banner.svg";
import Basis from "../../images/basis.svg";
import Button from "../../components/Button/Button";
import Post from "../../images/post.svg";
import Survey from "../../images/survey.svg";
import Event from "../../images/event.svg";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="container">
        <div className="words">
          <div className="title">
            <h1>Go enhance your school and college life</h1>
            <p>Join other students around Indonesia. Do you want to ask something about school and college things? Just post it and other users will answer it.</p>
            <div className="btn">
              <Link to="/forum">
                <Button variant="login">Open Forum</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="banner">
          <img src={Banner} alt="" />
        </div>
      </div>
      <div className="what">
        <div className="gambar">
          <img src={Basis} alt="" />
        </div>
        <div className="explain">
          <h2>Go post forum or place your survey link </h2>
          <p>
          We try to create a forum platform that students around Indonesia can use. They can ask about anything, share about anything, and expand their connections with other students.  
          </p>
          <br />
          <p>We also provide a place that can be used for sharing survey links. By placing your survey links in BASIS, another user can fill your survey links and you don't need to find other respondents.</p>
          <br />
          <p>we plan to expand our features so we can provide many services that can make your school or college life easier. So stay tuned.</p>
        </div>
      </div>
      <div className="fitur">
        <div className="text-fitur">
          <h1>Our Service</h1>
          <p>We make it easy for users to use our platform</p>
        </div>
        <div className="fitur-wrapper">
          <div className="card">
            <img src={Post} alt="" />
            <h3>Post</h3>
          </div>
          <div className="card">
            <img src={Survey} alt="" />
            <h3>Survey</h3>
          </div>
        </div>
        <div className="footer">
          <p>copyright 2022 | team Basis</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
