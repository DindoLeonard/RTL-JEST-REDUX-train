const setItem = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getItem = (key: string) => {
  const storedState = localStorage.getItem(key);

  if (!storedState) {
    return null;
  }

  try {
    return JSON.parse(storedState);
  } catch (e) {
    return storedState;
  }
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
