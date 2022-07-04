import React, { useState } from 'react';
import './FormInput.scss';

const FormInput = (props) => {
  const [inputType] = useState(props.type);
  const [id] = useState(props.id);
  const [inputPlaceholder] = useState(props.placeholder);
  const [inputValue, setInputValue] = useState(props.value);
  const [inputName, setInputName] = useState(props.name);

  function handleChange(event) {
    setInputValue(event.target.value);
    setInputName(event.target.name);

    if (props.onChange) props.onChange(event.target.value, event.target.name);
  }
  return (
    <>
      <input
        type={inputType}
        id={id}
        placeholder={inputPlaceholder}
        value={inputValue}
        name={inputName}
        onChange={handleChange}
      />
    </>
  );
};

export default FormInput;
