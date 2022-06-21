import React, { useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import Button from '../../components/Button/Button';
import './Login.scss';

const Login = () => {
  const [userData, setUserData] = useState({});
  const [isNameError, setIsNameError] = useState(true);
  const [isPwdError, setIsPwdError] = useState(true);
  // const [isConfirmPwdError, setIsConfirmPwdError] = useState(true);

  const handleInputChange = (eventValue, eventName) => {
    console.log(eventValue, eventName);
    if (eventName === 'username') {
      setIsNameError(!eventValue.match(/^[a-zA-Z0-9]*$/));
    }

    if (eventName === 'password') {
      setIsPwdError(
        !eventValue.match(/^(?=.[a-z])(?=.[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
      );
    }

    setUserData((previousValues) => {
      return {
        ...previousValues,
        [eventName]: eventValue,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className='container'>
      <div className='form-login'>
        <div className='form'>
          <h2>We’ve missed you!</h2>
          <p>More than 150 questions are waiting for your wise suggestions!</p>
          <form id='loginForm' onSubmit={(e) => handleSubmit(e)}>
            <div className='input-container'>
              <FormInput
                className='username'
                type={'username'}
                placeholder={'username'}
                onChange={handleInputChange}
                name={'username'}
                value={userData.username ? userData.username : ''}
              />
            </div>
            <div className='input-container'>
              <FormInput
                className='pwd'
                id='pwd'
                type={'password'}
                name={'password'}
                placeholder={'Password'}
                onChange={handleInputChange}
              />
            </div>
            <div className='button-container'>
              {/* <Button variant={"login"} type="submit" disabled={isNameError}>
                Login
              </Button> */}
              <button
                type='submit'
                className='submit-btn'
                disabled={isNameError && isPwdError}
              >
                login
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className='gambar'></div>
    </div>
  );
};

export default Login;
