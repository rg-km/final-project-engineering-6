import React, { useState } from "react";
import "./FormInput.scss";

const FormInput = (props) => {
  const [inputType] = useState(props.type);
  // const [inputName] = useState(props.name);
  const [inputPlaceholder] = useState(props.placeholder);
  const [inputValue, setInputValue] = useState("");
  const [inputName, setInputName] = useState(props.name);

  function handleChange(event) {
    setInputValue(event.target.value);
    setInputName(event.target.name);
    if (props.onChange) props.onChange(inputValue, inputName);
  }
  return (
    <>
      <input type={inputType} placeholder={inputPlaceholder} value={inputValue} name={inputName} onChange={handleChange} />
    </>
  );
};

export default FormInput;
