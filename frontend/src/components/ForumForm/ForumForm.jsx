import React from 'react';
import { useGet } from '../../config';
import useTokenStore from '../../Store';
import Button from '../Button/Button';
import FormInput from '../FormInput/FormInput';
import './ForumForm.scss';

const ForumForm = ({ page }) => {
  const token = useTokenStore((state) => state.token);

  const [categories, getStatus] = useGet('category', token);

  const handleChange = (e) => {
    console.log(e.target.value);
  };

  const handleSubmit = () => {};

  return (
    <form onSubmit={handleSubmit} className='forum-form'>
      <div className='input-section'>
        <div className='input-container'>
          <label>Title</label>
          <FormInput
            type={'text'}
            placeholder={'Title'}
            name={'title'}
            onChange={handleChange}
          />
        </div>
        <div className='input-container'>
          <label>Description</label>
          <textarea
            type='text'
            name='description'
            placeholder='Description'
            rows='5'
            onChange={handleChange}
          ></textarea>
        </div>
        {page === 'survey' && (
          <div className='input-container'>
            <label>Survey Link</label>
            <FormInput
              type={'text'}
              placeholder={'Survey Link'}
              name={'link'}
              onChange={handleChange}
            />
          </div>
        )}
        <div className='input-container'>
          <label>Category</label>
          <select
            name='category'
            id='category'
            defaultValue=''
            onChange={handleChange}
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
            <option value='Mathematics'>Mathematics</option>
            <option value='Science'>Science</option>
            <option value='Psychology'>Psychology</option>
            <option value='Social Politics'>Social Politics</option>
            <option value='Engineering'>Engineering</option>
            <option value='Technology'>Technology</option>
          </select>
        </div>
        {page === 'survey' && (
          <div className='input-container'>
            <div className='desc'>
              <label>Reward</label>
              <span>*optional</span>
            </div>
            <FormInput
              type={'number'}
              placeholder={'Reward'}
              name={'reward'}
              onChange={handleChange}
            />
          </div>
        )}
        <div className='input-container'>
          <div className='desc'>
            <label>Image</label>
            <span>*optional</span>
          </div>
          <input
            type='file'
            name='image'
            accept='image/png, image/jpeg'
            onChange={handleChange}
          />
        </div>
      </div>
      <div className='button-container'>
        <Button variant={'submit'} link={'/'}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default ForumForm;
