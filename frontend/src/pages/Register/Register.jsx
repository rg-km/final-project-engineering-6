import React from "react";
import FormInput from "../../components/FormInput/FormInput";
import Button from "../../components/Button/Button";
import "./Register.scss";

const Register = () => {
  const check = (event) => {
    console.log(event);
    if (event.target.selectedIndex === 2) {
      document.getElementById("other-input").style.display = "block";
    } else {
      document.getElementById("other-input").style.display = "none";
    }
  };

  const handleChange = (event) => {
    console.log(event.target.value);
  };

  return (
    <div className="container-reg">
      <div className="form-register">
        <div className="form-reg">
          <h2>Join Basis community</h2>
          <p>Get more features and priviliges by joining to the most helpful community</p>
          <form>
            <div className="input-container">
              <FormInput type={"text"} placeholder={"Nama"} onChange={handleChange} />
            </div>
            <div className="input-container">
              <FormInput type={"email"} placeholder={"Email"} onChange={handleChange} />
            </div>
            <div className="input-container">
              <FormInput type={"password"} placeholder={"Password"} onChange={handleChange} />
            </div>
            <div className="input-container">
              <select name="role" id="role" defaultValue="" onChange={check}>
                <option value="" disabled>
                  Choose a Role
                </option>
                <option value="Siswa">Siswa</option>
                <option value="Mahasiswa">Mahasiswa</option>
              </select>
            </div>
            <div id="other-input" style={{ display: "none" }}>
              <div className="input-container">
                <FormInput type={"text"} placeholder={"Institue"} onChange={handleChange} />
              </div>
              <div className="input-container">
                <FormInput type={"text"} placeholder={"Mayor"} onChange={handleChange} />
              </div>
            </div>
            <div className="button-container">
              <Button className="btn" variant={"login"}>
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>
      <div className="gambar"></div>
    </div>
  );
};

export default Register;
