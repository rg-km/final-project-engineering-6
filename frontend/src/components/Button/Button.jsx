import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Button.scss';

const Button = (props) => {
  const [variant] = useState(props.variant);
  const [link, setLink] = useState(props.link);
  const [showButton, setShowButton] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/forum') {
      setShowButton(true);
      setLink('/forum/form');
    } else if (location.pathname === '/survey') {
      setShowButton(true);
      setLink('/survey/form');
    } else {
      setShowButton(false);
    }
    if (location.pathname === '/forum/form') {
      setLink('/forum');
    } else if (location.pathname === '/survey/form') {
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
