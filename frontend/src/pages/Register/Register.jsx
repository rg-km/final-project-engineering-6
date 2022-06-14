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
      <h2>Register</h2>
      <p>Get more features and priviliges by joining to the most helpful community</p>
      <form>
        <div className="input-container">
          <label>Nama </label>
          <FormInput type={"text"} onChange={handleChange} />
        </div>
        <div className="input-container">
          <label>Email </label>
          <FormInput type={"email"} onChange={handleChange} />
        </div>
        <div className="input-container">
          <label>Password </label>
          <FormInput type={"password"} onChange={handleChange} />
        </div>
        <div className="input-container">
          <label>Role</label>
          <FormInput type={"text"} onChange={handleChange} />
        </div>
        <div className="input-container">
          <label>Institue </label>
          <FormInput type={"text"} onChange={handleChange} />
        </div>
        <div className="input-container">
          <label>Major </label>
          <FormInput type={"text"} onChange={handleChange} />
        </div>
        <div className="button-container">
          <Button className="btn" variant={"regis"}>
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Register;
