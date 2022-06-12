import React from "react";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import "./Login.scss";

const Login = () => {
  function handleChange(event) {
    console.log(event.target.value);
  }
  return (
    <div className="form">
      <h2>Login</h2>
      <form>
        <div className="input-container">
          <label>Email </label>
          <FormInput type={"email"} onChange={handleChange} />
        </div>
        <div className="input-container">
          <label>Password </label>
          <FormInput type={"password"} onChange={handleChange} />
        </div>
        <div className="button-container">
          <Button variant={"login"}>Login</Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
