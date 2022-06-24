import axios from 'axios';
import create from 'zustand';
import { devtools } from 'zustand/middleware';

const API_URL = 'http://167.172.84.216:8080';

const defaultAxios = axios.create({
  baseURL: 'http://167.172.84.216:8080/api/',
  timeout: 1000,
});

const headers = (token) => {
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const useAPI = create(
  devtools(() => ({
    get: async (url, token) => {
      try {
        const res = await defaultAxios.get(url, headers(token));
        // console.log(res);
        return res;
      } catch (error) {
        return error;
      }
    },
    post: async (url, data, token) => {
      console.log(data);

      if (!token) {
        try {
          const res = await defaultAxios.post(url, data);
          return res;
        } catch (error) {
          return error;
        }
      }

      try {
        const res = await defaultAxios.post(url, data, headers(token));
        return res;
      } catch (error) {
        return error;
      }
    },
    put: async (url, data, token) => {
      try {
        const res = await defaultAxios.put(url, data, headers(token));
        return res;
      } catch (error) {
        return error;
      }
    },
    patch: async (url, data, token) => {
      try {
        const res = await defaultAxios.patch(url, data, headers(token));
        return res;
      } catch (error) {
        return error;
      }
    },
    del: async (url, token) => {
      try {
        const res = await defaultAxios.delete(url, headers(token));
        return res;
      } catch (error) {
        return error;
      }
    },
  }))
);

export const uploadAvatar = async (data, token) => {
  // data avatar
  try {
    const res = await axios.put(`${API_URL}/api/profile/avatar`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updatePost = async (data, token) => {
  // data id, author_id, category_id, title, description
  try {
    const res = await axios.put(`${API_URL}/api/post`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deletePost = async (id, token) => {
  try {
    const res = await axios.delete(`${API_URL}/api/post/${id}`, {
      headers: { Authorization: `${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateComment = async (data, token) => {
  // data comment_id, comment
  try {
    const res = await axios.put(`${API_URL}/api/comments`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteComment = async (id, token) => {
  try {
    const res = await axios.delete(`${API_URL}/api/comment${id}`, {
      headers: { Authorization: `${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateSurvey = async (data, token) => {
  // data id, category_id, title, description, link
  try {
    const res = await axios.put(`${API_URL}/api/questionnaires`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteSurvey = async (id, token) => {
  try {
    const res = await axios.delete(`${API_URL}/api/questionnaires/${id}`, {
      headers: { Authorization: `${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
