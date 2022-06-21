import React, { useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import './Login.scss';
import { login } from '../../api';
import useTokenStore from '../../Store';

const Login = () => {
  const [userData, setUserData] = useState({});
  const [isEmailError, setIsEmailError] = useState(true);
  const [isPwdError, setIsPwdError] = useState(true);
  const setToken = useTokenStore((state) => state.setToken);

  const handleInputChange = (eventValue, eventName) => {
    console.log(eventValue, eventName);
    if (eventName === 'email') {
      setIsEmailError(!eventValue.match(/^[a-zA-Z0-9]+@+[a-z]+\.com$/));
    }

    if (eventName === 'password') {
      setIsPwdError(!eventValue.match(/^[a-zA-Z]*$/));
      setIsPwdError(eventValue.length < 8);
    }

    setUserData((previousValues) => {
      return {
        ...previousValues,
        [eventName]: eventValue,
      };
    });
  };

  const loginClick = async (e) => {
    e.preventDefault();
    const result = await login(userData);
    const form = document.getElementById('loginForm');
    if (result.status === 200) {
      setToken(result.data.token);
      form.childNodes.forEach((input) => (input.childNodes[0].value = ''));
    }
  };

  const showPwd = () => {
    const pwd = document.getElementById('pwd');
    pwd.type === 'password' ? (pwd.type = 'text') : (pwd.type = 'password');
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
                type={'email'}
                placeholder={'Email'}
                onChange={handleInputChange}
                name={'email'}
                value={userData.email ? userData.email : ''}
              />
            </div>
            <div className='input-container'>
              <FormInput
                className='pwd'
                id={'pwd'}
                type={'password'}
                name={'password'}
                placeholder={'Password'}
                onChange={handleInputChange}
                value={userData.password ? userData.password : ''}
              />
            </div>
            <div className='show-pwd'>
              <input type='checkbox' className='check-pwd' onClick={showPwd} />
              Show password
            </div>
            <div className='button-container'>
              <button
                type='submit'
                className='submit-btn'
                disabled={isEmailError || isPwdError}
                onClick={loginClick}
              >
                Login
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
