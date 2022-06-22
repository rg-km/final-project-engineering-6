import { useState, useEffect } from 'react';
import { useAPI } from './api';

// const useGetCategories = (token) => {
//   const [categories, setCategories] = useState({});
//   const [status, setStatus] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await getAllCategory(token);
//       if (res.status === 200) {
//         setStatus(true);
//         setCategories(res.data);
//       } else {
//         setStatus(false);
//       }
//     };
//     fetchData();
//   }, [token]);

//   return [categories, status];
// };

export const useGet = (url, token) => {
  const [result, setResult] = useState({});
  const [status, setStatus] = useState(false);
  const { get } = useAPI((state) => state);

  useEffect(() => {
    const fetchData = async () => {
      const res = await get(url, token);
      if (res.status === 200) {
        setStatus(true);
        setResult(res.data);
      } else {
        setStatus(false);
      }
    };

    fetchData();
  }, [get, token, url]);

  return [result, status];
};
