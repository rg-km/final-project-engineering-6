import React, { useState } from "react";
import "./Button.scss";

const Button = (props) => {
  const [variant] = useState(props.variant);

  return <button className={`btn-${variant}`}>{props.children}</button>;
};

export default Button;
