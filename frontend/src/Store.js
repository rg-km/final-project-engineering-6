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

export default useTokenStore;
