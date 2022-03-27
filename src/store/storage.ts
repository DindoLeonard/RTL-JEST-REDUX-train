import SecureLS from 'secure-ls';

const secureLS = new SecureLS();

const setItem = <T>(key: string, value: T) => {
  secureLS.set(key, value);
};

const getItem = (key: string) => {
  return secureLS.get(key);
};

const clear = () => {
  localStorage.clear();
};

const storage = {
  setItem,
  getItem,
  clear,
};

export default storage;
