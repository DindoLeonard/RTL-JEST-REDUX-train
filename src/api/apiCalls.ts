import axios from 'axios';
import i18n from '../locale/i18n';

type IProps = {
  username: string;
  email: string;
  password: string;
};

export const signUp = (body: IProps) => {
  return axios.post('/api/1.0/users', body, {
    headers: {
      'Accept-Language': i18n.language,
    },
  });
};

export const activate = (token: string) => {
  return axios.post('/api/1.0/users/token/' + token);
};

export const loadUsers = () => {
  return axios.get<{
    content: {
      id: number;
      username: string;
      email: string;
      image: string | null;
    }[];
    page: number;
    size: number;
    totalPages: number;
  }>('/api/1.0/users', { params: { page: 0, size: 3 } });
};
