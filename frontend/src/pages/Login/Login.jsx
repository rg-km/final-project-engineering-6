import React from "react";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import "./Login.scss";

const Login = () => {
  function handleChange(event) {
    console.log(event.target.value);
  }
  return (
    <form className="login">
      <div className="input-container">
        <label>Email </label>
        <FormInput type={"text"} onChange={handleChange} />
      </div>
      <div className="input-container">
        <label>Password </label>
        <FormInput type={"text"} onChange={handleChange} />
      </div>
      <div className="button-container">
        <Button variant={"login"}>Login</Button>
      </div>
    </form>
  );
};

export default Login;
