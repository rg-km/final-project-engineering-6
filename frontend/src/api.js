import axios from 'axios';
import create from 'zustand';
import { devtools } from 'zustand/middleware';

const API_URL = 'http://167.172.84.216:8080';

const defaultAxios = axios.create({
  baseURL: 'http://167.172.84.216:8080/api/',
  timeout: 1000,
});

export const useAPI = create(
  devtools(() => ({
    get: async (url, token) => {
      try {
        const res = await defaultAxios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res;
      } catch (error) {
        return error;
      }
    },
    post: async (url, data, token) => {
      if (!token) {
        try {
          const res = await defaultAxios.post(url, data);
          return res;
        } catch (error) {
          return error;
        }
      } else {
        try {
          const res = await defaultAxios.post(url, data, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return res;
        } catch (error) {
          return error;
        }
      }
    },
    put: async (url, data, token) => {
      try {
        const res = await defaultAxios.put(url, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res;
      } catch (error) {
        return error;
      }
    },
    del: async (url, token) => {
      try {
        const res = await defaultAxios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

export const createPost = async (data, token) => {
  // data category_id, title, description
  try {
    const res = await axios.post(`${API_URL}/api/post`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const uploadPostImages = async (data, id, token) => {
  // data images
  try {
    const res = await axios.post(`${API_URL}/api/post/images/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const readAllPost = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/api/post`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const readDetailPost = async (id, token) => {
  try {
    const res = await axios.get(`${API_URL}/api/post/${id}`, {
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

export const readAllComment = async (id, token) => {
  try {
    const res = await axios.get(`${API_URL}/api/comments?postID=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createComment = async (data, token) => {
  // data post_id, author_id, comment, parent_comment_id
  try {
    const res = await axios.post(`${API_URL}/api/comments`, data, {
      headers: { Authorization: `Bearer ${token}` },
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

export const createPostLike = async (data, token) => {
  try {
    const res = await axios.post(`${API_URL}/api/post/${data}/likes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deletePostLike = async (data, token) => {
  try {
    const res = await axios.delete(`${API_URL}/api/post/${data}/likes`, {
      headers: { Authorization: `${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createCommentLike = async (data, token) => {
  try {
    const res = await axios.post(`${API_URL}/api/comments/${data}/likes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteCommentLike = async (data, token) => {
  try {
    const res = await axios.delete(`${API_URL}/api/comments/${data}/likes`, {
      headers: { Authorization: `${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const readAllSurvey = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/api/questionnaires`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const readDetailSurvey = async (id, token) => {
  try {
    const res = await axios.get(`${API_URL}/api/questionnaires/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createSurvey = async (data, token) => {
  // data author_id, category_id, title, description, link
  try {
    const res = await axios.post(`${API_URL}/api/questionnaires`, data, {
      headers: { Authorization: `Bearer ${token}` },
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

export const getNotifications = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const readNotifications = async (data, token) => {
  // data notif_id
  try {
    const res = await axios.put(`${API_URL}/api/notifications/read`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getAllCategory = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/api/category`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getProfile = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateProfile = async (data, token) => {
  // data name, email
  try {
    const res = await axios.put(`${API_URL}/api/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getPostByMe = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/api/post?me=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getSurveyByMe = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/api/questionnaires?me=true`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
