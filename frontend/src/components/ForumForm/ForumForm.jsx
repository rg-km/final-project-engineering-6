import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAPI } from '../../api';
import { useGet } from '../../config';
import useTokenStore from '../../Store';
import Button from '../Button/Button';
import FormInput from '../FormInput/FormInput';
import './ForumForm.scss';

const ForumForm = ({ page }) => {
  const [userData, setUserData] = useState({});
  const [tab, setTab] = useState(false);
  const token = useTokenStore((state) => state.token);
  const { post } = useAPI((state) => state);
  const uploadData = new FormData();
  let navigate = useNavigate();

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

    uploadData.append('images', userData.image);

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

    if (result.status === 200) {
      // data images
      if (page === 'forum') {
        const imageResult = await post(
          `post/images/${result.data.id}`,
          uploadData,
          token
        );

        if (imageResult.status === 200) {
          window.alert('Post Submitted');
          navigate('/forum');
        } else {
          window.alert('Submit Failed 1');
        }
      }

      window.alert('Post Submitted');
      navigate('/survey');
    } else {
      window.alert('Submit Failed');
    }
  };

  const tabClick = (e) => {
    console.log('object');
    e.preventDefault();
    setTab(!tab);
    setUserData((previousValues) => {
      return {
        ...previousValues,
        image: '',
      };
    });
  };

  return (
    <form onSubmit={handleSubmit} id='submitForm' className='forum-form'>
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
            <label>
              Image{' '}
              <div className='tab'>
                <div
                  onClick={tabClick}
                  className={tab ? 'active-tab' : undefined}
                >
                  Link
                </div>
                <div
                  className={!tab ? 'active-tab' : undefined}
                  onClick={tabClick}
                >
                  Upload
                </div>
              </div>
            </label>
            {tab ? (
              <FormInput
                type={'text'}
                placeholder={'Image Link'}
                name={'image'}
                onChange={handleChange}
                value={userData.image ? userData.image : ''}
              />
            ) : (
              <input
                type='file'
                name='image'
                accept='image/png, image/jpeg'
                onChange={(e) => handleChange(e.target.value, e.target.name)}
                value={userData.image ? userData.image : ''}
              />
            )}
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
