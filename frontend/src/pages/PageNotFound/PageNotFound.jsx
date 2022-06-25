import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageNotFound.scss';
import NotFound from '../../images/not-found.svg';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <main>
      <div className='image'>
        <img src={NotFound} alt='' />
      </div>
      <div className='text'>
        <h1>Page not found</h1>
      </div>
      <div className='btn'>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </main>
  );
};

export default PageNotFound;
