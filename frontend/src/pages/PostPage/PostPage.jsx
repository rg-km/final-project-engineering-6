import React, { useEffect, useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import ForumForm from '../../components/ForumForm/ForumForm';
import PostCard from '../../components/PostCard/PostCard';
import NotFound from '../../images/not-found.svg';
import './PostPage.scss';
import { useGet } from '../../config/config';
import useTokenStore from '../../config/Store';
import { useAPI } from '../../config/api';

const PostPage = ({ page, type }) => {
  const token = useTokenStore((state) => state.token);
  const [url, setUrl] = useState('');
  const [results, setResults] = useState({});
  const [status, setStatus] = useState(false);
  const [searchData, setSearchData] = useState({});
  const { get } = useAPI((state) => state);

  const getData = async () => {
    const result = await get(
      url
        ? url
        : page === 'forum'
        ? `post`
        : page === 'survey' && `questionnaires`,
      token
    );

    if (result.status === 200) {
      setResults(result.data);
      setStatus(true);
    } else {
      setStatus(false);
    }
  };

  const [categories, getStatus] = useGet('category', token);

  const handleChange = (eventValue, eventName) => {
    setSearchData((previousValues) => {
      return {
        ...previousValues,
        [eventName]: eventValue,
      };
    });
  };

  useEffect(() => {
    if (type === 'form') return;
    getData();
  }, [url, type]);

  useEffect(() => {
    if (type === 'form') return;
    const doSearch = () => {
      const { search = '', sort = '', filter = '' } = searchData;

      setUrl(
        page === 'forum'
          ? `post?${search && `search_title=${search}`}${
              sort && `${search && '&'}sort_by=${sort}`
            }${filter && `${(search || sort) && '&'}category_id=${filter}`}`
          : page === 'survey' &&
              `questionnaires?${search && `search_title=${search}`}${
                sort && `${search && '&'}sort_by=${sort}`
              }${filter && `${(search || sort) && '&'}category_id=${filter}`}`
      );
    };
    doSearch();
  }, [searchData, page, type]);

  return (
    <div className='page'>
      {type === 'post' && (
        <div className='search-container'>
          <div className='search-bar'>
            <FormInput
              type={'text'}
              placeholder={'Search for post title'}
              name={'search'}
              value={searchData.search ? searchData.search : ''}
              onChange={handleChange}
            />
          </div>
          <div className='search-dropdown'>
            <select
              name='sort'
              id='sort'
              defaultValue=''
              onChange={(e) => handleChange(e.target.value, e.target.name)}
            >
              <option value='' disabled>
                Sort by
              </option>
              <option value=''>Default</option>
              <option value='newest'>Newest</option>
              <option value='oldest'>Oldest</option>
              <option value='most_commented'>By Most Comments</option>
              <option value='most_liked'>By Most Likes</option>
            </select>
            <select
              name='filter'
              id='filter'
              defaultValue=''
              onChange={(e) => handleChange(e.target.value, e.target.name)}
            >
              <option value='' disabled>
                Filter by Category
              </option>
              <option value=''>All Category</option>
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
        </div>
      )}
      <div className='post-container'>
        {type === 'post'
          ? status &&
            (results ? (
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
            ) : (
              <>
                <div className='image'>
                  <img src={NotFound} alt='' />
                </div>
                <div className='text'>
                  <h1>Post not found</h1>
                </div>
              </>
            ))
          : type === 'form' && <ForumForm page={page} />}
      </div>
    </div>
  );
};

export default PostPage;
