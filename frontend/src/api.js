import axios from 'axios';

const API_URL = 'https://localhost:8080';

export const login = async (data) => {
  // data email, password
  try {
    const res = await axios.post(`${API_URL}/api/login`, data);
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
  }
};

export const register = async (data) => {
  // data name, email, password, role, institute, major, batch
  try {
    const res = await axios.post(`${API_URL}/api/register`, data);
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
  }
};

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
  }
};

export const createPost = async (data, token) => {
  // data author_id, category_id, title, description
  try {
    const res = await axios.post(`${API_URL}/api/post`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
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
  }
};

export const deletePost = async (data, token) => {
  // data id, author_id
  try {
    const res = await axios.delete(`${API_URL}/api/post`, {
      headers: { Authorization: `${token}` },
      data: data,
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
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
  }
};

export const createPostLike = async (data, token) => {
  // data post_id, user_id
  try {
    const res = await axios.post(`${API_URL}/api/post-likes`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
  }
};

export const deletePostLike = async (data, token) => {
  // data post_id, user_id
  try {
    const res = await axios.delete(`${API_URL}/api/post-likes`, {
      headers: { Authorization: `${token}` },
      data: data,
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
  }
};

export const createCommentLike = async (data, token) => {
  // data comment_id, user_id
  try {
    const res = await axios.post(`${API_URL}/api/comment-likes`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCommentLike = async (data, token) => {
  // data comment_id, user_id
  try {
    const res = await axios.delete(`${API_URL}/api/comment-likes`, {
      headers: { Authorization: `${token}` },
      data: data,
    });
    console.log(res);
    if (res.status === 200) return res;
  } catch (error) {
    console.log(error);
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
  }
};
