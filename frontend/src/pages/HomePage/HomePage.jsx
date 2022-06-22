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
            <h1>Don’t wanna Make you have A bad day</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus consequuntur odit quam sint sapiente aspernatur omnis accusamus rerum asperiores ipsam.</p>
            <div className="btn">
              <Link to="/forum">
                <Button variant="login">Join Forum</Button>
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
          <h2>Get quality, hyper-focused, uninterrupted work done </h2>
          <p>
            Endless to-do lists and constant distractions from coworkers, calendars and cuddly pets means that you’re probably wasting a lot of time. Seque helps you to plan, focus and optimize your time so that you can get more done in less time.
          </p>
          <br />
          <p>Work distraction-free immersed in deep focus blocks, one task at a time. Increase your productivity by knowing exactly how and when you get the most done.</p>
        </div>
      </div>
      <div className="fitur">
        <div className="card">
          <img src={Post} alt="" />
          <h3>Post</h3>
        </div>
        <div className="card">
          <img src={Survey} alt="" />
          <h3>Survey</h3>
        </div>
        <div className="card">
          <img src={Event} alt="" />
          <h3>Event</h3>
        </div>
      </div>
      <div className="footer">
        <p>copyright 2022 | team Basis</p>
      </div>
    </div>
  );
};

export default HomePage;
