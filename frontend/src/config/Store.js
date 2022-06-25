import create from 'zustand';

function getWithExpiry() {
  const itemStr = localStorage.getItem('token');
  const item = JSON.parse(itemStr);
  const now = new Date();

  if (!itemStr) {
    return null;
  }

  if (now.getTime() > item.expiry) {
    localStorage.removeItem('token');
    return null;
  }

  return item.token;
}

const useTokenStore = create((set) => ({
  token: getWithExpiry(),
  setToken: (input) => {
    const now = new Date();
    set(() => ({ token: input }));
    localStorage.setItem(
      'token',
      JSON.stringify({
        token: input,
        expiry: now.getTime() + 3600000,
      })
    );
  },
}));

export const useAlertStore = create((set) => ({
  show: false,
  setShow: (input) => set(() => ({ show: input })),
  succeed: false,
  setSucceed: (input) => set(() => ({ succeed: input })),
  message: '',
  setMessage: (input) => set(() => ({ message: input })),
}));

export const useConfirmStore = create((set) => ({
  show: false,
  setShow: (input) => set(() => ({ show: input })),
  page: '',
  setPage: (input) => set(() => ({ page: input })),
  message: '',
  setMessage: (input) => set(() => ({ message: input })),
  type: '',
  setType: (input) => set(() => ({ type: input })),
}));

export const useEditStore = create((set) => ({
  data: {},
  setData: (input) => set(() => ({ data: input })),
  click: false,
  setClick: (input) => set(() => ({ click: input })),
}));

export const useDeleteStore = create((set) => ({
  id: 0,
  setId: (input) => set(() => ({ id: input })),
}));

export default useTokenStore;
