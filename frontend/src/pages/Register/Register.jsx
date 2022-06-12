import React from "react";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import "./Register.scss";

const Register = () => {
  function handleChange(event) {
    console.log(event.target.value);
  }
  return (
    <div className="form">
      <form>
        <div className="input-container">
          <label>Username </label>
          <FormInput type={"text"} onChange={handleChange} />
        </div>
        <div className="input-container">
          <label>Username </label>
          <FormInput type={"text"} onChange={handleChange} />
        </div>
        <div className="input-container">
          <label>Username </label>
          <FormInput type={"text"} onChange={handleChange} />
        </div>
        <div className="input-container">
          <label>Username </label>
          <FormInput type={"file"} onChange={handleChange} />
        </div>
        <div className="button-container">
          <Button variant={"regis"}>Register</Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
