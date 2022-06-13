import React, { useState } from 'react';
import './FormInput.scss';

const FormInput = (props) => {
  const [inputType] = useState(props.type);
  const [inputName] = useState(props.name);
  const [inputPlaceholder] = useState(props.placeholder);
  const [inputValue, setInputValue] = useState('');

  function handleChange(event) {
    setInputValue(event.target.value);
    if (props.onChange) props.onChange(inputValue);
  }
  return (
    <>
      <input
        type={inputType}
        placeholder={inputPlaceholder}
        value={inputValue}
        name={inputName}
        onChange={handleChange}
      />
    </>
  );
};

export default FormInput;
