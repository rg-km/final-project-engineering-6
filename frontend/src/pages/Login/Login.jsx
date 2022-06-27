import React, { useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import './Login.scss';
import { useAPI } from '../../config/api';
import useTokenStore, { useAlertStore } from '../../config/Store';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [userData, setUserData] = useState({});
  const [isEmailError, setIsEmailError] = useState(true);
  const [isPwdError, setIsPwdError] = useState(true);
  const setToken = useTokenStore((state) => state.setToken);
  const { post } = useAPI((state) => state);
  let navigate = useNavigate();
  const setShow = useAlertStore((state) => state.setShow);
  const setSucceed = useAlertStore((state) => state.setSucceed);
  const setMessage = useAlertStore((state) => state.setMessage);

  const handleInputChange = (eventValue, eventName) => {
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
    // data email, password

    const result = await post('login', userData);

    setShow(true);
    if (result.status === 200) {
      setToken(result.data.token);
      setMessage('Login successful');
      setSucceed(true);
      navigate('/forum');
    } else {
      setMessage('Login failed');
      setSucceed(false);
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
              <input type='checkbox' className='' onClick={showPwd} />
              <p>Show Password</p>
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
