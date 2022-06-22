import React from 'react';
import FormInput from '../../components/FormInput/FormInput';
import ForumForm from '../../components/ForumForm/ForumForm';
import PostCard from '../../components/PostCard/PostCard';
import SearchIcon from '@mui/icons-material/Search';
import './PostPage.scss';
import { useGet } from '../../config';
import useTokenStore from '../../Store';

const PostPage = ({ page, type }) => {
  const token = useTokenStore((state) => state.token);

  const [results, status] = useGet(
    page === 'forum' ? `post` : page === 'survey' && `questionnaires`,
    token
  );
  const [categories, getStatus] = useGet('category', token);

  const handleChange = (e) => {};

  const handleSearch = () => {};

  return (
    <div className='page'>
      {type === 'post' && (
        <div className='search-container'>
          <div className='search-bar'>
            <FormInput
              type={'text'}
              placeholder={'Search for post title'}
              name={'search'}
              onChange={handleChange}
            />
            <SearchIcon onClick={handleSearch} />
          </div>
          <select name='sort' id='sort' defaultValue='' onChange={handleChange}>
            <option value='' disabled>
              Sort by
            </option>
            <option value='newest'>Newest</option>
            <option value='oldest'>Oldest</option>
            <option value='most comments'>By Most Comments</option>
            <option value='most likes'>By Most Likes</option>
          </select>
          <select
            name='filter'
            id='filter'
            defaultValue=''
            onChange={handleChange}
          >
            <option value='' disabled>
              Filter by Category
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
      )}
      <div className='post-container'>
        {type === 'post'
          ? status &&
            results.map((result) => {
              return (
                <PostCard
                  page={page}
                  type={type}
                  data={result}
                  key={result.id}
                />
              );
            })
          : type === 'form' && <ForumForm page={page} />}
      </div>
    </div>
  );
};

export default PostPage;
