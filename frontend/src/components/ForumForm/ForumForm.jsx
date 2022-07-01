import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAPI } from '../../config/api';
import { useGet } from '../../config/config';
import useTokenStore, { useAlertStore } from '../../config/Store';
import Button from '../Button/Button';
import FormInput from '../FormInput/FormInput';
import './ForumForm.scss';

const ForumForm = ({ page }) => {
  const token = useTokenStore((state) => state.token);
  const { post, put } = useAPI((state) => state);
  const setShow = useAlertStore((state) => state.setShow);
  const setSucceed = useAlertStore((state) => state.setSucceed);
  const setMessage = useAlertStore((state) => state.setMessage);
  const uploadData = new FormData();
  let navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(
    location.state
      ? {
          id: location.state.data.id,
          title: location.state.data.title,
          description: location.state.data.description,
          category: location.state.data.category_id
            ? location.state.data.category_id
            : location.state.data.category.id,
          image: location.state.data.images
            ? location.state.data.images[0]
            : '',
          link: location.state.data.link,
          reward: location.state.data.reward,
        }
      : {}
  );

  const [categories, getStatus] = useGet('category', token);

  const handleChange = (eventValue, eventName) => {
    setUserData((previousValues) => {
      return {
        ...previousValues,
        [eventName]: eventValue,
      };
    });
  };

  const handleSubmit = async (e) => {
    // data category_id, title, description
    e.preventDefault();

    if (userData === {}) return;
    if (userData.image) {
      console.log(userData.image);
      for (let i = 0; i < userData.image.length; i++) {
        uploadData.append('images', userData.image[i]);
      }
    }

    const data = {
      category_id: Number(userData.category),
      title: userData.title,
      description: userData.description,
    };
    if (page === 'survey') data.link = userData.link;
    if (userData.reward) data.reward = userData.reward;

    const result = await post(
      page === 'forum' ? `post` : page === 'survey' && `questionnaires`,
      data,
      token
    );

    setShow(true);
    if (result.status === 200) {
      // data images
      if (page === 'forum' && userData.image) {
        const imageResult = await post(
          `post/images/${result.data.id}`,
          uploadData,
          token
        );

        if (imageResult.status === 200) {
          setSucceed(true);
          navigate('/forum');
        } else {
          setSucceed(false);
          return;
        }
      }

      setSucceed(true);
      setMessage(`${page === 'forum' ? 'Forum' : 'Survey'} posted`);
      navigate(`${page === 'forum' ? '/forum' : '/survey'}`);
    } else {
      setSucceed(false);
      setMessage(`Error in posting ${page === 'forum' ? 'forum' : 'survey'}`);
    }
  };

  const handleEdit = async (e) => {
    // data category_id, title, description
    e.preventDefault();

    if (userData === {}) return;
    if (userData.image) uploadData.append('images', userData.image);
    const data = {
      id: userData.id,
      category_id: Number(userData.category),
      title: userData.title,
      description: userData.description,
    };
    if (page === 'survey') data.link = userData.link;
    if (userData.reward) data.reward = userData.reward;

    const result = await put(
      page === 'forum' ? `post` : page === 'survey' && `questionnaires`,
      data,
      token
    );

    setShow(true);
    if (result.status === 200) {
      // data images
      if (page === 'forum' && userData.image) {
        const imageResult = await post(
          `post/images/${result.data.id}`,
          uploadData,
          token
        );

        if (imageResult.status === 200) {
          setSucceed(true);
          setMessage('Edit successful');
          navigate('/forum');
        } else {
          setMessage('Error in updating image');
          setSucceed(false);
          return;
        }
      }

      setSucceed(true);
      setMessage('Edit successful');
      navigate(`${page === 'forum' ? '/forum' : '/survey'}`);
    } else {
      setMessage(`Error in updating ${page === 'forum' ? 'forum' : 'survey'}`);
      setSucceed(false);
    }
  };

  return (
    <form
      onSubmit={location.state?.state === 'edit' ? handleEdit : handleSubmit}
      id='submitForm'
      className='forum-form'
    >
      <div className='input-section'>
        <div className='input-container'>
          <label>Title</label>
          <span>*</span>
          <FormInput
            type={'text'}
            placeholder={'Title'}
            name={'title'}
            onChange={handleChange}
            value={userData.title ? userData.title : ''}
          />
        </div>
        <div className='input-container'>
          <label>Description</label>
          <span>*</span>
          <textarea
            type='text'
            name='description'
            placeholder='Description'
            rows='5'
            onChange={(e) => handleChange(e.target.value, e.target.name)}
            value={userData.description ? userData.description : ''}
          ></textarea>
        </div>
        {page === 'survey' && (
          <div className='input-container'>
            <label>Survey Link</label>
            <span>*</span>
            <FormInput
              type={'text'}
              placeholder={'Survey Link'}
              name={'link'}
              onChange={handleChange}
              value={userData.link ? userData.link : ''}
            />
          </div>
        )}
        <div className='input-container'>
          <label>Category</label>
          <span>*</span>
          <select
            name='category'
            id='category'
            // defaultValue=''
            onChange={(e) => handleChange(e.target.value, e.target.name)}
            value={userData.category ? userData.category : ''}
          >
            <option value='' disabled>
              Choose a Category
            </option>
            {getStatus &&
              categories.map((category) => {
                return (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
          </select>
        </div>
        {page === 'survey' && (
          <div className='input-container'>
            <label>Reward</label>
            <FormInput
              type={'number'}
              placeholder={'Reward'}
              name={'reward'}
              onChange={handleChange}
              value={userData.reward ? userData.reward : ''}
            />
          </div>
        )}
        {page === 'forum' && (
          <div className='input-container'>
            <label>Image</label>
            <input
              type='file'
              name='image'
              multiple
              accept='image/png, image/jpeg'
              onChange={(e) => handleChange(e.target.files, e.target.name)}
            />
          </div>
        )}
      </div>
      <div className='button-container'>
        <Button variant={'submit'}>Submit</Button>
      </div>
    </form>
  );
};

export default ForumForm;
