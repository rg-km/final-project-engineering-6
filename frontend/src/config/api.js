import axios from 'axios';
import create from 'zustand';
import { devtools } from 'zustand/middleware';

const defaultAxios = axios.create({
  baseURL: 'http://167.172.84.216/api/',
  timeout: 5000,
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
