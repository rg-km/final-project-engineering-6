import create from 'zustand';

const useTokenStore = create((set) => ({
  token: null || localStorage.getItem('token'),
  setToken: (input) => {
    set(() => ({ token: input }));
    localStorage.setItem('token', input);
  },
}));

export default useTokenStore;
