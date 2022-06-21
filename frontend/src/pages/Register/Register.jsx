import React, { useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import './Register.scss';
import useTokenStore from '../../Store';
import { register } from '../../api';

const Register = () => {
  const [userData, setUserData] = useState({});
  const [isEmailError, setIsEmailError] = useState(true);
  const [isPwdError, setIsPwdError] = useState(true);
  const setToken = useTokenStore((state) => state.setToken);

  const check = (event) => {
    if (event.target.selectedIndex === 2) {
      document.getElementById('other-input').style.display = 'block';
    } else {
      document.getElementById('other-input').style.display = 'none';
    }
  };

  const handleChange = (eventValue, eventName) => {
    if (eventName === 'email') {
      setIsEmailError(!eventValue.match(/^[a-zA-Z0-9]+@+[a-z]+\.com$/));
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

  const registerClick = async (e) => {
    e.preventDefault();
    const result = await register({
      ...userData,
      batch: Number(userData.batch),
    });
    const form = document.getElementById('register');
    if (result.status === 200) {
      setToken(result.data.token);
      form.childNodes.forEach((input) => (input.childNodes[0].value = ''));
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
                  check(e);
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
            <div id='other-input' style={{ display: 'none' }}>
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
            <div className='button-container'>
              <button
                className='btn'
                variant={'login'}
                disabled={!isEmailError && !isPwdError}
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
