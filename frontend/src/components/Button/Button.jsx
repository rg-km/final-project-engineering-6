import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Button.scss";

const Button = (props) => {
  const [variant] = useState(props.variant);
  const [link] = useState(props.link);
  const [showButton, setShowButton] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [location]);

  return variant === "add-post" ? (
    showButton && (
      <Link to={link}>
        <button className={`btn-${variant}`}>{props.children}</button>
      </Link>
    )
  ) : variant === "submit" ? (
    <Link to={link}>
      <button className={`btn-${variant}`}>{props.children}</button>
    </Link>
  ) : (
    <button className={`btn-${variant}`}>{props.children}</button>
  );
};

export default Button;
