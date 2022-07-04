import React, { useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import './Register.scss';
import useTokenStore, { useAlertStore } from '../../config/Store';
import { useAPI } from '../../config/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [userData, setUserData] = useState({});
  const [isEmailError, setIsEmailError] = useState(true);
  const [isPwdError, setIsPwdError] = useState(true);
  const setToken = useTokenStore((state) => state.setToken);
  const { post } = useAPI((state) => state);
  let navigate = useNavigate();
  const setShow = useAlertStore((state) => state.setShow);
  const setSucceed = useAlertStore((state) => state.setSucceed);
  const setMessage = useAlertStore((state) => state.setMessage);

  const handleChange = (eventValue, eventName) => {
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

  const registerClick = async (e) => {
    e.preventDefault();
    // data name, email, password, role, institute, major, batch
    console.log(userData);
    const result = await post('register', {
      ...userData,
      batch: Number(userData.batch),
    });
    console.log(result);
    setShow(true);
    if (result.status === 200) {
      setToken(result.data.token);
      setMessage('Registration successful');
      setSucceed(true);
      navigate('/');
    } else {
      setMessage('Registration failed');
      setSucceed(false);
    }
  };

  return (
    <div className='container-reg'>
      <div className='form-register'>
        <div className='form-reg'>
          <h2>Join Basis community</h2>
          <p>
            Get more features and priviliges by joining to the most helpful
            community
          </p>
          <form id='register'>
            <div className='input-container'>
              <FormInput
                type={'text'}
                placeholder={'Name'}
                onChange={handleChange}
                name={'name'}
                value={userData.name ? userData.name : ''}
              />
            </div>
            <div className='input-container'>
              <FormInput
                type={'email'}
                placeholder={'Email'}
                onChange={handleChange}
                name={'email'}
                value={userData.email ? userData.email : ''}
              />
            </div>
            <div className='input-container'>
              <FormInput
                type={'password'}
                placeholder={'Password'}
                onChange={handleChange}
                name={'password'}
                value={userData.password ? userData.password : ''}
              />
            </div>
            <div className='input-container'>
              <select
                id='role'
                defaultValue=''
                onChange={(e) => {
                  handleChange(e.target.value, e.target.name);
                }}
                name={'role'}
              >
                <option value='' disabled>
                  Choose a Role
                </option>
                <option value='siswa'>Siswa</option>
                <option value='mahasiswa'>Mahasiswa</option>
              </select>
            </div>
            {userData.role === 'mahasiswa' ? (
              <div>
                <div className='input-container'>
                  <FormInput
                    type={'text'}
                    placeholder={'Institute'}
                    onChange={handleChange}
                    name={'institute'}
                    value={userData.institute ? userData.institute : ''}
                  />
                </div>
                <div className='input-container'>
                  <FormInput
                    type={'text'}
                    placeholder={'Major'}
                    onChange={handleChange}
                    name={'major'}
                    value={userData.major ? userData.major : ''}
                  />
                </div>
                <div className='input-container'>
                  <FormInput
                    type={'number'}
                    placeholder={'Batch'}
                    onChange={handleChange}
                    name={'batch'}
                    value={userData.batch ? userData.batch : ''}
                  />
                </div>
              </div>
            ) : (
              userData.role === 'siswa' && (
                <div className='input-container'>
                  <FormInput
                    type={'text'}
                    placeholder={'Institute'}
                    onChange={handleChange}
                    name={'institute'}
                    value={userData.institute ? userData.institute : ''}
                  />
                </div>
              )
            )}
            <div className='button-container'>
              <button
                className='btn'
                disabled={isEmailError || isPwdError}
                onClick={registerClick}
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className='gambar'></div>
    </div>
  );
};

export default Register;
