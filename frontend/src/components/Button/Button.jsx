import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Button.scss';

const Button = (props) => {
  const [variant] = useState(props.variant);
  const [link, setLink] = useState(props.link);
  const [showButton, setShowButton] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setShowButton(true);
      setLink('/post-forum');
    } else if (location.pathname === '/survey') {
      setShowButton(true);
      setLink('/post-survey');
    } else {
      setShowButton(false);
    }
    if (location.pathname === '/post-forum') {
      setLink('/');
    } else if (location.pathname === '/post-survey') {
      setLink('/survey');
    }
  }, [location]);

  return variant === 'add-post' ? (
    showButton && (
      <Link to={link}>
        <button className={`btn-${variant}`}>{props.children}</button>
      </Link>
    )
  ) : variant === 'submit' ? (
    <Link to={link}>
      <button className={`btn-${variant}`}>{props.children}</button>
    </Link>
  ) : (
    <button className={`btn-${variant}`}>{props.children}</button>
  );
};

export default Button;
