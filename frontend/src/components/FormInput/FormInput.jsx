import React, { useState } from "react";
import "./FormInput.scss";

const FormInput = (props) => {
  const [inputType] = useState(props.type);
  const [inputValue, setInputValue] = useState("");

  function handleChange(event) {
    setInputValue(event.target.value);
    if (props.onChange) props.onChange(inputValue);
  }
  return (
    <>
      <input type={inputType} value={inputValue} name="input-form" onChange={handleChange} class="inputclass" />
    </>
  );
};

export default FormInput;
